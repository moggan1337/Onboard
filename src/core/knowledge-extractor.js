/**
 * Knowledge Extractor - Extracts structured knowledge from codebases
 * Supports multiple languages and provides comprehensive codebase understanding
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { parse } from 'path';
import chalk from 'chalk';

const SUPPORTED_EXTENSIONS = {
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.py': 'python',
  '.java': 'java',
  '.go': 'go',
  '.rs': 'rust',
  '.rb': 'ruby',
  '.php': 'php',
  '.cs': 'csharp',
  '.cpp': 'cpp',
  '.c': 'c',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.scala': 'scala',
  '.md': 'markdown',
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml'
};

/**
 * Language-specific parsers for extracting entities
 */
const LANGUAGE_PARSERS = {
  javascript: {
    extractExports: (content) => {
      const exports = [];
      const exportRegex = /export\s+(?:default\s+)?(?:const|let|var|function|class|type|interface)\s+(\w+)/g;
      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push({ name: match[1], type: 'export' });
      }
      return exports;
    },
    extractImports: (content) => {
      const imports = [];
      const importRegex = /import\s+(?:{[^}]+}|[^*])\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.push({ source: match[1], type: 'import' });
      }
      return imports;
    },
    extractClasses: (content) => {
      const classes = [];
      const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?/g;
      let match;
      while ((match = classRegex.exec(content)) !== null) {
        classes.push({
          name: match[1],
          extends: match[2] || null,
          type: 'class'
        });
      }
      return classes;
    },
    extractFunctions: (content) => {
      const functions = [];
      const funcRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[^=])\s*=>|/g;
      const namedFuncRegex = /function\s+(\w+)/g;
      let match;
      while ((match = namedFuncRegex.exec(content)) !== null) {
        functions.push({ name: match[1], type: 'function' });
      }
      return functions;
    }
  },
  typescript: {
    extractExports: (content) => {
      const exports = [];
      const exportRegex = /export\s+(?:default\s+)?(?:const|let|var|function|class|type|interface|enum)\s+(\w+)/g;
      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push({ name: match[1], type: 'export' });
      }
      return exports;
    },
    extractImports: (content) => {
      const imports = [];
      const importRegex = /import\s+(?:{[^}]+}|[^*])\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.push({ source: match[1], type: 'import' });
      }
      return imports;
    },
    extractClasses: (content) => {
      const classes = [];
      const classRegex = /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?/g;
      let match;
      while ((match = classRegex.exec(content)) !== null) {
        classes.push({
          name: match[1],
          extends: match[2] || null,
          implements: match[3] ? match[3].split(',').map(s => s.trim()) : [],
          type: 'class'
        });
      }
      return classes;
    },
    extractInterfaces: (content) => {
      const interfaces = [];
      const ifaceRegex = /(?:export\s+)?interface\s+(\w+)/g;
      let match;
      while ((match = ifaceRegex.exec(content)) !== null) {
        interfaces.push({ name: match[1], type: 'interface' });
      }
      return interfaces;
    },
    extractTypes: (content) => {
      const types = [];
      const typeRegex = /(?:export\s+)?type\s+(\w+)/g;
      let match;
      while ((match = typeRegex.exec(content)) !== null) {
        types.push({ name: match[1], type: 'type' });
      }
      return types;
    }
  },
  python: {
    extractExports: (content) => {
      const exports = [];
      const funcRegex = /def\s+(\w+)/g;
      const classRegex = /class\s+(\w+)(?:\([^)]*\))?:/g;
      let match;
      while ((match = funcRegex.exec(content)) !== null) {
        exports.push({ name: match[1], type: 'function' });
      }
      while ((match = classRegex.exec(content)) !== null) {
        exports.push({ name: match[1], type: 'class' });
      }
      return exports;
    },
    extractImports: (content) => {
      const imports = [];
      const importRegex = /(?:from\s+([\w.]+)\s+)?import\s+([^\n]+)/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.push({
          module: match[1] || match[2].split(' as ')[0].trim().split('.')[0],
          names: match[2].trim(),
          type: 'import'
        });
      }
      return imports;
    }
  }
};

/**
 * Default parser for unsupported languages
 */
const DEFAULT_PARSER = {
  extractExports: () => [],
  extractImports: () => [],
  extractClasses: () => [],
  extractFunctions: () => []
};

export class KnowledgeExtractor {
  constructor(config = {}) {
    this.config = {
      projectPath: config.projectPath || process.cwd(),
      excludePatterns: [
        'node_modules/**',
        'dist/**',
        'build/**',
        '.git/**',
        'coverage/**',
        '*.test.js',
        '*.spec.js',
        '*.min.js',
        '__pycache__/**',
        '.venv/**',
        'venv/**'
      ],
      includeExtensions: Object.keys(SUPPORTED_EXTENSIONS),
      ...config
    };
  }

