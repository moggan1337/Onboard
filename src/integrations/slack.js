/**
 * Slack Integration - Send notifications and updates to Slack
 * Supports channels, users, and interactive messages
 */

import chalk from 'chalk';

/**
 * Slack message templates
 */
const MESSAGE_TEMPLATES = {
  welcome: {
    title: 'Welcome to the Team! 🎉',
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Welcome to the Team!' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Welcome {userName}! We\'re excited to have you join us.'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Your Onboarding Journey Starts Now*'
        }
      }
    ]
  },
  progress: {
    title: 'Onboarding Progress Update',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📊 Onboarding Progress' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Progress for* ${data.userName}\nCurrent Phase: *${data.phase}*\nCompletion: ${data.percentage}%`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Completed: ${data.completed} of ${data.total} tasks`
        }
      }
    ]
  },
  milestone: {
    title: 'Milestone Achieved! 🏆',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🏆 Milestone Achieved!' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.userName}* just earned the *${data.milestoneName}* milestone!`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.milestoneDescription
        }
      }
    ]
  },
  taskReminder: {
    title: 'Task Reminder',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '⏰ Task Reminder' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey ${data.userName}! You have a pending task:`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.taskTitle}*\n${data.taskDescription}`
        }
      }
    ]
  },
  prReview: {
    title: 'Code Review Request',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔍 Code Review Request' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.prTitle}*\nBy ${data.author}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: data.prDescription
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Review PR' },
            url: data.prUrl
          }
        ]
      }
    ]
  },
  dailySummary: {
    title: 'Daily Onboarding Summary',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Daily Summary' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${data.date}*\n\n*New team members:* ${data.newMembers}\n*Tasks completed:* ${data.tasksCompleted}\n*Milestones earned:* ${data.milestonesEarned}`
        }
      }
    ]
  }
};

export class SlackIntegration {
  constructor(config = {}) {
    this.config = {
      webhookUrl: config.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL,
      botToken: config.slackBotToken || process.env.SLACK_BOT_TOKEN,
      defaultChannel: config.defaultChannel || '#general',
      username: config.username || 'Onboard Bot',
      iconEmoji: config.iconEmoji || ':robot_face:',
      ...config
    };
    
    this.httpClient = null;
  }

  /**
   * Initialize HTTP client
   */
  async initialize() {
    if (this.config.botToken && !this.httpClient) {
      const { default: fetch } = await import('node-fetch');
      this.httpClient = fetch;
    }
  }

