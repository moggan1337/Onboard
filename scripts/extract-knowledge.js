#!/usr/bin/env node

/**
 * Knowledge Extraction Script
 * Extracts knowledge from a codebase and saves it to a file
 */

import { KnowledgeExtractor } from '../src/core/knowledge-extractor.js';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import chalk from 'chalk';

async function main() {
  const args = process.argv.slice(2);
  const projectPath = args[0] || process.cwd();
  const outputPath = args[1] || 'knowledge-extraction.json';

  console.log(chalk.blue.bold('\n📚 Codebase Knowledge Extraction\n'));
  console.log(chalk.gray(`Project: ${projectPath}\n`));

  try {
    const extractor = new KnowledgeExtractor({ projectPath });
    
    console.log(chalk.cyan('Extracting knowledge...'));
    const knowledge = await extractor.extract();

    console.log(chalk.green('\n✅ Extraction Complete!\n'));
    
    // Display summary
    console.log(chalk.bold('Summary:'));
    console.log(`  📊 Total entities: ${knowledge.summary.totalEntities}`);
    console.log(`  🔗 Total relationships: ${knowledge.summary.totalRelationships}`);
    console.log(`  🎨 Patterns identified: ${knowledge.patterns.length}`);
    console.log(`  📁 Files analyzed: ${knowledge.metadata.fileCount}`);
    console.log(`  🌍 Primary language: ${knowledge.metadata.language}`);

    // Display patterns
    if (knowledge.patterns.length > 0) {
      console.log(chalk.cyan('\n🔍 Design Patterns Found:'));
      for (const pattern of knowledge.patterns) {
        console.log(`  • ${pattern.type}: ${pattern.occurrences} occurrences`);
      }
    }

    // Save to file
    const fullPath = resolve(outputPath);
    await writeFile(fullPath, JSON.stringify(knowledge, null, 2));
    console.log(chalk.green(`\n💾 Saved to: ${fullPath}\n`));

  } catch (error) {
    console.error(chalk.red('\n❌ Extraction failed:'), error.message);
    process.exit(1);
  }
}

main();
