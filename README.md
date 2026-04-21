# Onboard - Developer Onboarding Bot

[![CI](https://github.com/moggan1337/Onboard/actions/workflows/ci.yml/badge.svg)](https://github.com/moggan1337/Onboard/actions/workflows/ci.yml)

<p align="center">

![Onboard](https://img.shields.io/badge/Onboard-Dev%20Onboarding-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

</p>

> **Welcome to the team.** Onboard automates developer onboarding with interactive guides, setup scripts, and helpful context.

## 🎬 Demo

![Onboard Demo](demo.gif)

*Interactive developer onboarding experience*

## ✨ Features

- **Interactive Setup** - Step-by-step environment configuration
- **Repository Tours** - Guided walkthroughs of key codebases
- **Context Awareness** - Answers questions based on your codebase
- **Progress Tracking** - Track new hire onboarding status
- **Slack Integration** - Onboarding assistance in your team chat

## 🚀 Quick Start

```bash
npm install -g @moggan1337/onboard
onboard init
onboard greet
```

## 🎯 Onboarding Flow Demo

### Welcome Experience

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│                                                                                  │
│           ███████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██╗███╗   ██╗        │
│           ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██║████╗  ██║        │
│           █████╗   ╚████╔╝ ██████╔╝█████╗  ██████╔╝███████╗██║██╔██╗ ██║        │
│           ██╔══╝    ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║██║╚██╗██║        │
│           ███████╗   ██║   ██║     ███████╗██║  ██║███████║██║██║ ╚████║        │
│           ╚══════╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝        │
│                                                                                  │
│                              D E V E L O P E R                                  │
│                           O N B O A R D I N G                                    │
│                                                                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

  Welcome, Sarah! 🎉
  
  We're excited to have you join the Engineering team.
  
  This interactive onboarding will help you:
  
    ✓ Set up your development environment
    ✓ Get access to all required systems
    ✓ Understand our codebase architecture
    ✓ Meet your team members
    ✓ Complete your first task (onboarding challenge!)
  
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                                                                              │
  │   Your Onboarding Progress:                                                 │
  │                                                                              │
  │   ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% Complete          │
  │                                                                              │
  │   Estimated Time: 4-6 hours (take breaks whenever you need!)                  │
  │                                                                              │
  └─────────────────────────────────────────────────────────────────────────────┘
  
  Let's get started! Press any key to begin...
```

### Step-by-Step Onboarding Wizard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ONBOARDING WIZARD                                        │
│                         Step 3 of 12: Development Environment                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%              │
│                                                                                  │
│  STEP 3: INSTALL DEVELOPMENT TOOLS                                              │
│  ═══════════════════════════════════════════════════════════════                │
│                                                                                  │
│  We've detected your system: macOS 14.3 (Apple Silicon)                        │
│                                                                                  │
│  Let's install the tools you need to start coding:                             │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  □ Homebrew (Package Manager)                                           │    │
│  │    Status: ✓ Already installed (v4.2.0)                                │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  □ Node.js 20 LTS                                                       │    │
│  │    Status: ⏳ Installing...                                             │    │
│  │    ─────────────────────────────────────────────────────────────────   │    │
│  │    ████████████████████████████░░░░░░░░░░░░░░░░░░░░░░  75%              │    │
│  │                                                                        │    │
│  │    Running: brew install node@20                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  □ Docker Desktop                                                       │    │
│  │    Status: ⏳ Pending (next step)                                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  □ VS Code + Extensions                                                 │    │
│  │    Status: ⏳ Pending (next step)                                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  □ Git Configuration                                                    │    │
│  │    Status: ⏳ Pending (next step)                                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ───────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  💡 TIP: Click on any item to see detailed instructions or skip if already     │
│          completed.                                                             │
│                                                                                  │
│  [Skip Step]  [View Details]  [Pause & Resume Later]  [Next: Docker →]         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Codebase Tour

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         📚 CODEBASE TOUR                                         │
│                         Repository: platform-api                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Welcome to the platform-api repository! 🎉                                    │
│                                                                                  │
│  This is the heart of our backend services. Let's take a quick tour...         │
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │                         REPOSITORY STRUCTURE                              │  │
│  │                                                                           │  │
│  │   platform-api/                                                           │  │
│  │   ├── 📁 src/                          ← All source code lives here    │  │
│  │   │   ├── 📁 api/                      ← REST endpoints                 │  │
│  │   │   │   ├── users.ts                                                   │  │
│  │   │   │   ├── orders.ts                                                  │  │
│  │   │   │   └── payments.ts                                                │  │
│  │   │   ├── 📁 services/              ← Business logic                     │  │
│  │   │   │   ├── userService.ts                                          │  │
│  │   │   │   └── orderService.ts                                         │  │
│  │   │   ├── 📁 db/                    ← Database layer                    │  │
│  │   │   │   ├── migrations/                                               │  │
│  │   │   │   └── queries.ts                                               │  │
│  │   │   └── 📁 utils/                   ← Shared utilities                 │  │
│  │   │       └── logger.ts                                                │  │
│  │   │                                                                     │  │
│  │   ├── 📁 tests/                     ← Test files (co-located)            │  │
│  │   ├── 📁 scripts/                   ← Dev scripts & tooling              │  │
│  │   ├── 📄 package.json               ← Dependencies & scripts            │  │
│  │   └── 📄 tsconfig.json              ← TypeScript configuration           │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  KEY CONCEPTS                                                                   │
│  ═══════════════                                                                  │
│                                                                                  │
│  🏗️ Architecture Pattern: Service-Oriented Architecture (SOA)                   │
│                                                                                  │
│     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│     │   Client    │────▶│  API Layer  │────▶│  Services   │                    │
│     │  (Frontend) │     │  (Express)  │     │  (Business) │                    │
│     └─────────────┘     └─────────────┘     └──────┬──────┘                    │
│                                                   │                             │
│                           ┌───────────────────────┼───────────────────────┐    │
│                           │                       │                       │    │
│                           ▼                       ▼                       ▼    │
│                    ┌─────────────┐         ┌─────────────┐         ┌─────────┐│
│                    │  Database   │         │   Cache     │         │  Queue  ││
│                    │  (Postgres) │         │  (Redis)    │         │ (Kafka) ││
│                    └─────────────┘         └─────────────┘         └─────────┘│
│                                                                                  │
│  📝 Coding Standards:                                                           │
│     • TypeScript strict mode enabled                                           │
│     • ESLint + Prettier for formatting                                         │
│     • Jest for unit tests                                                      │
│     • 80% code coverage required for PRs                                       │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  TRY IT! Type 'users' to explore the users module, or 'next' to continue.      │
│                                                                                  │
│  > users                                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Contextual Help System

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         💬 ASK ONBOARD                                           │
│                         Your AI assistant for codebase questions                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  You: How do I add a new API endpoint?                                          │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  Onboard Bot:                                                                   │
│                                                                                  │
│  Great question! Here's how to add a new API endpoint in platform-api:         │
│                                                                                  │
│  1️⃣  CREATE THE ROUTE FILE                                                      │
│      ─────────────────────────                                                  │
│      Create a new file in src/api/:                                            │
│      ┌─────────────────────────────────────────────────────────────────────┐     │
│      │  // src/api/products.ts                                            │     │
│      │  import { Router } from 'express';                                  │     │
│      │  import { productService } from '@/services/productService';       │     │
│      │                                                                      │     │
│      │  const router = Router();                                           │     │
│      │                                                                      │     │
│      │  router.get('/', async (req, res) => {                             │     │
│      │    const products = await productService.getAll();                 │     │
│      │    res.json(products);                                             │     │
│      │  });                                                               │     │
│      │                                                                      │     │
│      │  router.get('/:id', async (req, res) => {                          │     │
│      │    const product = await productService.getById(req.params.id);   │     │
│      │    if (!product) return res.status(404).json({ error: 'Not found'});│    │
│      │    res.json(product);                                              │     │
│      │  });                                                               │     │
│      │                                                                      │     │
│      │  export default router;                                             │     │
│      └─────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  2️⃣  REGISTER THE ROUTE                                                          │
│      ─────────────────                                                          │
│      Add to src/api/index.ts:                                                  │
│      ┌─────────────────────────────────────────────────────────────────────┐     │
│      │  import productsRouter from './products';                          │     │
│      │                                                                      │     │
│      │  app.use('/api/products', productsRouter);                         │     │
│      └─────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  3️⃣  ADD SERVICE (if needed)                                                     │
│      ─────────────────────                                                     │
│      Create src/services/productService.ts with your business logic.            │
│      Look at userService.ts as a reference pattern!                             │
│                                                                                  │
│  4️⃣  ADD TESTS                                                                  │
│      ───────────                                                                 │
│      Create src/api/products.test.ts with Jest tests.                           │
│      Coverage must be ≥80% for PR approval.                                    │
│                                                                                  │
│  💡 Related Topics:                                                             │
│     • "How do I add validation?" → Validation middleware guide                  │
│     • "How do I add authentication?" → Auth middleware guide                     │
│     • "How do I add database queries?" → Repository pattern guide               │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│  Type another question or 'done' to continue with onboarding.                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Onboarding Checklist Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ✅ ONBOARDING CHECKLIST                                   │
│                         Sarah Chen | Day 1 of 5                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  COMPLETION: ██████████████████████████████░░░░░░░░░░░░░░░░░  62% (47/76 items) │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  📋 DAY 1: Environment Setup (Day 1)                                           │
│  ────────────────────────────────────────────────────────────────────────        │
│  ✓ Install required software (brew, node, docker, etc.)                        │
│  ✓ Configure Git with SSH keys                                                 │
│  ✓ Clone platform-api repository                                              │
│  ✓ Run npm install in all repositories                                         │
│  ✓ Start local development environment                                         │
│  ✓ Create first test API call                                                  │
│  ────────────────────────────────────────────────────────────────────────        │
│  Status: ✅ COMPLETE (6/6)                                                      │
│                                                                                  │
│  📋 DAY 2: Codebase Understanding (Day 2)                                       │
│  ────────────────────────────────────────────────────────────────────────        │
│  ✓ Complete interactive codebase tour                                         │
│  ✓ Read architecture documentation                                             │
│  ✓ Read API documentation                                                     │
│  ✓ Understand deployment pipeline                                              │
│  ◐ Shadow code review session (in progress)                                    │
│  ○ Review PR template and guidelines                                           │
│  ────────────────────────────────────────────────────────────────────────        │
│  Status: 🟡 IN PROGRESS (4/6)                                                   │
│                                                                                  │
│  📋 DAY 3-5: First Task (Days 3-5)                                              │
│  ────────────────────────────────────────────────────────────────────────        │
│  ◐ Pick onboarding challenge from backlog                                      │
│  ○ Complete onboarding challenge                                                │
│  ○ Submit first pull request                                                   │
│  ○ Get code review from team member                                            │
│  ○ Merge first PR                                                              │
│  ────────────────────────────────────────────────────────────────────────        │
│  Status: ⭕ NOT STARTED (0/5)                                                    │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  🎯 UPCOMING MILESTONES                                                         │
│  ────────────────────────                                                       │
│                                                                                  │
│  Day 5    End of Week 1: First PR merged                                        │
│  Day 10   End of Week 2: Solo task assigned                                      │
│  Day 30   1-Month Checkpoint: Feedback + adjustments                             │
│                                                                                  │
│  ────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  💬 Have questions? Type 'ask' anytime for help.                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🛠️ Installation

```bash
npm install -g @moggan1337/onboard
```

## 📖 Usage

```bash
# Start onboarding for a new hire
onboard init --name "Sarah Chen" --email "sarah@company.com"

# Interactive tour of a repository
onboard tour ./src

# Ask questions about codebase
onboard ask "How do I add a new endpoint?"

# View onboarding status
onboard status --user sarah

# Generate onboarding report
onboard report --period week1
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT © 2024 moggan1337
