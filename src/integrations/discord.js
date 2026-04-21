/**
 * Discord Integration - Send notifications and updates to Discord
 * Supports channels, users, embeds, and interactive components
 */

import chalk from 'chalk';

/**
 * Discord embed colors (decimal)
 */
const EMBED_COLORS = {
  success: 0x00ff00,
  warning: 0xffaa00,
  error: 0xff0000,
  info: 0x3498db,
  purple: 0x9b59b6,
  gold: 0xffd700
};

/**
 * Discord message templates
 */
const MESSAGE_TEMPLATES = {
  welcome: {
    embed: (data) => ({
      title: '🎉 Welcome to the Team!',
      description: `Welcome **${data.userName}**! We're excited to have you join us.`,
      color: EMBED_COLORS.purple,
      fields: [
        { name: 'Start Date', value: data.startDate, inline: true },
        { name: 'Skill Level', value: data.skillLevel, inline: true }
      ],
      footer: { text: 'Your onboarding journey begins now!' }
    })
  },
  progress: {
    embed: (data) => ({
      title: '📊 Onboarding Progress Update',
      color: EMBED_COLORS.info,
      fields: [
        { name: 'Team Member', value: data.userName, inline: true },
        { name: 'Current Phase', value: data.phase, inline: true },
        { name: 'Completion', value: `${data.percentage}%`, inline: true },
        { name: 'Tasks', value: `${data.completed}/${data.total}`, inline: true }
      ],
      footer: { text: 'Keep up the great work!' }
    })
  },
  milestone: {
    embed: (data) => ({
      title: '🏆 Milestone Achieved!',
      description: `**${data.userName}** just earned the **${data.milestoneName}** milestone!`,
      color: EMBED_COLORS.gold,
      fields: [
        { name: 'Achievement', value: data.milestoneDescription, inline: false }
      ],
      footer: { text: 'Congratulations!' }
    })
  },
  taskReminder: {
    embed: (data) => ({
      title: '⏰ Task Reminder',
      description: `Hey ${data.userName}! You have a pending task:`,
      color: EMBED_COLORS.warning,
      fields: [
        { name: 'Task', value: data.taskTitle, inline: false },
        { name: 'Description', value: data.taskDescription, inline: false }
      ],
      footer: { text: 'Don\'t forget to complete it!' }
    })
  },
  prReview: {
    embed: (data) => ({
      title: '🔍 Code Review Request',
      description: `**${data.prTitle}**`,
      color: EMBED_COLORS.info,
      fields: [
        { name: 'Author', value: data.author, inline: true },
        { name: 'Status', value: 'Pending Review', inline: true }
      ],
      description: `${data.prDescription}\n\n[Review PR](${data.prUrl})`,
      footer: { text: 'Your review is requested' }
    })
  },
  dailySummary: {
    embed: (data) => ({
      title: '📋 Daily Onboarding Summary',
      color: EMBED_COLORS.info,
      fields: [
        { name: 'Date', value: data.date, inline: true },
        { name: 'New Members', value: String(data.newMembers), inline: true },
        { name: 'Tasks Completed', value: String(data.tasksCompleted), inline: true },
        { name: 'Milestones Earned', value: String(data.milestonesEarned), inline: true }
      ],
      footer: { text: 'Daily Onboarding Report' }
    })
  }
};

export class DiscordIntegration {
  constructor(config = {}) {
    this.config = {
      webhookUrl: config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL,
      botToken: config.discordBotToken || process.env.DISCORD_BOT_TOKEN,
      defaultChannel: config.defaultChannel || null,
      username: config.username || 'Onboard Bot',
      avatarUrl: config.avatarUrl,
      ...config
    };
  }

