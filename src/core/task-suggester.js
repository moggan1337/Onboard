/**
 * Task Suggester - Suggests onboarding tasks based on skill level
 * Provides personalized task recommendations for new developers
 */

import chalk from 'chalk';

/**
 * Skill level definitions
 */
const SKILL_LEVELS = {
  beginner: {
    name: 'Beginner',
    description: 'New to the codebase or programming in general',
    taskTypes: ['documentation', 'testing', 'bugfix', 'simple-feature'],
    maxComplexity: 2,
    estimatedTime: { min: 30, max: 240 } // minutes
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Comfortable with the basics, building expertise',
    taskTypes: ['feature', 'refactoring', 'testing', 'review'],
    maxComplexity: 4,
    estimatedTime: { min: 60, max: 480 }
  },
  advanced: {
    name: 'Advanced',
    description: 'Deep knowledge, ready for complex tasks',
    taskTypes: ['architecture', 'optimization', 'security', 'infrastructure'],
    maxComplexity: 5,
    estimatedTime: { min: 120, max: 1440 }
  }
};

/**
 * Task templates organized by category
 */
const TASK_TEMPLATES = {
  documentation: [
    {
      title: 'Update README with setup instructions',
      description: 'Review and update the project README with accurate setup and installation instructions.',
      skills: ['writing', 'communication'],
      acceptanceCriteria: ['Clear prerequisites', 'Step-by-step instructions', 'Troubleshooting section']
    },
    {
      title: 'Document an API endpoint',
      description: 'Add comprehensive documentation for an undocumented API endpoint.',
      skills: ['writing', 'technical'],
      acceptanceCriteria: ['Endpoint description', 'Parameter documentation', 'Response examples']
    },
    {
      title: 'Create contributing guidelines',
      description: 'Write or update CONTRIBUTING.md with guidelines for contributors.',
      skills: ['writing', 'process'],
      acceptanceCriteria: ['Code style guidelines', 'PR process', 'Issue templates']
    },
    {
      title: 'Add inline code comments',
      description: 'Add explanatory comments to complex sections of code.',
      skills: ['writing', 'code-understanding'],
      acceptanceCriteria: ['No redundant comments', 'Explains "why" not "what"', 'Follows style guide']
    }
  ],
  testing: [
    {
      title: 'Write unit tests for a function',
      description: 'Add comprehensive unit tests for an existing function or module.',
      skills: ['testing', 'assertions'],
      acceptanceCriteria: ['Test happy path', 'Test edge cases', 'Test error conditions', '90%+ coverage']
    },
    {
      title: 'Add integration tests',
      description: 'Create integration tests for a feature involving multiple components.',
      skills: ['testing', 'integration'],
      acceptanceCriteria: ['Test data flow', 'Test component interaction', 'Mock external services']
    },
    {
      title: 'Set up E2E tests',
      description: 'Configure and write end-to-end tests for critical user flows.',
      skills: ['testing', 'e2e'],
      acceptanceCriteria: ['Critical paths covered', 'Browser automation', 'CI integration']
    },
    {
      title: 'Add test fixtures',
      description: 'Create reusable test fixtures and mock data for the test suite.',
      skills: ['testing', 'data-management'],
      acceptanceCriteria: ['Realistic data', 'Easy to modify', 'Well-documented']
    }
  ],
  bugfix: [
    {
      title: 'Fix a documentation typo',
      description: 'Find and correct spelling or grammar errors in documentation.',
      skills: ['attention-to-detail', 'writing'],
      acceptanceCriteria: ['No new typos introduced', 'Consistent with existing style']
    },
    {
      title: 'Fix a simple UI bug',
      description: 'Fix a minor UI issue like alignment, spacing, or color.',
      skills: ['css', 'ui-design'],
      acceptanceCriteria: ['Matches design specs', 'Responsive', 'No regressions']
    },
    {
      title: 'Fix error handling',
      description: 'Improve error handling in an existing function or module.',
      skills: ['error-handling', 'defensive-programming'],
      acceptanceCriteria: ['All error cases handled', 'Clear error messages', 'Logged appropriately']
    },
    {
      title: 'Fix a memory leak',
      description: 'Identify and fix a memory leak in the application.',
      skills: ['debugging', 'performance'],
      acceptanceCriteria: ['Memory usage stable', 'Reproducible test case', 'Root cause documented']
    }
  ],
  'simple-feature': [
    {
      title: 'Add a button component',
      description: 'Create a reusable button component with various states.',
      skills: ['ui-design', 'component-design'],
      acceptanceCriteria: ['All button states', 'Accessible', 'Well-documented']
    },
    {
      title: 'Add form validation',
      description: 'Implement client-side validation for a form.',
      skills: ['forms', 'validation'],
      acceptanceCriteria: ['Validates all fields', 'Shows clear errors', 'Prevents invalid submission']
    },
    {
      title: 'Add loading states',
      description: 'Add loading indicators to async operations.',
      skills: ['ui-design', 'async-programming'],
      acceptanceCriteria: ['Loading state visible', 'Disabled during load', 'Error handling']
    },
    {
      title: 'Add sorting/filtering',
      description: 'Implement sorting and filtering for a data table or list.',
      skills: ['data-manipulation', 'ui-design'],
      acceptanceCriteria: ['Multiple sort options', 'Filter combinations', 'Performance optimized']
    }
  ],
  feature: [
    {
      title: 'Implement user authentication',
      description: 'Add user authentication flow including login, logout, and session management.',
      skills: ['security', 'authentication', 'state-management'],
      acceptanceCriteria: ['Secure password handling', 'Session management', 'Logout functionality']
    },
    {
      title: 'Build a dashboard',
      description: 'Create a dashboard page with multiple widgets and data visualization.',
      skills: ['ui-design', 'data-visualization', 'api-integration'],
      acceptanceCriteria: ['Multiple widgets', 'Real-time updates', 'Responsive design']
    },
    {
      title: 'Implement file upload',
      description: 'Add file upload functionality with progress indication and validation.',
      skills: ['file-handling', 'async-programming'],
      acceptanceCriteria: ['Progress indicator', 'File type validation', 'Size limits', 'Error handling']
    },
    {
      title: 'Add search functionality',
      description: 'Implement full-text search with filters and pagination.',
      skills: ['search', 'database', 'ui-design'],
      acceptanceCriteria: ['Fast response', 'Relevant results', 'Pagination', 'Clear filters']
    }
  ],
  refactoring: [
    {
      title: 'Extract utility functions',
      description: 'Identify duplicate code and extract common utility functions.',
      skills: ['code-quality', 'refactoring'],
      acceptanceCriteria: ['DRY code', 'Unit tests pass', 'No functionality changes']
    },
    {
      title: 'Migrate to new patterns',
      description: 'Update code to follow newly adopted patterns or best practices.',
      skills: ['code-quality', 'pattern-adoption'],
      acceptanceCriteria: ['Consistent with new patterns', 'All tests pass', 'Documentation updated']
    },
    {
      title: 'Improve naming',
      description: 'Rename variables, functions, and classes for better clarity.',
      skills: ['code-quality', 'naming-conventions'],
      acceptanceCriteria: ['Descriptive names', 'Consistent style', 'No breaking changes']
    },
    {
      title: 'Reduce complexity',
      description: 'Simplify complex functions by breaking them into smaller pieces.',
      skills: ['code-quality', 'complexity-analysis'],
      acceptanceCriteria: ['Cyclomatic complexity reduced', 'Functions < 50 lines', 'All tests pass']
    }
  ],
  review: [
    {
      title: 'Review documentation PRs',
      description: 'Review pull requests focused on documentation improvements.',
      skills: ['writing', 'attention-to-detail'],
      acceptanceCriteria: ['Grammar check', 'Clarity review', 'Technical accuracy']
    },
    {
      title: 'Review test coverage',
      description: 'Review code changes for adequate test coverage.',
      skills: ['testing', 'code-quality'],
      acceptanceCriteria: ['Coverage analysis', 'Edge cases considered', 'No redundant tests']
    },
    {
      title: 'Review accessibility',
      description: 'Review UI changes for accessibility compliance.',
      skills: ['accessibility', 'ui-design'],
      acceptanceCriteria: ['WCAG compliance', 'Screen reader tested', 'Keyboard navigation']
    },
    {
      title: 'Review security',
      description: 'Review code changes for potential security issues.',
      skills: ['security', 'best-practices'],
      acceptanceCriteria: ['No vulnerabilities', 'Input validation', 'Secure defaults']
    }
  ],
  architecture: [
    {
      title: 'Design new service',
      description: 'Design and document a new microservice architecture.',
      skills: ['architecture', 'system-design', 'documentation'],
      acceptanceCriteria: ['API contracts defined', 'Data flow documented', 'Scalability considered']
    },
    {
      title: 'Plan database migration',
      description: 'Plan and document a database schema migration strategy.',
      skills: ['database', 'migration', 'planning'],
      acceptanceCriteria: ['Migration steps documented', 'Rollback plan', 'Data integrity checks']
    },
    {
      title: 'Define API contracts',
      description: 'Create OpenAPI/Swagger specifications for new APIs.',
      skills: ['api-design', 'documentation'],
      acceptanceCriteria: ['All endpoints documented', 'Request/response schemas', 'Error codes']
    },
    {
      title: 'Evaluate tech stack',
      description: 'Research and evaluate new technologies for potential adoption.',
      skills: ['research', 'analysis', 'recommendations'],
      acceptanceCriteria: ['Pros/cons analysis', 'Proof of concept', 'Team presentation']
    }
  ],
  optimization: [
    {
      title: 'Optimize database queries',
      description: 'Identify and optimize slow database queries.',
      skills: ['database', 'performance', 'profiling'],
      acceptanceCriteria: ['Query times reduced', 'Indexes added', 'No functionality loss']
    },
    {
      title: 'Improve build time',
      description: 'Reduce project build and test execution time.',
      skills: ['build-tools', 'performance'],
      acceptanceCriteria: ['Build time reduced by 30%+', 'CI/CD optimized', 'Parallel execution']
    },
    {
      title: 'Optimize bundle size',
      description: 'Reduce JavaScript/CSS bundle size through code splitting and tree shaking.',
      skills: ['webpack', 'bundling', 'performance'],
      acceptanceCriteria: ['Bundle size reduced', 'Lazy loading added', 'No broken features']
    },
    {
      title: 'Implement caching',
      description: 'Add caching layer to improve application performance.',
      skills: ['caching', 'performance', 'architecture'],
      acceptanceCriteria: ['Cache hit rate > 80%', 'Cache invalidation works', 'Memory efficient']
    }
  ],
  security: [
    {
      title: 'Implement input sanitization',
      description: 'Add comprehensive input sanitization across the application.',
      skills: ['security', 'validation'],
      acceptanceCriteria: ['All inputs sanitized', 'XSS prevention', 'SQL injection prevention']
    },
    {
      title: 'Add rate limiting',
      description: 'Implement rate limiting to protect API endpoints.',
      skills: ['security', 'api-design'],
      acceptanceCriteria: ['Rate limits enforced', 'Clear error messages', 'Configurable limits']
    },
    {
      title: 'Implement CSRF protection',
      description: 'Add CSRF tokens and protection to all state-changing endpoints.',
      skills: ['security', 'web-security'],
      acceptanceCriteria: ['CSRF tokens present', 'Validation working', 'Tests added']
    },
    {
      title: 'Security audit',
      description: 'Conduct a comprehensive security audit of the codebase.',
      skills: ['security', 'audit'],
      acceptanceCriteria: ['Vulnerability report', 'Risk assessment', 'Remediation plan']
    }
  ],
  infrastructure: [
    {
      title: 'Set up CI/CD pipeline',
      description: 'Configure continuous integration and deployment pipeline.',
      skills: ['ci-cd', 'devops'],
      acceptanceCriteria: ['Automated tests', 'Automated deployments', 'Rollback capability']
    },
    {
      title: 'Configure monitoring',
      description: 'Set up application monitoring and alerting.',
      skills: ['monitoring', 'devops', 'observability'],
      acceptanceCriteria: ['Metrics collected', 'Alerts configured', 'Dashboards created']
    },
    {
      title: 'Set up staging environment',
      description: 'Create and configure a staging environment.',
      skills: ['devops', 'infrastructure'],
      acceptanceCriteria: ['Mirrors production', 'Data sanitized', 'Deployment automated']
    },
    {
      title: 'Implement logging',
      description: 'Set up structured logging across the application.',
      skills: ['logging', 'observability'],
      acceptanceCriteria: ['Structured format', 'Log levels used', 'Searchable logs']
    }
  ]
};

