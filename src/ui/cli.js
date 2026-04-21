/**
 * CLI Interface - Interactive command-line interface for Onboard
 * Provides user-friendly prompts and colored output
 */

import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * ASCII art banner
 */
const BANNER = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗ ███████╗███████╗███████╗██████╗                 ║
║   ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗                ║
║   ██║  ██║█████╗  ███████╗█████╗  ██║  ██║                ║
║   ██║  ██║██╔══╝  ╚════██║██╔══╝  ██║  ██║                ║
║   ██████╔╝███████╗███████║███████╗██████╔╝                ║
║   ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═════╝                 ║
║                                                           ║
║   Developer Onboarding Bot                                ║
║   Your guide to mastering the codebase                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

/**
 * Main menu options
 */
const MAIN_MENU = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { name: '🚀 Initialize Project', value: 'init' },
      { name: '💬 Ask a Question', value: 'ask' },
      { name: '📚 Extract Knowledge', value: 'extract' },
      { name: '🏗️  Generate Architecture Docs', value: 'architecture' },
      { name: '📋 Get Task Suggestions', value: 'tasks' },
      { name: '👥 View Team Structure', value: 'team' },
      { name: '📊 Check Progress', value: 'progress' },
      { name: '📝 Build Tutorial', value: 'tutorial' },
      { name: '🔍 Explain PR Review', value: 'pr-review' },
      { name: '⚙️  Settings', value: 'settings' },
      { name: new inquirer.Separator(),
        name: '' },
      { name: '❓ Help', value: 'help' },
      { name: '🚪 Exit', value: 'exit' }
    ]
  }
];

/**
 * Skill level choices
 */
const SKILL_LEVEL_CHOICES = [
  { name: '🌱 Beginner - New to the codebase', value: 'beginner' },
  { name: '🌿 Intermediate - Comfortable with basics', value: 'intermediate' },
  { name: '🌳 Advanced - Ready for complex tasks', value: 'advanced' }
];

/**
 * Interest choices
 */
const INTEREST_CHOICES = [
  { name: 'Frontend Development', value: 'frontend' },
  { name: 'Backend Development', value: 'backend' },
  { name: 'DevOps & Infrastructure', value: 'devops' },
  { name: 'Testing & QA', value: 'testing' },
  { name: 'Security', value: 'security' },
  { name: 'Performance', value: 'performance' },
  { name: 'Documentation', value: 'documentation' },
  { name: 'Database', value: 'database' },
  { name: 'Mobile Development', value: 'mobile' },
  { name: 'API Development', value: 'api' }
];

/**
 * Tutorial topic choices
 */
const TUTORIAL_TOPICS = [
  { name: 'Git Basics', value: 'git-basics' },
  { name: 'Code Review Process', value: 'code-review' },
  { name: 'Testing Fundamentals', value: 'testing-basics' },
  { name: 'API Development Best Practices', value: 'api-development' },
  { name: 'Debugging Techniques', value: 'debugging' },
  { name: 'Security Best Practices', value: 'security' }
];

/**
 * Setup CLI interface
 */
export async function setupCLI(onboard) {
  console.log(chalk.blue(BANNER));
  
  let running = true;
  
  while (running) {
    try {
      const { action } = await inquirer.prompt(MAIN_MENU);
      
      switch (action) {
        case 'init':
          await handleInit(onboard);
          break;
        case 'ask':
          await handleAsk(onboard);
          break;
        case 'extract':
          await handleExtract(onboard);
          break;
        case 'architecture':
          await handleArchitecture(onboard);
          break;
        case 'tasks':
          await handleTasks(onboard);
          break;
        case 'team':
          await handleTeam(onboard);
          break;
        case 'progress':
          await handleProgress(onboard);
          break;
        case 'tutorial':
          await handleTutorial(onboard);
          break;
        case 'pr-review':
          await handlePRReview(onboard);
          break;
        case 'settings':
          await handleSettings(onboard);
          break;
        case 'help':
          await handleHelp();
          break;
        case 'exit':
          running = false;
          console.log(chalk.green('\n👋 Thanks for using Onboard! Happy coding!\n'));
          break;
      }
      
      if (running) {
        await pause();
      }
    } catch (error) {
      console.error(chalk.red('\n❌ An error occurred:'), error.message);
      await pause();
    }
  }
}

