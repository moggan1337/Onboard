/**
 * Architecture Documentation Generator
 * Generates comprehensive architecture documentation from extracted knowledge
 */

import { KnowledgeExtractor } from './knowledge-extractor.js';
import chalk from 'chalk';

/**
 * Documentation templates for different sections
 */
const TEMPLATES = {
  module: (module) => `
## ${module.name}

**File**: \`${module.file}\`
**Type**: ${module.type}
${module.description ? `\n**Description**: ${module.description}\n` : ''}

${module.responsibilities ? `### Responsibilities\n${module.responsibilities}\n` : ''}
${module.dependencies.length > 0 ? `### Dependencies\n${module.dependencies.map(d => `- \`${d}\``).join('\n')}\n` : ''}
${module.dependents.length > 0 ? `### Used By\n${module.dependents.map(d => `- \`${d}\``).join('\n')}\n` : ''}
`,

  pattern: (pattern) => `
## ${pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)} Pattern

**Occurrences**: ${pattern.occurrences}

${pattern.entities.length > 0 ? `### Implementations\n${pattern.entities.map(e => `- \`${e}\``).join('\n')}\n` : ''}
${pattern.description ? `### Description\n${pattern.description}\n` : ''}
`,

  overview: (data) => `
# Architecture Overview

## Project Summary
- **Primary Language**: ${data.primaryLanguage}
- **Total Files**: ${data.fileCount}
- **Total Entities**: ${data.entityCount}
- **Patterns Identified**: ${data.patternCount}

## Directory Structure

\`\`\`
${data.structure}
\`\`\`

## Component Diagram

\`\`\`
${data.componentDiagram}
\`\`\`

## Data Flow

${data.dataFlow}
`
};

/**
 * Module categorization rules
 */
const CATEGORY_RULES = {
  'controllers': ['controller', 'router', 'route', 'api'],
  'services': ['service', 'business', 'logic', 'manager'],
  'models': ['model', 'entity', 'schema', 'type'],
  'utils': ['util', 'helper', 'tool', 'common'],
  'config': ['config', 'settings', 'constants', 'env'],
  'middleware': ['middleware', 'interceptor', 'filter', 'hook'],
  'tests': ['test', 'spec', '__tests__', 'mock', 'fixture'],
  'assets': ['asset', 'static', 'public', 'resource']
};

export class ArchitectureGenerator {
  constructor(config = {}) {
    this.config = config;
    this.knowledgeExtractor = new KnowledgeExtractor(config);
  }

  /**
   * Generate complete architecture documentation
   */
  async generate(knowledge = null) {
    if (!knowledge) {
      knowledge = await this.knowledgeExtractor.extract();
    }

    console.log(chalk.cyan('  📝 Generating architecture documentation...'));

    const modules = this.categorizeModules(knowledge);
    const patterns = this.formatPatterns(knowledge.patterns);
    const dependencies = this.analyzeDependencies(knowledge);
    const dataFlow = this.analyzeDataFlow(knowledge);
    const structure = this.generateDirectoryStructure(knowledge);

    const documentation = {
      overview: {
        primaryLanguage: this.detectPrimaryLanguage(knowledge),
        fileCount: knowledge.metadata.fileCount,
        entityCount: knowledge.summary.totalEntities,
        patternCount: knowledge.patterns.length,
        structure,
        componentDiagram: this.generateComponentDiagram(modules),
        dataFlow: dataFlow.description
      },
      modules,
      patterns,
      dependencies,
      dataFlow,
      metadata: {
        generatedAt: new Date().toISOString(),
        generator: 'onboard-architecture-generator'
      }
    };

    return documentation;
  }

  /**
   * Categorize modules by their purpose
   */
  categorizeModules(knowledge) {
    const modules = new Map();
    const graph = knowledge.dependencyGraph;

    // Group entities by file/directory
    for (const entity of knowledge.entities) {
      const category = this.categorizeEntity(entity);
      
      if (!modules.has(entity.file)) {
        modules.set(entity.file, {
          name: this.extractModuleName(entity.file),
          file: entity.file,
          category,
          type: 'module',
          entities: [],
          dependencies: [],
          dependents: []
        });
      }

      modules.get(entity.file).entities.push({
        name: entity.name,
        type: entity.type,
        details: entity.details
      });
    }

    // Add dependency information
    for (const node of graph.nodes) {
      if (modules.has(node.id)) {
        modules.get(node.id).dependencies = node.dependencies;
        modules.get(node.id).dependents = node.dependents;
      }
    }

    return Array.from(modules.values());
  }

  /**
   * Categorize an entity based on its name and file
   */
  categorizeEntity(entity) {
    const nameLower = (entity.name + ' ' + entity.file).toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
      for (const keyword of keywords) {
        if (nameLower.includes(keyword)) {
          return category;
        }
      }
    }