  /**
   * Send a message to a channel
   */
  async send(message, channelId = null) {
    const targetChannel = channelId || this.config.defaultChannel;
    
    console.log(chalk.cyan(`  📤 Sending message to Discord channel: ${targetChannel || 'webhook'}`));

    try {
      if (this.config.webhookUrl) {
        return await this.sendViaWebhook(message);
      } else if (this.config.botToken) {
        return await this.sendViaAPI(message, targetChannel);
      } else {
        console.log(chalk.yellow('  ⚠️  No Discord credentials configured. Message logged:'));
        console.log(message);
        return { success: true, mode: 'log' };
      }
    } catch (error) {
      console.error(chalk.red('  ❌ Failed to send Discord message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send message via webhook
   */
  async sendViaWebhook(message) {
    const payload = this.buildPayload(message);

    const response = await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    return { success: true, mode: 'webhook' };
  }

  /**
   * Send message via Discord Bot API
   */
  async sendViaAPI(message, channelId) {
    if (!channelId) {
      throw new Error('Channel ID required for bot API');
    }

    const payload = this.buildPayload(message);

    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${this.config.botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Discord API error: ${result.message || response.statusText}`);
    }

    return { success: true, mode: 'api', messageId: result.id };
  }

  /**
   * Build Discord message payload
   */
  buildPayload(message) {
    const payload = {
      username: this.config.username
    };

    if (this.config.avatarUrl) {
      payload.avatar_url = this.config.avatarUrl;
    }

    if (typeof message === 'string') {
      payload.content = message;
    } else if (message.embed) {
      payload.embeds = [message.embed];
    } else if (message.embeds) {
      payload.embeds = message.embeds;
    } else if (message.content) {
      payload.content = message.content;
      if (message.embed) {
        payload.embeds = [message.embed];
      }
    }

    return payload;
  }

  /**
   * Send a formatted message using a template
   */
  async sendTemplate(templateName, data, channelId = null) {
    const template = MESSAGE_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    const embed = template.embed(data);
    return this.send({ embed }, channelId);
  }

  /**
   * Send welcome message
   */
  async sendWelcome(userName, startDate, skillLevel, channelId = null) {
    return this.sendTemplate('welcome', { userName, startDate, skillLevel }, channelId);
  }

  /**
   * Send progress update
   */
  async sendProgress(userName, phase, percentage, completed, total, channelId = null) {
    return this.sendTemplate('progress', {
      userName,
      phase,
      percentage,
      completed,
      total
    }, channelId);
  }

  /**
   * Send milestone notification
   */
  async sendMilestone(userName, milestoneName, milestoneDescription, channelId = null) {
    return this.sendTemplate('milestone', {
      userName,
      milestoneName,
      milestoneDescription
    }, channelId);
  }

  /**
   * Send task reminder
   */
  async sendTaskReminder(userName, taskTitle, taskDescription, channelId = null) {
    return this.sendTemplate('taskReminder', {
      userName,
      taskTitle,
      taskDescription
    }, channelId);
  }

  /**
   * Send PR review request
   */
  async sendPRReview(prTitle, author, prDescription, prUrl, channelId = null) {
    return this.sendTemplate('prReview', {
      prTitle,
      author,
      prDescription,
      prUrl
    }, channelId);
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(newMembers, tasksCompleted, milestonesEarned, channelId = null) {
    return this.sendTemplate('dailySummary', {
      date: new Date().toLocaleDateString(),
      newMembers,
      tasksCompleted,
      milestonesEarned
    }, channelId);
  }

  /**
   * Create a rich embed
   */
  createEmbed(options) {
    return {
      title: options.title,
      description: options.description,
      url: options.url,
      color: options.color || EMBED_COLORS.info,
      author: options.author ? {
        name: options.author.name,
        icon_url: options.author.iconUrl
      } : undefined,
      fields: options.fields,
      thumbnail: options.thumbnail ? {
        url: options.thumbnail
      } : undefined,
      image: options.image ? {
        url: options.image
      } : undefined,
      footer: options.footer ? {
        text: options.footer.text,
        icon_url: options.footer.iconUrl
      } : undefined,
      timestamp: options.timestamp ? new Date().toISOString() : undefined
    };
  }

  /**
   * Build an embed field
   */
  createField(name, value, inline = true) {
    return { name, value: String(value), inline };
  }

  /**
   * Send multiple embeds
   */
  async sendEmbeds(embeds, channelId = null) {
    return this.send({ embeds }, channelId);
  }

  /**
   * Send a file upload
   */
  async sendFile(filePath, message = '', channelId = null) {
    const FormData = (await import('form-data')).default;
    const fs = await import('fs');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    if (message) {
      form.append('content', message);
    }

    const url = this.config.webhookUrl || 
      `https://discord.com/api/v10/channels/${channelId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.config.webhookUrl 
        ? form.getHeaders()
        : { 'Authorization': `Bot ${this.config.botToken}` },
      body: form
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send file: ${error}`);
    }

    return { success: true };
  }

  /**
   * Create a channel (requires bot with proper permissions)
   */
  async createChannel(guildId, name, type = 0) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${this.config.botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to create channel: ${result.message}`);
    }

    return result;
  }

  /**
   * Get channel info
   */
  async getChannel(channelId) {
    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
      headers: { 'Authorization': `Bot ${this.config.botToken}` }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to get channel: ${result.message}`);
    }

    return result;
  }

  /**
   * List guild channels
   */
  async listChannels(guildId) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { 'Authorization': `Bot ${this.config.botToken}` }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to list channels: ${result.message}`);
    }

    return result.filter(c => c.type === 0); // Text channels only
  }

  /**
   * Add reaction to a message
   */
  async addReaction(channelId, messageId, emoji) {
    const encodedEmoji = encodeURIComponent(emoji);
    
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}/reactions/${encodedEmoji}/@me`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bot ${this.config.botToken}` }
      }
    );

    if (!response.ok && response.status !== 204) {
      const result = await response.json();
      throw new Error(`Failed to add reaction: ${result.message}`);
    }

    return { success: true };
  }

  /**
   * Send a direct message to a user
   */
  async sendDM(userId, message) {
    // First, create DM channel
    const dmResponse = await fetch('https://discord.com/api/v10/users/@me/channels', {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${this.config.botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipient_id: userId })
    });

    const dm = await dmResponse.json();

    if (!dmResponse.ok) {
      throw new Error(`Failed to create DM: ${dm.message}`);
    }

    // Send message to DM channel
    return this.sendViaAPI(message, dm.id);
  }

  /**
   * Build button components (for interactive messages)
   */
  buildComponents(rows) {
    return {
      type: 1,
      components: rows.map(row => ({
        type: 2, // Button
        style: row.style || 1, // Primary
        label: row.label,
        custom_id: row.customId,
        url: row.url,
        disabled: row.disabled
      }))
    };
  }

  /**
   * Build select menu components
   */
  buildSelectMenu(options) {
    return {
      type: 1,
      components: [{
        type: 5, // Select menu
        placeholder: options.placeholder,
        custom_id: options.customId,
        options: options.options.map(opt => ({
          label: opt.label,
          value: opt.value,
          description: opt.description,
          emoji: opt.emoji
        }))
      }]
    };
  }
}

export default DiscordIntegration;