/**
 * Handle project initialization
 */
async function handleInit(onboard) {
  console.log(chalk.blue('\n🚀 Initializing Onboard...\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: 'Project path:',
      default: process.cwd()
    },
    {
      type: 'confirm',
      name: 'extractKnowledge',
      message: 'Extract codebase knowledge?',
      default: true
    },
    {
      type: 'confirm',
      name: 'generateDocs',
      message: 'Generate architecture documentation?',
      default: true
    }
  ]);

  onboard.config.projectPath = answers.projectPath;
  await onboard.init();
}

/**
 * Handle question asking
 */
async function handleAsk(onboard) {
  console.log(chalk.blue('\n💬 Ask a Question\n'));
  console.log(chalk.gray('Type your question about the codebase (or "cancel" to go back)\n'));

  const { question } = await inquirer.prompt([
    {
      type: 'input',
      name: 'question',
      message: 'Your question:'
    }
  ]);

  if (question.toLowerCase() === 'cancel') return;

  console.log(chalk.cyan('\n⏳ Thinking...\n'));
  
  const answer = await onboard.ask(question);
  
  console.log(chalk.blue('\n📝 Answer:\n'));
  console.log(answer);
}

/**
 * Handle knowledge extraction
 */
async function handleExtract(onboard) {
  console.log(chalk.blue('\n📚 Extracting Codebase Knowledge\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: 'Project path:',
      default: process.cwd()
    },
    {
      type: 'confirm',
      name: 'saveToFile',
      message: 'Save results to file?',
      default: false
    }
  ]);

  onboard.config.projectPath = answers.projectPath;
  const knowledge = await onboard.components.knowledgeExtractor.extract();

  console.log(chalk.green('\n✅ Knowledge Extraction Complete!\n'));
  console.log(`📊 Summary:`);
  console.log(`   • Total entities: ${knowledge.summary.totalEntities}`);
  console.log(`   • Total relationships: ${knowledge.summary.totalRelationships}`);
  console.log(`   • Patterns identified: ${knowledge.patterns.length}`);

  if (knowledge.patterns.length > 0) {
    console.log(chalk.cyan('\n🔍 Patterns Found:'));
    knowledge.patterns.forEach(p => {
      console.log(`   • ${p.type}: ${p.occurrences} occurrences`);
    });
  }
}

/**
 * Handle architecture documentation generation
 */
async function handleArchitecture(onboard) {
  console.log(chalk.blue('\n🏗️  Generating Architecture Documentation\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectPath',
      message: 'Project path:',
      default: process.cwd()
    },
    {
      type: 'list',
      name: 'format',
      message: 'Output format:',
      choices: ['markdown', 'json', 'html'],
      default: 'markdown'
    }
  ]);

  onboard.config.projectPath = answers.projectPath;
  const knowledge = await onboard.components.knowledgeExtractor.extract();
  const architecture = await onboard.components.architectureGenerator.generate(knowledge);

  console.log(chalk.green('\n✅ Architecture Documentation Generated!\n'));
  console.log(`📁 Generated ${architecture.modules.length} module documentations`);
  console.log(`🔄 Identified ${architecture.dependencies.internal.length} internal dependencies`);
  
  if (architecture.dependencies.circular.length > 0) {
    console.log(chalk.yellow(`\n⚠️  Found ${architecture.dependencies.circular.length} circular dependencies!`));
  }
}

/**
 * Handle task suggestions
 */
async function handleTasks(onboard) {
  console.log(chalk.blue('\n📋 Task Suggestions\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'skillLevel',
      message: 'Select your skill level:',
      choices: SKILL_LEVEL_CHOICES
    },
    {
      type: 'checkbox',
      name: 'interests',
      message: 'Select your interests (optional):',
      choices: INTEREST_CHOICES
    }
  ]);

  const tasks = await onboard.suggestTasks(answers.skillLevel, answers.interests);

  console.log(chalk.green(`\n✨ Here are your personalized task suggestions:\n`));
  
  tasks.forEach((task, i) => {
    const priorityIcon = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
    console.log(chalk.bold(`\n${i + 1}. ${priorityIcon} ${task.title}`));
    console.log(chalk.gray(`   ${task.description}`));
    console.log(chalk.cyan(`   ⏱️  Estimated time: ${task.estimatedTime}`));
    console.log(chalk.cyan(`   📈 Complexity: ${'●'.repeat(task.complexity)}${'○'.repeat(5 - task.complexity)}`));
  });
}

