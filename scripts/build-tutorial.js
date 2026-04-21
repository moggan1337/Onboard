#!/usr/bin/env node

/**
 * Tutorial Builder Script
 * Builds tutorials and saves them to files
 */

import { TutorialBuilder } from '../src/core/tutorial-builder.js';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';

async function main() {
  const args = process.argv.slice(2);
  const topic = args[0] || 'git-basics';
  const difficulty = args[1] || 'beginner';
  const outputPath = args[2] || `tutorial-${topic}.json`;

  console.log(chalk.blue.bold('\n📝 Tutorial Builder\n'));
  console.log(chalk.gray(`Topic: ${topic} | Difficulty: ${difficulty}\n`));

  try {
    const builder = new TutorialBuilder();
    
    console.log(chalk.cyan('Building tutorial...'));
    const tutorial = await builder.build(topic, difficulty);

    console.log(chalk.green('\n✅ Tutorial Built!\n'));
    
    // Display info
    console.log(chalk.bold('Tutorial Info:'));
    console.log(`  📚 Title: ${tutorial.metadata.title}`);
    console.log(`  📝 Description: ${tutorial.metadata.description}`);
    console.log(`  ⏱️  Estimated time: ${tutorial.metadata.estimatedTime}`);
    console.log(`  📖 Sections: ${tutorial.metadata.totalSections}`);

    // Display sections
    console.log(chalk.cyan('\n📋 Sections:'));
    for (const section of tutorial.sections) {
      console.log(`  ${section.id}. ${section.title}`);
    }

    // Save to file
    const fullPath = resolve(outputPath);
    await writeFile(fullPath, JSON.stringify(tutorial, null, 2));
    console.log(chalk.green(`\n💾 Saved to: ${fullPath}\n`));

    // Also export as markdown
    const markdownPath = outputPath.replace('.json', '.md');
    const markdown = await builder.export(tutorial, 'markdown');
    await writeFile(resolve(markdownPath), markdown);
    console.log(chalk.green(`📄 Markdown exported to: ${markdownPath}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Build failed:'), error.message);
    process.exit(1);
  }
}

main();