/**
 * Interest to task type mapping
 */
const INTEREST_MAPPING = {
  'frontend': ['simple-feature', 'testing', 'bugfix', 'refactoring'],
  'backend': ['feature', 'architecture', 'security'],
  'devops': ['infrastructure', 'optimization', 'security'],
  'testing': ['testing', 'review'],
  'security': ['security', 'review'],
  'performance': ['optimization', 'infrastructure'],
  'documentation': ['documentation'],
  'database': ['architecture', 'optimization'],
  'mobile': ['simple-feature', 'testing', 'ui-design'],
  'api': ['feature', 'architecture', 'security']
};

export class TaskSuggester {
  constructor(config = {}) {
    this.config = {
      ...config,
      defaultSkillLevel: config.defaultSkillLevel || 'beginner'
    };
  }

  /**
   * Suggest tasks based on skill level and interests
   */
  suggest(skillLevel = 'beginner', interests = []) {
    const level = SKILL_LEVELS[skillLevel] || SKILL_LEVELS.beginner;
    
    console.log(chalk.cyan(`  🎯 Generating tasks for ${level.name} developer...`));

    const tasks = [];
    const usedTitles = new Set();

    // Determine which task types to include based on skill level
    let taskTypes = level.taskTypes;
    
    // Filter by interests if provided
    if (interests.length > 0) {
      const interestTypes = new Set();
      for (const interest of interests) {
        const mapped = INTEREST_MAPPING[interest.toLowerCase()];
        if (mapped) {
          mapped.forEach(t => interestTypes.add(t));
        }
      }
      if (interestTypes.size > 0) {
        taskTypes = [...interestTypes].filter(t => level.taskTypes.includes(t));
      }
    }

    // Generate tasks from relevant templates
    for (const taskType of taskTypes) {
      const templates = TASK_TEMPLATES[taskType] || [];
      
      for (const template of templates) {
        if (usedTitles.has(template.title)) continue;
        if (tasks.length >= 10) break;

        const task = this.createTask(template, level);
        tasks.push(task);
        usedTitles.add(template.title);
      }
      
      if (tasks.length >= 10) break;
    }

    // Sort by priority (beginner-friendly first)
    tasks.sort((a, b) => {
      const complexityDiff = a.complexity - b.complexity;
      if (complexityDiff !== 0) return complexityDiff;
      return a.estimatedMinutes - b.estimatedMinutes;
    });

    return tasks;
  }