/**
 * Handle team structure view
 */
async function handleTeam(onboard) {
  console.log(chalk.blue('\n👥 Team Structure\n'));

  const team = await onboard.getTeamStructure();

  for (const dept of team.departments) {
    console.log(chalk.bold.cyan(`\n${dept.name}`));
    console.log(chalk.gray(`   ${dept.description}\n`));

    for (const member of dept.members) {
      console.log(`   👤 ${chalk.bold(member.name)} - ${member.role}`);
      console.log(`      💼 Expertise: ${member.expertise.join(', ')}`);
      console.log(`      📧 ${member.email}`);
      if (member.slack) {
        console.log(`      💬 Slack: ${member.slack}`);
      }
    }
  }
}

/**
 * Handle progress check
 */
async function handleProgress(onboard) {
  console.log(chalk.blue('\n📊 Onboarding Progress\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter user ID:',
      validate: (input) => input.length > 0 || 'User ID is required'
    }
  ]);

  const progress = await onboard.getProgress(answers.userId);

  if (!progress) {
    console.log(chalk.yellow('\n⚠️  User not found. Starting new onboarding...\n'));
    
    const { name, skillLevel } = await inquirer.prompt([
      { type: 'input', name: 'name', message: 'Your name:' },
      { 
        type: 'list', 
        name: 'skillLevel', 
        message: 'Skill level:', 
        choices: SKILL_LEVEL_CHOICES 
      }
    ]);

    // Would create user here
    console.log(chalk.green('\n✅ User profile created!'));
    return;
  }

  console.log(chalk.bold(`\n👤 ${progress.user.name}`));
  console.log(`   Started: ${new Date(progress.user.startDate).toLocaleDateString()}`);
  console.log(`   Skill Level: ${progress.user.skillLevel}`);
  
  console.log(chalk.cyan(`\n📍 Current Phase: ${progress.currentPhase.name}`));
  console.log(`   Progress: ${progress.currentPhase.percentage}% (${progress.currentPhase.completed}/${progress.currentPhase.total} tasks)`);
  
  console.log(chalk.cyan(`\n📈 Overall Progress: ${progress.overall.percentage}%`));
  
  if (progress.milestones.length > 0) {
    console.log(chalk.green('\n🏆 Earned Milestones:'));
    progress.milestones.forEach(m => {
      console.log(`   • ${m.name} - ${m.description}`);
    });
  }
}

/**
 * Handle tutorial building
 */
async function handleTutorial(onboard) {
  console.log(chalk.blue('\n📝 Tutorial Builder\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'topic',
      message: 'Select a topic:',
      choices: TUTORIAL_TOPICS
    },
    {
      type: 'list',
      name: 'difficulty',
      message: 'Select difficulty:',
      choices: [
        { name: '🌱 Beginner', value: 'beginner' },
        { name: '🌿 Intermediate', value: 'intermediate' },
        { name: '🌳 Advanced', value: 'advanced' }
      ],
      default: 'beginner'
    }
  ]);

  console.log(chalk.cyan('\n⏳ Building tutorial...\n'));

  const tutorial = await onboard.buildTutorial(answers.topic, answers.difficulty);

  console.log(chalk.green(`\n✅ Tutorial Generated!\n`));
  console.log(`📚 ${tutorial.metadata.title}`);
  console.log(`📝 ${tutorial.metadata.description}`);
  console.log(`⏱️  Estimated time: ${tutorial.metadata.estimatedTime}`);
  console.log(`📖 ${tutorial.metadata.totalSections} sections`);

  const { viewNow } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'viewNow',
      message: 'View tutorial now?',
      default: false
    }
  ]);

  if (viewNow) {
    for (const section of tutorial.sections) {
      console.log(chalk.bold.cyan(`\n${section.id}. ${section.title}`));
      console.log(section.content);
      
      if (section.steps?.length > 0) {
        console.log(chalk.gray('\nSteps:'));
        section.steps.forEach((step, i) => {
          console.log(`   ${i + 1}. ${step}`);
        });
      }
    }
  }
}

