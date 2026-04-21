# Onboard - Developer Onboarding Bot

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Node-18%2B-yellow.svg" alt="Node Version">
</p>

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Quick Start](#-quick-start)
4. [Installation](#-installation)
5. [Configuration](#-configuration)
6. [Usage](#-usage)
   - [Command Line Interface](#command-line-interface)
   - [JavaScript API](#javascript-api)
7. [Features in Detail](#features-in-detail)
   - [Knowledge Extraction](#knowledge-extraction)
   - [Q&A Bot](#qa-bot)
   - [Architecture Documentation](#architecture-documentation)
   - [Task Suggestions](#task-suggestions)
   - [PR Review Explainer](#pr-review-explainer)
   - [Team Structure Mapping](#team-structure-mapping)
   - [Progress Tracking](#progress-tracking)
   - [Tutorial Builder](#tutorial-builder)
8. [Integrations](#integrations)
   - [Slack](#slack)
   - [Discord](#discord)
9. [API Reference](#api-reference)
10. [Contributing](#contributing)
11. [License](#license)

---

## 🎯 Overview

**Onboard** is a comprehensive developer onboarding platform designed to help new team members get up to speed quickly and efficiently. It provides a suite of tools for understanding codebases, finding answers to questions, tracking onboarding progress, and connecting with the right team members.

### Why Onboard?

Starting a new development role can be overwhelming. There's code to learn, architecture to understand, team members to meet, and processes to follow. Onboard simplifies this journey by providing:

- **Instant Knowledge Access**: Understand any part of the codebase through natural language questions
- **Structured Learning**: Follow guided tutorials and task suggestions tailored to your skill level
- **Progress Tracking**: Monitor your onboarding journey with clear milestones and achievements
- **Team Integration**: Know who to ask and where to find help

---

## ✨ Features

### 🚀 Core Features

| Feature | Description |
|---------|-------------|
| **Codebase Knowledge Extraction** | Automatically analyze and index codebases, extracting entities, relationships, and patterns |
| **GPT-Powered Q&A Bot** | Ask questions about the codebase in natural language and get intelligent answers |
| **Architecture Documentation** | Generate comprehensive architecture diagrams and documentation |
| **Task Suggestions** | Get personalized task recommendations based on your skill level and interests |
| **PR Review Explainer** | Understand code review feedback with simplified explanations |
| **Team Structure Mapping** | Visualize team organization and find experts for specific topics |
| **Progress Tracking** | Monitor onboarding milestones and achievements |
| **Tutorial Builder** | Create interactive learning materials for any topic |
| **Slack Integration** | Send notifications and updates to Slack channels |
| **Discord Integration** | Post updates and reminders to Discord servers |

### 🎓 Knowledge Management

Onboard maintains a rich knowledge base of your codebase:

- **Entity Recognition**: Identifies classes, functions, interfaces, and modules
- **Dependency Graph**: Maps relationships between code components
- **Pattern Detection**: Recognizes common design patterns (singleton, factory, MVC, etc.)
- **Documentation Extraction**: Collects JSDoc, docstrings, and comments

### 📊 Progress Tracking

Keep new developers engaged with gamification:

- **Phase-Based Progress**: Structured onboarding phases from setup to integration
- **Milestones**: Achievement system with badges for key accomplishments
- **Activity Tracking**: Monitor commits, PRs, and code reviews
- **Mentorship Matching**: Connect newcomers with experienced team members

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- (Optional) OpenAI API key for GPT features
- (Optional) Slack/Discord webhook URLs for integrations

### Installation

```bash
# Clone the repository
git clone https://github.com/moggan1337/Onboard.git
cd Onboard

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Initialize a Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Initialize onboard
npx onboard init

# Or run from anywhere with path specified
npx onboard init --path /path/to/your/project
```

### Ask Questions

```bash
# Start an interactive session
npx onboard ask "How is authentication implemented?"

# Get architecture overview
npx onboard ask "What's the overall architecture of this project?"
```

### Get Task Suggestions

```bash
# Get beginner tasks
npx onboard suggest-tasks --level beginner

# Filter by interests
npx onboard suggest-tasks --level beginner --interests frontend,testing
```

---

## 📦 Installation

### Global Installation

```bash
npm install -g onboard
```

### Local Installation

```bash
npm install onboard
```

### Development Installation

```bash
git clone https://github.com/moggan1337/Onboard.git
cd Onboard
npm install
npm link  # Link globally for development
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "src/index.js"]
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root or the Onboard directory:

```env
# Required for GPT features
OPENAI_API_KEY=sk-...

# Optional: GitHub access
GITHUB_TOKEN=ghp_...

# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
SLACK_BOT_TOKEN=xoxb-...

# Discord Configuration
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/XXX/YYY
DISCORD_BOT_TOKEN=...

# Project Settings
DEFAULT_PROJECT_PATH=/path/to/project
DATA_DIR=.onboard
```

### Configuration File

You can also create a `onboard.config.js` file:

```javascript
export default {
  projectPath: '/path/to/project',
  openaiApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 2000,
  integrations: {
    slack: {
      enabled: true,
      webhookUrl: process.env.SLACK_WEBHOOK_URL
    },
    discord: {
      enabled: true,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL
    }
  },
  progress: {
    phases: [
      { id: 'setup', name: 'Environment Setup', tasks: [...] },
      // Custom phases
    ]
  }
};
```

---

## 📚 Usage

### Command Line Interface

Onboard provides a comprehensive CLI for all operations:

```bash
# Initialize onboard for a project
onboard init --path /path/to/project

# Ask a question about the codebase
onboard ask "How does the authentication work?"

# Extract knowledge from codebase
onboard extract --path /path/to/project --output knowledge.json

# Generate architecture documentation
onboard architecture --path /path/to/project --output ARCHITECTURE.md

# Get task suggestions
onboard suggest-tasks --level beginner --interests frontend,testing

# View team structure
onboard team

# Check onboarding progress
onboard progress user-id

# Build a tutorial
onboard tutorial git-basics --difficulty beginner

# Run interactive CLI
onboard
```

### JavaScript API

#### Basic Usage

```javascript
import Onboard from 'onboard';

const onboard = new Onboard({
  projectPath: '/path/to/project',
  openaiApiKey: process.env.OPENAI_API_KEY
});

// Initialize
await onboard.init();

// Ask questions
const answer = await onboard.ask('How is the API structured?');
console.log(answer);

// Get task suggestions
const tasks = await onboard.suggestTasks('beginner', ['frontend']);
console.log(tasks);
```

#### Advanced Usage

```javascript
import { 
  KnowledgeExtractor,
  QABot,
  ArchitectureGenerator,
  TaskSuggester,
  PRReviewExplainer,
  TeamMapper,
  ProgressTracker,
  TutorialBuilder 
} from 'onboard';

// Individual components
const extractor = new KnowledgeExtractor({ projectPath: '/path/to/project' });
const knowledge = await extractor.extract();

// Generate architecture docs
const archGen = new ArchitectureGenerator();
const docs = await archGen.generate(knowledge);
const markdown = await archGen.export(docs, 'markdown');

// Progress tracking
const tracker = new ProgressTracker();
await tracker.initialize();
await tracker.createUser('user-123', { name: 'John Doe', skillLevel: 'beginner' });
await tracker.completeTask('user-123', 'setup-1');
const progress = await tracker.getProgress('user-123');
```

---

## 🔍 Features in Detail

### Knowledge Extraction

The knowledge extraction system automatically analyzes your codebase to build a comprehensive understanding:

```javascript
const extractor = new KnowledgeExtractor({ projectPath: '/path/to/project' });
const knowledge = await extractor.extract();

console.log(knowledge.summary);
// {
//   totalEntities: 245,
//   totalRelationships: 532,
//   byType: { class: 45, function: 180, interface: 20 },
//   byLanguage: { typescript: 200, javascript: 45 },
//   keyModules: [...]
// }
```

**Supported Languages:**
- JavaScript/TypeScript
- Python
- Java
- Go
- Rust
- Ruby
- PHP
- C#
- And more...

**Extracted Information:**
- Classes, functions, interfaces, types
- Import/export relationships
- Documentation comments
- Design patterns
- File organization

### Q&A Bot

The Q&A bot uses GPT to answer questions about your codebase:

```javascript
const qaBot = new QABot({ openaiApiKey: 'sk-...' });

// Ask a question
const answer = await qaBot.ask(
  'How do I add a new API endpoint?',
  { projectPath: '/path/to/project' }
);

// Search for related code
const results = await qaBot.searchCode('authentication');
```

**Features:**
- Context-aware answers based on codebase knowledge
- Conversation history for follow-up questions
- Code snippet suggestions
- Link to relevant files

### Architecture Documentation

Generate comprehensive architecture documentation:

```javascript
const archGen = new ArchitectureGenerator();
const docs = await archGen.generate(knowledge);

// Export in various formats
const markdown = await archGen.export(docs, 'markdown');
const html = await archGen.export(docs, 'html');
const json = await archGen.export(docs, 'json');
```

**Documentation Includes:**
- Module descriptions
- Dependency graphs
- Design pattern identification
- Data flow diagrams
- Circular dependency detection

### Task Suggestions

Get personalized task recommendations:

```javascript
const suggester = new TaskSuggester();
const tasks = suggester.suggest('beginner', ['frontend', 'testing']);

// Output:
[
  {
    title: 'Write unit tests for a function',
    description: 'Add comprehensive unit tests...',
    complexity: 2,
    estimatedMinutes: 60,
    priority: 'high',
    skills: ['testing', 'assertions'],
    acceptanceCriteria: [...],
    prerequisites: [...]
  },
  // ...
]
```

**Task Categories:**
- Documentation
- Testing
- Bug fixes
- Features
- Refactoring
- Code review
- Architecture
- Optimization
- Security
- Infrastructure

### PR Review Explainer

Simplify code review feedback:

```javascript
const prExplainer = new PRReviewExplainer();
const result = await prExplainer.explain(prData, reviewComments);

// Output:
{
  explanations: [
    {
      category: 'style',
      original: 'nit: inconsistent indentation',
      simplified: 'Inconsistent indentation - please fix',
      explanation: 'This comment refers to code style...',
      suggestion: 'Review the project\'s style guide...',
      isBlocking: false,
      priority: 'low'
    }
  ],
  summary: {
    totalComments: 5,
    blockingCount: 1,
    overallMessage: '1 critical issue must be addressed...'
  },
  actionItems: [...]
}
```

**Features:**
- Categorize comments (style, logic, security, etc.)
- Explain abbreviations and phrases
- Prioritize issues
- Identify blocking vs. optional feedback
- Suggest learning resources

### Team Structure Mapping

Visualize team organization and expertise:

```javascript
const teamMapper = new TeamMapper();
const structure = await teamMapper.getStructure();

// Find experts
const mentors = await teamMapper.findMentor('beginner', 'authentication');

// Get statistics
const stats = await teamMapper.getStatistics();
```

**Output:**
```json
{
  "departments": [
    {
      "name": "Engineering",
      "members": [
        {
          "name": "Sarah Johnson",
          "role": "Senior Frontend Engineer",
          "expertise": ["frontend", "react", "typescript"],
          "timezone": "PST",
          "preferredContact": "slack"
        }
      ]
    }
  ]
}
```

### Progress Tracking

Monitor onboarding progress with milestones:

```javascript
const tracker = new ProgressTracker();
await tracker.initialize();
await tracker.createUser('user-123', {
  name: 'John Doe',
  skillLevel: 'beginner',
  interests: ['frontend', 'testing']
});

// Complete tasks
await tracker.completeTask('user-123', 'setup-1');
await tracker.completeTask('user-123', 'setup-2');

// Get progress
const progress = await tracker.getProgress('user-123');
console.log(progress);
// {
//   currentPhase: { name: 'Environment Setup', progress: 40 },
//   overall: { completed: 2, total: 25, percentage: 8 },
//   milestones: [...],
//   stats: { daysActive: 2, commits: 5, prs: 1 }
// }
```

**Default Phases:**
1. Environment Setup
2. Codebase Orientation
3. First Contribution
4. Deep Dive
5. Team Integration

### Tutorial Builder

Create interactive learning materials:

```javascript
const builder = new TutorialBuilder();
const tutorial = await builder.build('git-basics', 'beginner');

// Export tutorial
const markdown = await builder.export(tutorial, 'markdown');
const html = await builder.export(tutorial, 'html');
```

**Built-in Topics:**
- Git Basics
- Code Review Process
- Testing Fundamentals
- API Development
- Debugging Techniques
- Security Best Practices

---

## 🔗 Integrations

### Slack

Send notifications to Slack channels:

```javascript
import { SlackIntegration } from 'onboard';

const slack = new SlackIntegration({
  webhookUrl: process.env.SLACK_WEBHOOK_URL
});

// Send welcome message
await slack.sendWelcome('John Doe', 'U12345');

// Send progress update
await slack.sendProgress('John Doe', 'First Contribution', 40, 10, 25);

// Send milestone achievement
await slack.sendMilestone('John Doe', 'First PR', 'Submitted your first pull request');
```

**Templates:**
- Welcome messages
- Progress updates
- Milestone notifications
- Task reminders
- PR review requests
- Daily summaries

### Discord

Post updates to Discord:

```javascript
import { DiscordIntegration } from 'onboard';

const discord = new DiscordIntegration({
  webhookUrl: process.env.DISCORD_WEBHOOK_URL
});

// Send embed message
await discord.send({
  embed: {
    title: 'New Team Member!',
    description: 'Welcome Sarah to the team!',
    color: 0x9b59b6
  }
});
```

---

## 📖 API Reference

### Onboard Class

```javascript
const onboard = new Onboard(config)
```

**Parameters:**
- `config.openaiApiKey` (string): OpenAI API key
- `config.projectPath` (string): Path to project
- `config.githubToken` (string): GitHub token
- `config.slackWebhookUrl` (string): Slack webhook URL
- `config.discordWebhookUrl` (string): Discord webhook URL

**Methods:**

| Method | Description |
|--------|-------------|
| `init()` | Initialize onboard for a project |
| `ask(question)` | Ask a question about the codebase |
| `suggestTasks(skillLevel, interests)` | Get task suggestions |
| `explainPRReview(prData, comments)` | Explain PR review |
| `getTeamStructure()` | Get team organization |
| `getProgress(userId)` | Get onboarding progress |
| `buildTutorial(topic, difficulty)` | Build a tutorial |
| `notifySlack(message, channel)` | Send Slack notification |
| `notifyDiscord(message, channel)` | Send Discord notification |

### KnowledgeExtractor Class

```javascript
const extractor = new KnowledgeExtractor(config)
```

**Methods:**
- `extract()`: Extract all knowledge from codebase
- `getEntityContext(entityName)`: Get context for a specific entity

### QABot Class

```javascript
const qaBot = new QABot(config)
```

**Methods:**
- `ask(question, context)`: Ask a question
- `searchCode(query)`: Search for code
- `getRelatedQuestions(question)`: Get suggested questions
- `clearConversation(conversationId)`: Clear chat history

### ProgressTracker Class

```javascript
const tracker = new ProgressTracker(config)
```

**Methods:**
- `initialize()`: Initialize tracker
- `createUser(userId, profile)`: Create user profile
- `getProgress(userId)`: Get user progress
- `completeTask(userId, taskId)`: Mark task complete
- `recordActivity(userId, activity)`: Record activity
- `getTaskSuggestions(userId)`: Get next task suggestions

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/moggan1337/Onboard.git
cd Onboard

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Run tests
npm test

# Lint code
npm run lint

# Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check formatting
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for GPT-powered capabilities
- The maintainers of all dependencies
- Contributors and users of Onboard

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/moggan1337/Onboard/issues)
- **Documentation**: [Online docs](https://github.com/moggan1337/Onboard#readme)
- **Discussions**: [Community forum](https://github.com/moggan1337/Onboard/discussions)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/moggan1337">moggan1337</a>
</p>