  /**
   * Send a message to a channel
   */
  async send(message, channel = null) {
    const targetChannel = channel || this.config.defaultChannel;
    
    console.log(chalk.cyan(`  📤 Sending message to Slack channel: ${targetChannel}`));

    try {
      if (this.config.webhookUrl) {
        return await this.sendViaWebhook(targetChannel, message);
      } else if (this.config.botToken) {
        return await this.sendViaAPI(targetChannel, message);
      } else {
        console.log(chalk.yellow('  ⚠️  No Slack credentials configured. Message logged:'));
        console.log(message);
        return { success: true, mode: 'log' };
      }
    } catch (error) {
      console.error(chalk.red('  ❌ Failed to send Slack message:'), error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send message via webhook
   */
  async sendViaWebhook(channel, message) {
    const payload = {
      channel: channel,
      username: this.config.username,
      icon_emoji: this.config.iconEmoji,
      ...(typeof message === 'string' 
        ? { text: message }
        : { blocks: message.blocks || [message] })
    };

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
   * Send message via Slack API
   */
  async sendViaAPI(channel, message) {
    await this.initialize();
    
    // Resolve channel name to ID if needed
    const channelId = await this.resolveChannel(channel);
    
    const payload = {
      channel: channelId,
      username: this.config.username,
      icon_emoji: this.config.iconEmoji,
      ...(typeof message === 'string'
        ? { text: message }
        : { blocks: message.blocks || [message] })
    };

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Slack API error: ${result.error}`);
    }

    return { success: true, mode: 'api', ts: result.ts };
  }

  /**
   * Send a formatted message using a template
   */
  async sendTemplate(templateName, data, channel = null) {
    const template = MESSAGE_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    const blocks = typeof template.blocks === 'function'
      ? template.blocks(data)
      : template.blocks;

    // Replace placeholders
    const message = this.replacePlaceholders(blocks, data);
    
    return this.send({ blocks: message }, channel);
  }

  /**
   * Replace placeholders in message blocks
   */
  replacePlaceholders(blocks, data) {
    return blocks.map(block => {
      if (block.text) {
        return {
          ...block,
          text: {
            ...block.text,
            text: this.replaceInString(block.text.text, data),
            ...(block.text.emoji !== undefined ? {} : {})
          }
        };
      }
      return block;
    });
  }

  /**
   * Replace placeholders in a string
   */
  replaceInString(str, data) {
    let result = str;
    for (const [key, value] of Object.entries(data)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  /**
   * Resolve channel name to ID
   */
  async resolveChannel(channelName) {
    // If it starts with C or G, it's already an ID
    if (channelName.match(/^[CGD]\w+$/)) {
      return channelName;
    }

    await this.initialize();
    
    // Remove # prefix if present
    const cleanName = channelName.replace(/^#/, '');
    
    const response = await fetch('https://slack.com/api/conversations.list', {
      headers: { 'Authorization': `Bearer ${this.config.botToken}` }
    });
    
    const result = await response.json();
    
    if (result.ok) {
      const channel = result.channels.find(c => c.name === cleanName);
      if (channel) {
        return channel.id;
      }
    }
    
    // Return original if not found
    return cleanName;
  }

  /**
   * Send welcome message to new team member
   */
  async sendWelcome(userName, userId, channel = null) {
    return this.sendTemplate('welcome', { userName, userId }, channel);
  }

  /**
   * Send progress update
   */
  async sendProgress(userName, phase, percentage, completed, total) {
    return this.sendTemplate('progress', {
      userName,
      phase,
      percentage,
      completed,
      total
    });
  }

  /**
   * Send milestone achievement notification
   */
  async sendMilestone(userName, milestoneName, milestoneDescription) {
    return this.sendTemplate('milestone', {
      userName,
      milestoneName,
      milestoneDescription
    });
  }

  /**
   * Send task reminder
   */
  async sendTaskReminder(userName, taskTitle, taskDescription, userId = null) {
    return this.sendTemplate('taskReminder', {
      userName,
      taskTitle,
      taskDescription,
      userId
    });
  }

  /**
   * Send PR review request
   */
  async sendPRReview(prTitle, author, prDescription, prUrl, reviewers = []) {
    for (const reviewer of reviewers) {
      await this.sendTemplate('prReview', {
        prTitle,
        author,
        prDescription,
        prUrl
      }, reviewer);
    }
  }

  /**
   * Send daily summary
   */
  async sendDailySummary(newMembers, tasksCompleted, milestonesEarned) {
    return this.sendTemplate('dailySummary', {
      date: new Date().toLocaleDateString(),
      newMembers,
      tasksCompleted,
      milestonesEarned
    });
  }

  /**
   * Create an interactive message with buttons
   */
  async sendInteractive(blocks, channel = null, callbackId = 'onboard_action') {
    const message = {
      blocks,
      attachment: [
        {
          callback_id: callbackId,
          actions: []
        }
      ]
    };

    return this.send(message, channel);
  }

  /**
   * Get channel info
   */
  async getChannelInfo(channelName) {
    await this.initialize();
    
    const channelId = await this.resolveChannel(channelName);
    
    const response = await fetch(`https://slack.com/api/conversations.info?channel=${channelId}`, {
      headers: { 'Authorization': `Bearer ${this.config.botToken}` }
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Failed to get channel info: ${result.error}`);
    }

    return result.channel;
  }

  /**
   * List available channels
   */
  async listChannels() {
    await this.initialize();
    
    const response = await fetch('https://slack.com/api/conversations.list', {
      headers: { 'Authorization': `Bearer ${this.config.botToken}` }
    });
    
    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Failed to list channels: ${result.error}`);
    }

    return result.channels;
  }

  /**
   * Schedule a message (using Slack's scheduled messages API)
   */
  async scheduleMessage(message, channel, postAt) {
    await this.initialize();
    
    const channelId = await this.resolveChannel(channel);
    const postAtTimestamp = new Date(postAt).getTime() / 1000;
    
    const payload = {
      channel: channelId,
      post_at: postAtTimestamp,
      text: typeof message === 'string' ? message : message.text
    };

    const response = await fetch('https://slack.com/api/chat.scheduleMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Failed to schedule message: ${result.error}`);
    }

    return { success: true, scheduledMessageId: result.scheduled_message_id };
  }

  /**
   * Build a rich message block
   */
  buildMessage(components) {
    return {
      blocks: components
    };
  }

  /**
   * Build a section with text
   */
  buildSection(text, options = {}) {
    return {
      type: 'section',
      text: {
        type: options.type || 'mrkdwn',
        text
      },
      ...(options.accessory ? { accessory: options.accessory } : {})
    };
  }

  /**
   * Build a divider
   */
  buildDivider() {
    return { type: 'divider' };
  }

  /**
   * Build a button action
   */
  buildButton(text, actionId, value, url = null) {
    return {
      type: 'button',
      text: { type: 'plain_text', text },
      action_id: actionId,
      value,
      ...(url ? { url } : {})
    };
  }
}

export default SlackIntegration;
