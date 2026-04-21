#!/usr/bin/env node

/**
 * Team Analysis Script
 * Analyzes team structure and expertise
 */

import { TeamMapper } from '../src/core/team-mapper.js';
import chalk from 'chalk';

async function main() {
  console.log(chalk.blue.bold('\n👥 Team Structure Analysis\n'));

  try {
    const mapper = new TeamMapper();
    
    // Get team structure
    console.log(chalk.cyan('Loading team structure...'));
    const structure = await mapper.getStructure();

    console.log(chalk.green('\n✅ Team loaded!\n'));
    
    // Display departments
    console.log(chalk.bold('📋 Departments:\n'));
    for (const dept of structure.departments) {
      console.log(chalk.cyan.bold(`\n${dept.name}`));
      console.log(chalk.gray(`   ${dept.description}`));
      console.log(chalk.gray(`   Members: ${dept.members.length}`));
      
      for (const member of dept.members) {
        console.log(`\n   👤 ${chalk.bold(member.name)}`);
        console.log(`      Role: ${member.role}`);
        console.log(`      Expertise: ${member.expertise.join(', ')}`);
        console.log(`      Timezone: ${member.timezone}`);
      }
    }

    // Get statistics
    console.log(chalk.bold('\n\n📊 Team Statistics:\n'));
    const stats = await mapper.getStatistics();
    
    console.log(`  Total Members: ${stats.totalMembers}`);
    console.log('\n  By Department:');
    for (const [dept, count] of Object.entries(stats.byDepartment)) {
      console.log(`    • ${dept}: ${count}`);
    }
    
    console.log('\n  By Expertise:');
    const topExpertise = Object.entries(stats.byExpertise)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    for (const [exp, count] of topExpertise) {
      console.log(`    • ${exp}: ${count} members`);
    }

    // Get expertise coverage
    console.log(chalk.bold('\n\n🎯 Expertise Coverage:\n'));
    const coverage = stats.expertiseCoverage
      .filter(e => e.count > 0)
      .sort((a, b) => b.count - a.count);
    
    for (const exp of coverage) {
      const bar = '█'.repeat(Math.min(exp.count, 5)) + '░'.repeat(Math.max(0, 5 - exp.count));
      console.log(`  ${exp.expertise.padEnd(15)} ${bar} (${exp.count})`);
      if (exp.primaryExpert) {
        console.log(chalk.gray(`    Expert: ${exp.primaryExpert}`));
      }
    }

    // Org chart
    console.log(chalk.bold('\n\n📊 Organization Chart:\n'));
    const orgChart = await mapper.getOrgChart();
    console.log(chalk.gray(orgChart));

  } catch (error) {
    console.error(chalk.red('\n❌ Analysis failed:'), error.message);
    process.exit(1);
  }
}

main();
