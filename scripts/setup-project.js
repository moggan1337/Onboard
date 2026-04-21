#!/usr/bin/env node

/**
 * Project Setup Automation Script
 * Automates common setup tasks for new projects
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, access, constants } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

const CHECKLIST = [
  { name: 'Install dependencies', command: 'npm install', critical: true },
  { name: 'Run linter', command: 'npm run lint', critical: false },
  { name: 'Run tests', command: 'npm test', critical: false },
  { name: 'Build project', command: 'npm run build', critical: false }
];

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function runCommand(command, cwd = process.cwd()) {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return { success: true, stdout, stderr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function setupProject(options = {}) {
  const {
    projectPath = process.cwd(),
    skipInstall = false,
    skipTests = false,
    setupOnboard = true
  } = options;

  console.log(chalk.blue.bold('\n⚙️  Project Setup Automation\n'));
  console.log(chalk.gray(`Project: ${projectPath}\n`));

  const results = [];

  // Create .onboard directory
  console.log(chalk.cyan('📁 Creating .onboard directory...'));
  try {
    await mkdir(resolve(projectPath, '.onboard'), { recursive: true });
    console.log(chalk.green('   ✓ Created .onboard directory'));
    results.push({ task: 'Create .onboard directory', success: true });
  } catch (error) {
    console.log(chalk.yellow('   ⚠ Directory may already exist'));
  }

  // Check for package.json
  const hasPackageJson = await fileExists(resolve(projectPath, 'package.json'));
  if (!hasPackageJson) {
    console.log(chalk.yellow('\n⚠ No package.json found. Creating default...'));
    await writeFile(
      resolve(projectPath, 'package.json'),
      JSON.stringify({
        name: 'new-project',
        version: '1.0.0',
        description: 'A new project',
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          test: 'echo "No tests specified"'
        }
      }, null, 2)
    );
    console.log(chalk.green('   ✓ Created package.json'));
  }

  // Install dependencies
  if (!skipInstall) {
    console.log(chalk.cyan('\n📦 Installing dependencies...'));
    const installResult = await runCommand('npm install', projectPath);
    if (installResult.success) {
      console.log(chalk.green('   ✓ Dependencies installed'));
      results.push({ task: 'Install dependencies', success: true });
    } else {
      console.log(chalk.red('   ✗ Dependency installation failed'));
      console.log(chalk.gray(`   Error: ${installResult.error}`));
      results.push({ task: 'Install dependencies', success: false });
    }
  }

  // Run linter
  console.log(chalk.cyan('\n🔍 Running linter...'));
  const lintResult = await runCommand('npm run lint 2>/dev/null || echo "No lint script"', projectPath);
  if (lintResult.success && !lintResult.stdout.includes('No lint script')) {
    console.log(chalk.green('   ✓ Linting passed'));
    results.push({ task: 'Run linter', success: true });
  } else {
    console.log(chalk.yellow('   ⚠ Lint script not found or failed'));
    results.push({ task: 'Run linter', success: false });
  }

  // Run tests
  if (!skipTests) {
    console.log(chalk.cyan('\n🧪 Running tests...'));
    const testResult = await runCommand('npm test 2>/dev/null || echo "No tests"', projectPath);
    if (testResult.success && !testResult.stdout.includes('No tests')) {
      console.log(chalk.green('   ✓ Tests passed'));
      results.push({ task: 'Run tests', success: true });
    } else {
      console.log(chalk.yellow('   ⚠ No tests or tests failed'));
      results.push({ task: 'Run tests', success: false });
    }
  }

  // Initialize onboard
  if (setupOnboard) {
    console.log(chalk.cyan('\n🚀 Initializing Onboard...'));
    try {
      const { KnowledgeExtractor, ArchitectureGenerator } = await import('../src/core/knowledge-extractor.js');
      const extractor = new KnowledgeExtractor({ projectPath });
      const knowledge = await extractor.extract();
      
      // Create knowledge file
      await writeFile(
        resolve(projectPath, '.onboard', 'knowledge.json'),
        JSON.stringify(knowledge, null, 2)
      );
      
      console.log(chalk.green('   ✓ Knowledge extracted'));
      console.log(chalk.green(`   ✓ Found ${knowledge.summary.totalEntities} entities`));
      console.log(chalk.green(`   ✓ Identified ${knowledge.patterns.length} patterns`));
      results.push({ task: 'Initialize Onboard', success: true });
    } catch (error) {
      console.log(chalk.yellow(`   ⚠ Onboard initialization issue: ${error.message}`));
      results.push({ task: 'Initialize Onboard', success: false });
    }
  }

  // Summary
  console.log(chalk.bold('\n\n📊 Setup Summary:\n'));
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  for (const result of results) {
    const icon = result.success ? chalk.green('✓') : chalk.red('✗');
    console.log(`  ${icon} ${result.task}`);
  }

  console.log(chalk.bold('\n'));
  if (failCount === 0) {
    console.log(chalk.green.bold('✅ Setup complete! Your project is ready.\n'));
  } else {
    console.log(chalk.yellow(`⚠ Setup completed with ${failCount} warning(s).\n`));
    console.log(chalk.gray('Most issues can be resolved by reviewing the output above.\n'));
  }

  // Next steps
  console.log(chalk.bold('📋 Next Steps:\n'));
  console.log('  1. Review any errors above');
  console.log('  2. Configure your environment variables');
  console.log('  3. Set up your OpenAI API key if needed');
  console.log('  4. Run "onboard ask" to start exploring your codebase\n');
}

async function main() {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  
  await setupProject({ projectPath });
}

main();