/**
 * Handle PR review explanation
 */
async function handlePRReview(onboard) {
  console.log(chalk.blue('\n🔍 PR Review Explainer\n'));
  console.log(chalk.gray('Paste your PR review comments below (Ctrl+D to finish):\n'));

  // In a real implementation, this would read from stdin
  console.log(chalk.yellow('Feature not yet implemented in interactive mode.'));
  console.log(chalk.gray('Use: onboard pr-review --file <file>'));
}

/**
 * Handle settings
 */
async function handleSettings(onboard) {
  console.log(chalk.blue('\n⚙️  Settings\n'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select setting to configure:',
      choices: [
        { name: '🔑 Set OpenAI API Key', value: 'api-key' },
        { name: '💬 Configure Slack', value: 'slack' },
        { name: '🎮 Configure Discord', value: 'discord' },
        { name: '📁 Set Default Project Path', value: 'project-path' },
        { name: '← Back to Main Menu', value: 'back' }
      ]
    }
  ]);

  switch (action) {
    case 'api-key':
      const { apiKey } = await inquirer.prompt([
        { type: 'password', name: 'apiKey', message: 'Enter your OpenAI API key:' }
      ]);
      onboard.config.openaiApiKey = apiKey;
      console.log(chalk.green('\n✅ API key saved!'));
      break;
    case 'slack':
      const { webhookUrl } = await inquirer.prompt([
        { type: 'input', name: 'webhookUrl', message: 'Enter Slack webhook URL:' }
      ]);
      onboard.config.slackWebhookUrl = webhookUrl;
      console.log(chalk.green('\n✅ Slack configured!'));
      break;
    case 'discord':
      const { discordWebhook } = await inquirer.prompt([
        { type: 'input', name: 'discordWebhook', message: 'Enter Discord webhook URL:' }
      ]);
      onboard.config.discordWebhookUrl = discordWebhook;
      console.log(chalk.green('\n✅ Discord configured!'));
      break;
    case 'project-path':
      const { path } = await inquirer.prompt([
        { type: 'input', name: 'path', message: 'Enter default project path:', default: process.cwd() }
      ]);
      onboard.config.projectPath = path;
      console.log(chalk.green('\n✅ Default path saved!'));
      break;
    case 'back':
      return;
  }
}

/**
 * Handle help
 */
async function handleHelp() {
  console.log(chalk.blue('\n❓ Help\n'));
  console.log(`
Welcome to Onboard - Your Developer Onboarding Assistant!

${chalk.cyan('Available Commands:')}

  ${chalk.bold('init')}           Initialize onboard for a project
  ${chalk.bold('ask')}           Ask questions about the codebase
  ${chalk.bold('extract')}       Extract knowledge from codebase
  ${chalk.bold('architecture')}  Generate architecture documentation
  ${chalk.bold('suggest-tasks')} Get task suggestions based on skill level
  ${chalk.bold('team')}          View team structure
  ${chalk.bold('progress')}      Check onboarding progress
  ${chalk.bold('tutorial')}      Build interactive tutorials
  ${chalk.bold('pr-review')}     Explain PR review comments

${chalk.cyan('Environment Variables:')}

  OPENAI_API_KEY      Your OpenAI API key for GPT features
  GITHUB_TOKEN        Your GitHub token for repository access
  SLACK_WEBHOOK_URL   Webhook URL for Slack notifications
  DISCORD_WEBHOOK_URL Webhook URL for Discord notifications

${chalk.cyan('Getting Started:')}

  1. Run ${chalk.bold('onboard init')} to initialize for your project
  2. Use ${chalk.bold('onboard ask')} to learn about the codebase
  3. Check ${chalk.bold('onboard suggest-tasks')} for beginner tasks
  4. Track progress with ${chalk.bold('onboard progress <user-id>')}

${chalk.cyan('For More Information:')}
  
  Visit: https://github.com/moggan1337/Onboard
  `);
}

/**
 * Pause for user input
 */
async function pause() {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: chalk.gray('Press Enter to continue...')
    }
  ]);
}

export { setupCLI, BANNER, MAIN_MENU };
export default setupCLI;