    return 'core';
  }

  /**
   * Extract module name from file path
   */
  extractModuleName(filePath) {
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    const nameParts = fileName.split('.');
    nameParts.pop(); // Remove extension
    return nameParts.join('.');
  }

  /**
   * Format patterns for documentation
   */
  formatPatterns(patterns) {
    return patterns.map(pattern => ({
      type: pattern.type,
      occurrences: pattern.occurrences,
      entities: pattern.entities,
      description: this.getPatternDescription(pattern.type)
    }));
  }

  /**
   * Get description for common patterns
   */
  getPatternDescription(patternType) {
    const descriptions = {
      singleton: 'Ensures a class has only one instance and provides a global point of access to it.',
      factory: 'Creates objects without specifying the exact class of object that will be created.',
      service: 'Implements business logic and is typically injected as a dependency.',
      controller: 'Handles incoming requests and coordinates responses, often in MVC architectures.',
      hook: 'React hook that encapsulates reusable stateful logic.',
      repository: 'Mediates between the domain and data mapping layers.',
      observer: 'Defines a one-to-many dependency between objects.',
      strategy: 'Defines a family of algorithms and makes them interchangeable.'
    };

    return descriptions[patternType] || 'A recognized design pattern used in the codebase.';
  }

  /**
   * Analyze dependencies between modules
   */
  analyzeDependencies(knowledge) {
    const dependencies = {
      internal: [],
      external: [],
      circular: [],
      orphans: []
    };

    const files = new Set(knowledge.entities.map(e => e.file));
    const graph = knowledge.dependencyGraph;

    // Check each relationship
    for (const edge of graph.edges) {
      if (edge.target.startsWith('external:')) {
        dependencies.external.push({
          from: edge.source,
          to: edge.target.replace('external:', ''),
          type: 'package'
        });
      } else if (files.has(edge.target)) {
        dependencies.internal.push({
          from: edge.source,
          to: edge.target
        });
      }
    }

    // Find circular dependencies
    dependencies.circular = this.findCircularDependencies(graph);

    // Find orphan modules (no dependencies, not depended upon)
    for (const node of graph.nodes) {
      if (node.dependencies.length === 0 && node.dependents.length === 0) {
        dependencies.orphans.push(node.id);
      }
    }

    return dependencies;
  }

  /**
   * Find circular dependencies in the graph
   */
  findCircularDependencies(graph) {
    const circular = [];
    const visited = new Set();
    const recursionStack = new Set();

    const dfs = (nodeId, path) => {
      if (recursionStack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);
        circular.push(path.slice(cycleStart).concat(nodeId));
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      const node = graph.nodes.find(n => n.id === nodeId);
      if (node) {
        for (const dep of node.dependencies) {
          dfs(dep, [...path]);
        }
      }

      recursionStack.delete(nodeId);
    };

    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return circular.map(c => c.join(' → '));
  }

  /**
   * Analyze data flow in the codebase
   */
  analyzeDataFlow(knowledge) {
    const flow = {
      entryPoints: [],
      processing: [],
      dataStores: [],
      outputs: [],
      description: ''
    };

    // Identify entry points (routes, main files, etc.)
    const entryPatterns = ['route', 'router', 'index.js', 'main.', 'app.'];
    for (const entity of knowledge.entities) {
      for (const pattern of entryPatterns) {
        if (entity.file.includes(pattern)) {
          flow.entryPoints.push({
            file: entity.file,
            name: entity.name,
            type: entity.type
          });
        }
      }
    }

    // Identify data stores
    const storagePatterns = ['repository', 'store', 'db', 'database', 'cache'];
    for (const entity of knowledge.entities) {
      for (const pattern of storagePatterns) {
        if (entity.name.toLowerCase().includes(pattern)) {
          flow.dataStores.push({
            file: entity.file,
            name: entity.name
          });
        }
      }
    }

    // Build description
    flow.description = this.generateDataFlowDescription(flow);

    return flow;
  }

  /**
   * Generate data flow description
   */
  generateDataFlowDescription(flow) {
    let description = '## Data Flow Analysis\n\n';

    if (flow.entryPoints.length > 0) {
      description += '### Entry Points\n';
      description += 'The following modules handle incoming requests:\n';
      flow.entryPoints.forEach(ep => {
        description += `- \`${ep.file}\` (${ep.type})\n`;
      });
      description += '\n';
    }

    if (flow.dataStores.length > 0) {
      description += '### Data Storage\n';
      description += 'Data persistence is handled by:\n';
      flow.dataStores.forEach(ds => {
        description += `- \`${ds.file}\`\n`;
      });
      description += '\n';
    }

    description += '### Flow Pattern\n';
    description += '```\n';
    description += '[Request] → [Entry Point] → [Business Logic] → [Data Store]\n';
    description += '     ↑                                              ↓\n';
    description += '     └──────────── [Response] ← ────────────────────┘\n';
    description += '```\n';

    return description;
  }

  /**
   * Generate directory structure visualization
   */
  generateDirectoryStructure(knowledge) {
    const files = [...new Set(knowledge.entities.map(e => e.file))];
    const tree = {};

    for (const file of files) {
      const parts = file.split('/');
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        
        if (!current[part]) {
          current[part] = isFile ? null : {};
        }
        if (!isFile) {
          current = current[part];
        }
      }
    }

    return this.renderTree(tree, '', true);
  }

  /**
   * Render tree structure as string
   */
  renderTree(node, prefix = '', isLast = true) {
    let result = '';
    const entries = Object.entries(node);
    const connector = isLast ? '└── ' : '├── ';

    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const isLastEntry = i === entries.length - 1;

      if (value === null) {
        result += `${prefix}${isLastEntry ? '└── ' : '├── '}${key}\n`;
      } else {
        result += `${prefix}${isLastEntry ? '└── ' : '├── '}${key}/\n`;
        result += this.renderTree(value, prefix + (isLastEntry ? '    ' : '│   '), isLastEntry);
      }
    }

    return result;
  }

  /**
   * Generate component diagram (Mermaid format)
   */
  generateComponentDiagram(modules) {
    let diagram = 'graph TB\n';

    const categories = {};
    for (const module of modules) {
      if (!categories[module.category]) {
        categories[module.category] = [];
      }
      categories[module.category].push(module);
    }

    // Create subgraphs for each category
    for (const [category, mods] of Object.entries(categories)) {
      const categoryId = category.replace(/\s+/g, '_');
      diagram += `    subgraph ${categoryId} ["${category}"]\n`;
      
      for (const mod of mods.slice(0, 10)) { // Limit to avoid too large diagrams
        const modId = mod.file.replace(/[\/.]/g, '_');
        diagram += `        ${modId}["${mod.name}"]\n`;
      }
      
      diagram += `    end\n`;
    }

    // Add relationships
    for (const module of modules.slice(0, 20)) {
      const modId = module.file.replace(/[\/.]/g, '_');
      for (const dep of module.dependencies.slice(0, 5)) {
        const depId = dep.replace(/[\/.]/g, '_');
        diagram += `    ${modId} --> ${depId}\n`;
      }
    }

    return diagram;
  }

  /**
   * Detect primary language
   */
  detectPrimaryLanguage(knowledge) {
    const byLanguage = knowledge.summary.byLanguage || {};
    const sorted = Object.entries(byLanguage).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'unknown';
  }

  /**
   * Export documentation in various formats
   */
  async export(documentation, format = 'markdown') {
    switch (format) {
      case 'markdown':
        return this.exportMarkdown(documentation);
      case 'json':
        return JSON.stringify(documentation, null, 2);
      case 'html':
        return this.exportHTML(documentation);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export as Markdown
   */
  exportMarkdown(docs) {
    let md = '';

    // Overview
    md += TEMPLATES.overview(docs.overview);

    // Modules by category
    md += '\n\n## Modules\n\n';
    const byCategory = {};
    for (const module of docs.modules) {
      if (!byCategory[module.category]) {
        byCategory[module.category] = [];
      }
      byCategory[module.category].push(module);
    }

    for (const [category, modules] of Object.entries(byCategory)) {
      md += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      for (const module of modules) {
        md += TEMPLATES.module(module);
      }
    }

    // Patterns
    md += '\n\n## Design Patterns\n\n';
    for (const pattern of docs.patterns) {
      md += TEMPLATES.pattern(pattern);
    }

    // Dependencies
    md += '\n\n## Dependencies\n\n';
    md += `### Internal Dependencies\n`;
    if (docs.dependencies.internal.length > 0) {
      md += docs.dependencies.internal.slice(0, 20).map(d => 
        `- \`${d.from}\` → \`${d.to}\``
      ).join('\n');
    } else {
      md += '_No internal dependencies found._\n';
    }

    md += `\n\n### External Dependencies\n`;
    if (docs.dependencies.external.length > 0) {
      md += docs.dependencies.external.slice(0, 20).map(d =>
        `- \`${d.from}\` → ${d.to}`
      ).join('\n');
    } else {
      md += '_No external dependencies found._\n';
    }

    if (docs.dependencies.circular.length > 0) {
      md += `\n\n### ⚠️ Circular Dependencies\n`;
      docs.dependencies.circular.forEach(c => {
        md += `- ${c}\n`;
      });
    }

    // Data Flow
    md += '\n\n## Data Flow\n\n';
    md += docs.dataFlow.description;

    // Metadata
    md += `\n\n---\n*Generated on ${docs.metadata.generatedAt} by Onboard*\n`;

    return md;
  }

  /**
   * Export as HTML
   */
  exportHTML(docs) {
    const markdown = this.exportMarkdown(docs);
    // Simple HTML wrapper (in production, use a proper markdown-to-html converter)
    return `<!DOCTYPE html>
<html>
<head>
    <title>Architecture Documentation</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; padding: 15px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 2px 5px; }
        h1, h2, h3 { color: #333; }
        .warning { color: #d97706; }
    </style>
</head>
<body>
${markdown.replace(/^#+\s/gm, '<h$&-').replace(/\n\n/g, '</p><p>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')}
</body>
</html>`;
  }
}

export default ArchitectureGenerator;