  /**
   * Extract all knowledge from the codebase
   */
  async extract() {
    console.log(chalk.cyan('  🔍 Scanning codebase...'));
    
    const files = await this.findFiles();
    console.log(chalk.cyan(`  📄 Found ${files.length} files`));
    
    const entities = [];
    const relationships = [];
    const documentation = [];
    
    for (const file of files) {
      const extracted = await this.extractFromFile(file);
      entities.push(...extracted.entities);
      relationships.push(...extracted.relationships);
      if (extracted.documentation) {
        documentation.push(extracted.documentation);
      }
    }
    
    // Build dependency graph
    const dependencyGraph = this.buildDependencyGraph(relationships);
    
    // Extract patterns
    const patterns = this.identifyPatterns(entities);
    
    // Generate summary
    const summary = this.generateSummary(entities, relationships, patterns);
    
    return {
      entities,
      relationships,
      documentation,
      dependencyGraph,
      patterns,
      summary,
      metadata: {
        extractedAt: new Date().toISOString(),
        projectPath: this.config.projectPath,
        fileCount: files.length,
        language: this.detectPrimaryLanguage(files)
      }
    };
  }

  /**
   * Find all relevant files in the project
   */
  async findFiles() {
    const patterns = this.config.includeExtensions.flatMap(ext => [
      `**/*${ext}`
    ]);
    
    const files = [];
    for (const pattern of patterns) {
      const matched = await glob(pattern, {
        cwd: this.config.projectPath,
        ignore: this.config.excludePatterns,
        absolute: true
      });
      files.push(...matched);
    }
    
    return [...new Set(files)];
  }

  /**
   * Extract knowledge from a single file
   */
  async extractFromFile(filePath) {
    const ext = parse(filePath).ext.toLowerCase();
    const language = SUPPORTED_EXTENSIONS[ext] || 'unknown';
    const parser = LANGUAGE_PARSERS[language] || DEFAULT_PARSER;
    
    try {
      const content = await readFile(filePath, 'utf-8');
      const relativePath = filePath.replace(this.config.projectPath + '/', '');
      
      const entities = [];
      
      // Extract exports
      for (const exp of parser.extractExports(content)) {
        entities.push({
          name: exp.name,
          type: exp.type,
          file: relativePath,
          language,
          exports: exp
        });
      }
      
      // Extract classes
      if (parser.extractClasses) {
        for (const cls of parser.extractClasses(content)) {
          entities.push({
            name: cls.name,
            type: cls.type,
            file: relativePath,
            language,
            details: cls
          });
        }
      }
      
      // Extract interfaces (TypeScript)
      if (parser.extractInterfaces) {
        for (const iface of parser.extractInterfaces(content)) {
          entities.push({
            name: iface.name,
            type: iface.type,
            file: relativePath,
            language
          });
        }
      }
      
      // Extract types (TypeScript)
      if (parser.extractTypes) {
        for (const type of parser.extractTypes(content)) {
          entities.push({
            name: type.name,
            type: type.type,
            file: relativePath,
            language
          });
        }
      }
      
      // Extract imports for relationships
      const imports = parser.extractImports(content);
      
      // Build relationships
      const relationships = imports.map(imp => ({
        type: 'imports',
        from: relativePath,
        to: imp.source,
        details: imp
      }));
      
      // Extract documentation
      const documentation = this.extractDocumentation(content, relativePath);
      
      return { entities, relationships, documentation };
    } catch (error) {
      console.warn(chalk.yellow(`  ⚠️  Could not parse ${filePath}: ${error.message}`));
      return { entities: [], relationships: [], documentation: null };
    }
  }

  /**
   * Extract documentation comments from content
   */
  extractDocumentation(content, filePath) {
    const docs = [];
    
    // JSDoc/TSDoc style
    const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
    let match;
    while ((match = jsdocRegex.exec(content)) !== null) {
      const docContent = match[1];
      const descriptionMatch = docContent.match(/\*\s*([^@\n]+)/);
      const paramMatches = [...docContent.matchAll(/@param\s+{([^}]+)}\s+(\w+)\s*-?\s*(.*)/g)];
      const returnsMatch = docContent.match(/@returns?\s*-?\s*(.*)/);
      
      if (descriptionMatch) {
        docs.push({
          type: 'jsdoc',
          file: filePath,
          description: descriptionMatch[1].trim(),
          params: paramMatches.map(p => ({ type: p[1], name: p[2], description: p[3] })),
          returns: returnsMatch ? returnsMatch[1].trim() : null
        });
      }
    }
    