  /**
   * Create a task from a template
   */
  createTask(template, level) {
    const complexity = this.calculateComplexity(template);
    const estimatedMinutes = this.estimateTime(template, level);

    return {
      ...template,
      complexity,
      estimatedMinutes,
      estimatedTime: this.formatTime(estimatedMinutes),
      priority: this.calculatePriority(complexity, level),
      prerequisites: this.getPrerequisites(template),
      resources: this.getResources(template),
      verificationSteps: this.getVerificationSteps(template)
    };
  }

  /**
   * Calculate task complexity (1-5)
   */
  calculateComplexity(template) {
    let complexity = 1;

    // Base complexity on task title keywords
    const highComplexity = ['architecture', 'security', 'optimization', 'migration', 'design'];
    const medComplexity = ['implement', 'build', 'create', 'refactor', 'improve', 'add'];

    for (const keyword of highComplexity) {
      if (template.title.toLowerCase().includes(keyword)) {
        complexity += 2;
        break;
      }
    }

    for (const keyword of medComplexity) {
      if (template.title.toLowerCase().includes(keyword)) {
        complexity += 1;
        break;
      }
    }

    return Math.min(5, complexity);
  }

  /**
   * Estimate task completion time in minutes
   */
  estimateTime(template, level) {
    const baseTime = (level.estimatedTime.min + level.estimatedTime.max) / 2;
    const complexity = this.calculateComplexity(template);
    
    // Adjust based on complexity
    const multiplier = 0.5 + (complexity * 0.25);
    
    return Math.round(baseTime * multiplier);
  }

