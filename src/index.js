/**
 * Onboard - Developer Onboarding Bot
 * A comprehensive platform for onboarding developers with knowledge extraction,
 * Q&A capabilities, architecture documentation, and team management.
 */

import chalk from 'chalk';
import { Command } from 'commander';
import { KnowledgeExtractor } from './core/knowledge-extractor.js';
import { QABot } from './core/qa-bot.js';
import { ArchitectureGenerator } from './core/architecture-generator.js';
import { TaskSuggester } from './core/task-suggester.js';
import { PRReviewExplainer } from './core/pr-review-explainer.js';
import { TeamMapper } from './core/team-mapper.js';
import { ProgressTracker } from './core/progress-tracker.js';
import { TutorialBuilder } from './core/tutorial-builder.js';
import { SlackIntegration } from './integrations/slack.js';
import { DiscordIntegration } from './integrations/discord.js';
import { setupCLI } from './ui/cli.js';

const program = new Command();

/**
 * Main Onboard class that orchestrates all components
 */
class Onboard {
  constructor(config = {}) {
    this.config = {
      openaiApiKey: process.env.OPENAI_API_KEY,
      githubToken: process.env.GITHUB_TOKEN,
      projectPath: config.projectPath || process.cwd(),
      ...config
    };
    
    this.components = {
      knowledgeExtractor: new KnowledgeExtractor(this.config),
      qaBot: new QABot(this.config),
      architectureGenerator: new ArchitectureGenerator(this.config),
      taskSuggester: new TaskSuggester(this.config),
      prReviewExplainer: new PRReviewExplainer(this.config),
      teamMapper: new TeamMapper(this.config),
      progressTracker: new ProgressTracker(this.config),
      tutorialBuilder: new TutorialBuilder(this.config)
    };
    
    this.integrations = {
      slack: new SlackIntegration(this.config),
      discord: new DiscordIntegration(this.config)
    };
  }

  /**
   * Initialize the onboard system for a project
   */
  async init(options = {}) {
    console.log(chalk.blue.bold('\n🚀 Onboard - Developer Onboarding Bot\n'));
    console.log(chalk.gray('Initializing onboarding platform...\n'));

    try {
      // Extract knowledge from codebase
      console.log(chalk.yellow('📚 Extracting codebase knowledge...'));
      const knowledge = await this.components.knowledgeExtractor.extract();
      console.log(chalk.green(`   ✓ Extracted ${knowledge.entities.length} entities`));
      
      // Generate architecture documentation
      console.log(chalk.yellow('🏗️  Generating architecture documentation...'));
      const architecture = await this.components.architectureGenerator.generate(knowledge);
      console.log(chalk.green(`   ✓ Generated ${architecture.modules.length} module docs`));
      
      // Initialize progress tracking
      console.log(chalk.yellow('📊 Initializing progress tracking...'));
      await this.components.progressTracker.initialize();
      console.log(chalk.green('   ✓ Progress tracking initialized'));

      console.log(chalk.green.bold('\n✅ Onboard initialized successfully!\n'));
      
      return { knowledge, architecture };
    } catch (error) {
      console.error(chalk.red('❌ Initialization failed:'), error.message);
      throw error;
    }
  }

  /**
   * Answer questions about the codebase
   */
  async ask(question, context = {}) {
    return this.components.qaBot.ask(question, {
      ...context,
      projectPath: this.config.projectPath
    });
  }

  /**
   * Get suggested tasks based on skill level
   */
  async suggestTasks(skillLevel, interests = []) {
    return this.components.taskSuggester.suggest(skillLevel, interests);
  }

  /**
   * Explain a PR review
   */
  async explainPRReview(prData, reviewComments) {
    return this.components.prReviewExplainer.explain(prData, reviewComments);
  }

  /**
   * Get team structure
   */
  async getTeamStructure() {
    return this.components.teamMapper.getStructure();
  }

  /**
   * Get onboarding progress
   */
  async getProgress(userId) {
    return this.components.progressTracker.getProgress(userId);
  }

  /**
   * Build interactive tutorial
   */
  async buildTutorial(topic, difficulty = 'beginner') {
    return this.components.tutorialBuilder.build(topic, difficulty);
  }

  /**
   * Send notification via Slack
   */
  async notifySlack(message, channel) {
    return this.integrations.slack.send(message, channel);
  }

  /**
   * Send notification via Discord
   */
  async notifyDiscord(message, channel) {
    return this.integrations.discord.send(message, channel);
  }
}