    // Python docstrings
    const pyDocRegex = /"""([\s\S]*?)"""'''/g;
    while ((match = pyDocRegex.exec(content)) !== null) {
      docs.push({
        type: 'docstring',
        file: filePath,
        content: match[1].trim()
      });
    }
    
    return docs.length > 0 ? docs : null;
  }

  /**
   * Build a dependency graph from relationships
   */
  buildDependencyGraph(relationships) {
    const nodes = new Map();
    const edges = [];
    
    for (const rel of relationships) {
      if (!nodes.has(rel.from)) {
        nodes.set(rel.from, { id: rel.from, type: 'file', dependencies: [], dependents: [] });
      }
      
      // Normalize the target path
      let target = rel.to;
      if (!target.startsWith('.') && !target.startsWith('/')) {
        // External or package import
        target = `external:${target}`;
      }
      
      if (!nodes.has(target)) {
        nodes.set(target, { id: target, type: 'module', dependencies: [], dependents: [] });
      }
      
      nodes.get(rel.from).dependencies.push(target);
      nodes.get(target).dependents.push(rel.from);
      edges.push({ source: rel.from, target, type: rel.type });
    }
    
    return { nodes: Array.from(nodes.values()), edges };
  }

  /**
   * Identify common patterns in the codebase
   */
  identifyPatterns(entities) {
    const patterns = [];
    
    // Singleton pattern
    const singletons = entities.filter(e => 
      e.name.toLowerCase().includes('singleton') || 
      e.name.toLowerCase().includes('instance')
    );
    if (singletons.length > 0) {
      patterns.push({ type: 'singleton', occurrences: singletons.length, entities: singletons.map(s => s.name) });
    }
    
    // Factory pattern
    const factories = entities.filter(e => 
      e.name.toLowerCase().includes('factory')
    );
    if (factories.length > 0) {
      patterns.push({ type: 'factory', occurrences: factories.length, entities: factories.map(f => f.name) });
    }
    
    // Service pattern
    const services = entities.filter(e => 
      e.type === 'class' && e.name.toLowerCase().includes('service')
    );
    if (services.length > 0) {
      patterns.push({ type: 'service', occurrences: services.length, entities: services.map(s => s.name) });
    }
    
    // Controller pattern
    const controllers = entities.filter(e => 
      e.name.toLowerCase().includes('controller')
    );
    if (controllers.length > 0) {
      patterns.push({ type: 'controller', occurrences: controllers.length, entities: controllers.map(c => c.name) });
    }
    
    // Hook pattern (React)
    const hooks = entities.filter(e => 
      e.name.startsWith('use') && e.type === 'function'
    );
    if (hooks.length > 0) {
      patterns.push({ type: 'hook', occurrences: hooks.length, entities: hooks.map(h => h.name) });
    }
    
    return patterns;
  }

  /**
   * Generate a summary of the extracted knowledge
   */
  generateSummary(entities, relationships, patterns) {
    const byType = {};
    for (const entity of entities) {
      if (!byType[entity.type]) {
        byType[entity.type] = 0;
      }
      byType[entity.type]++;
    }
    
    const byLanguage = {};
    for (const entity of entities) {
      if (!byLanguage[entity.language]) {
        byLanguage[entity.language] = 0;
      }
      byLanguage[entity.language]++;
    }
    
    return {
      totalEntities: entities.length,
      totalRelationships: relationships.length,
      totalPatterns: patterns.length,
      byType,
      byLanguage,
      keyModules: this.identifyKeyModules(entities, relationships)
    };
  }

  /**
   * Identify key modules based on connectivity
   */
  identifyKeyModules(entities, relationships) {
    const connectivity = new Map();
    
    for (const entity of entities) {
      if (!connectivity.has(entity.file)) {
        connectivity.set(entity.file, 0);
      }
    }
    
    for (const rel of relationships) {
      connectivity.set(rel.from, (connectivity.get(rel.from) || 0) + 1);
    }
    
    return Array.from(connectivity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([file, score]) => ({ file, connectivityScore: score }));
  }

  /**
   * Detect the primary language of the project
   */
  detectPrimaryLanguage(files) {
    const langCounts = {};
    
    for (const file of files) {
      const ext = parse(file).ext.toLowerCase();
      const lang = SUPPORTED_EXTENSIONS[ext];
      if (lang) {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }
    }
    
    const sorted = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'unknown';
  }

  /**
   * Get a specific entity and its context
   */
  async getEntityContext(entityName) {
    const knowledge = await this.extract();
    
    const entity = knowledge.entities.find(e => e.name === entityName);
    if (!entity) {
      return null;
    }
    
    // Find related entities
    const related = knowledge.relationships
      .filter(r => r.from.includes(entity.file))
      .map(r => r.to);
    
    return {
      entity,
      relatedEntities: related,
      documentation: knowledge.documentation.filter(d => d.file === entity.file),
      patterns: knowledge.patterns.filter(p => p.entities.includes(entityName))
    };
  }
}

export default KnowledgeExtractor;