  /**
   * Format time as human-readable string
   */
  formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Calculate task priority
   */
  calculatePriority(complexity, level) {
    const complexityDiff = level.maxComplexity - complexity;
    
    if (complexityDiff >= 2) return 'high';
    if (complexityDiff >= 0) return 'medium';
    return 'low';
  }

  /**
   * Get prerequisites for a task
   */
  getPrerequisites(template) {
    const prereqs = [];

    if (template.skills.includes('security')) {
      prereqs.push('Understanding of security best practices');
    }
    if (template.skills.includes('database')) {
      prereqs.push('Database schema knowledge');
    }
    if (template.skills.includes('testing')) {
      prereqs.push('Familiarity with testing frameworks');
    }
    if (template.skills.includes('ui-design')) {
      prereqs.push('Design system guidelines');
    }

    return prereqs;
  }

  /**
   * Get helpful resources for a task
   */
  getResources(template) {
    const resources = [];

    for (const skill of template.skills) {
      resources.push({
        skill,
        suggestions: this.getResourceSuggestions(skill)
      });
    }

    return resources;
  }

  /**
   * Get resource suggestions for a skill
   */
  getResourceSuggestions(skill) {
    const suggestions = {
      'writing': ['Style guides', 'Markdown tutorials', 'Technical writing best practices'],
      'testing': ['Test-driven development guide', 'Jest/Mocha documentation', 'Code coverage tools'],
      'security': ['OWASP guidelines', 'Security audit checklist', 'Secure coding practices'],
      'ui-design': ['Design system documentation', 'Accessibility guidelines', 'Responsive design principles'],
      'architecture': ['System design patterns', 'UML guides', 'Architecture decision records'],
      'performance': ['Profiling tools', 'Performance benchmarks', 'Optimization techniques']
    };

    return suggestions[skill] || ['General documentation', 'Code examples', 'Related PRs'];
  }

  /**
   * Get verification steps for a task
   */
  getVerificationSteps(template) {
    const steps = [
      'Code follows project style guidelines',
      'Tests pass locally',
      'No linting errors',
      'Documentation updated if needed'
    ];

    if (template.skills.includes('testing')) {
      steps.push('Test coverage maintained or increased');
    }

    if (template.skills.includes('security')) {
      steps.push('Security scan passed');
    }

    if (template.skills.includes('ui-design')) {
      steps.push('Visual review completed');
    }

    return steps;
  }

  /**
   * Get skill level info
   */
  getSkillLevelInfo(level) {
    return SKILL_LEVELS[level] || SKILL_LEVELS.beginner;
  }

  /**
   * Get all available interests
   */
  getAvailableInterests() {
    return Object.keys(INTEREST_MAPPING);
  }

  /**
   * Get all task types
   */
  getAllTaskTypes() {
    return Object.keys(TASK_TEMPLATES);
  }
}

export default TaskSuggester;