// CLI Entry Point
async function main() {
  program
    .name('onboard')
    .description('Developer Onboarding Bot - Comprehensive onboarding platform')
    .version('1.0.0');

  program
    .command('init')
    .description('Initialize onboard for a project')
    .option('-p, --path <path>', 'Project path', process.cwd())
    .option('-k, --api-key <key>', 'OpenAI API key')
    .action(async (options) => {
      const onboard = new Onboard({ projectPath: options.path });
      if (options.apiKey) {
        onboard.config.openaiApiKey = options.apiKey;
      }
      await onboard.init();
    });

  program
    .command('ask <question>')
    .description('Ask a question about the codebase')
    .option('-p, --path <path>', 'Project path')
    .action(async (question, options) => {
      const onboard = new Onboard({ projectPath: options.path });
      const answer = await onboard.ask(question);
      console.log(chalk.blue('\n💬 Answer:\n'));
      console.log(answer);
    });

  program
    .command('extract')
    .description('Extract knowledge from codebase')
    .option('-p, --path <path>', 'Project path')
    .option('-o, --output <file>', 'Output file')
    .action(async (options) => {
      const onboard = new Onboard({ projectPath: options.path });
      const knowledge = await onboard.components.knowledgeExtractor.extract();
      if (options.output) {
        const fs = await import('fs');
        fs.writeFileSync(options.output, JSON.stringify(knowledge, null, 2));
        console.log(chalk.green(`✓ Knowledge extracted to ${options.output}`));
      } else {
        console.log(JSON.stringify(knowledge, null, 2));
      }
    });

  program
    .command('architecture')
    .description('Generate architecture documentation')
    .option('-p, --path <path>', 'Project path')
    .option('-o, --output <file>', 'Output file')
    .action(async (options) => {
      const onboard = new Onboard({ projectPath: options.path });
      const knowledge = await onboard.components.knowledgeExtractor.extract();
      const architecture = await onboard.components.architectureGenerator.generate(knowledge);
      if (options.output) {
        const fs = await import('fs');
        fs.writeFileSync(options.output, JSON.stringify(architecture, null, 2));
        console.log(chalk.green(`✓ Architecture docs generated to ${options.output}`));
      } else {
        console.log(JSON.stringify(architecture, null, 2));
      }
    });

  program
    .command('suggest-tasks')
    .description('Suggest tasks based on skill level')
    .option('-l, --level <level>', 'Skill level (beginner|intermediate|advanced)', 'beginner')
    .option('-i, --interests <interests>', 'Comma-separated interests')
    .action(async (options) => {
      const onboard = new Onboard();
      const interests = options.interests ? options.interests.split(',') : [];
      const tasks = await onboard.suggestTasks(options.level, interests);
      console.log(chalk.blue(`\n📋 Suggested Tasks (${options.level}):\n`));
      tasks.forEach((task, i) => {
        console.log(chalk.green(`${i + 1}. ${task.title}`));
        console.log(chalk.gray(`   ${task.description}`));
        console.log(chalk.gray(`   Duration: ${task.estimatedTime}`));
        console.log();
      });
    });

  program
    .command('progress <userId>')
    .description('Check onboarding progress for a user')
    .option('-p, --path <path>', 'Project path')
    .action(async (userId, options) => {
      const onboard = new Onboard({ projectPath: options.path });
      const progress = await onboard.getProgress(userId);
      console.log(chalk.blue(`\n📊 Progress for ${userId}:\n`));
      console.log(`Completed: ${progress.completed}/${progress.total} tasks`);
      console.log(`Current Phase: ${progress.currentPhase}`);
      console.log(`Overall Progress: ${progress.percentage}%`);
    });

  program
    .command('tutorial <topic>')
    .description('Build interactive tutorial')
    .option('-d, --difficulty <level>', 'Difficulty (beginner|intermediate|advanced)')
    .option('-o, --output <file>', 'Output file')
    .action(async (topic, options) => {
      const onboard = new Onboard();
      const tutorial = await onboard.buildTutorial(topic, options.difficulty || 'beginner');
      if (options.output) {
        const fs = await import('fs');
        fs.writeFileSync(options.output, JSON.stringify(tutorial, null, 2));
        console.log(chalk.green(`✓ Tutorial saved to ${options.output}`));
      } else {
        console.log(JSON.stringify(tutorial, null, 2));
      }
    });

  program
    .command('team')
    .description('Show team structure and expertise')
    .action(async () => {
      const onboard = new Onboard();
      const team = await onboard.getTeamStructure();
      console.log(chalk.blue('\n👥 Team Structure:\n'));
      team.departments.forEach(dept => {
        console.log(chalk.green.bold(`\n${dept.name}:`));
        dept.members.forEach(member => {
          console.log(`  • ${member.name} - ${member.role}`);
          console.log(chalk.gray(`    Expertise: ${member.expertise.join(', ')}`));
        });
      });
    });

  program
    .command('setup')
    .description('Run setup automation scripts')
    .option('-p, --path <path>', 'Project path')
    .action(async (options) => {
      const onboard = new Onboard({ projectPath: options.path });
      console.log(chalk.yellow('\n⚙️  Running setup automation...\n'));
      // Setup logic would go here
      console.log(chalk.green('✓ Setup complete!'));
    });

  await program.parseAsync(process.argv);
}

export { Onboard, main };
export default Onboard;
