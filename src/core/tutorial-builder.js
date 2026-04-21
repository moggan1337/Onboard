/**
 * Tutorial Builder - Creates interactive tutorials for onboarding
 * Generates step-by-step learning guides based on topics
 */

import chalk from 'chalk';

/**
 * Tutorial topics and their content
 */
const TUTORIAL_TOPICS = {
  'git-basics': {
    title: 'Git Basics',
    description: 'Learn the fundamentals of version control with Git',
    difficulty: 'beginner',
    prerequisites: [],
    sections: [
      {
        title: 'Introduction to Git',
        content: 'Git is a distributed version control system that tracks changes in your code files.',
        concepts: ['repository', 'commit', 'branch']
      },
      {
        title: 'Creating Commits',
        content: 'A commit is like a snapshot of your changes at a specific point in time.',
        steps: [
          'Stage changes with git add',
          'Review staged changes with git status',
          'Create commit with git commit',
          'Write a meaningful commit message'
        ],
        codeExamples: [
          {
            command: 'git add filename.js',
            description: 'Stage a specific file'
          },
          {
            command: 'git add .',
            description: 'Stage all changes'
          },
          {
            command: 'git commit -m "Add new feature"',
            description: 'Create a commit with a message'
          }
        ]
      },
      {
        title: 'Working with Branches',
        content: 'Branches allow you to work on features in isolation without affecting the main codebase.',
        steps: [
          'Create a new branch',
          'Switch to the new branch',
          'Make and commit changes',
          'Merge changes back to main'
        ],
        codeExamples: [
          {
            command: 'git branch feature-name',
            description: 'Create a new branch'
          },
          {
            command: 'git checkout feature-name',
            description: 'Switch to the branch'
          },
          {
            command: 'git checkout -b feature-name',
            description: 'Create and switch in one command'
          },
          {
            command: 'git merge feature-name',
            description: 'Merge branch into current'
          }
        ]
      },
      {
        title: 'Remote Repositories',
        content: 'Connect your local repository to a remote server like GitHub for collaboration.',
        codeExamples: [
          {
            command: 'git remote add origin url',
            description: 'Add a remote repository'
          },
          {
            command: 'git push origin main',
            description: 'Push commits to remote'
          },
          {
            command: 'git pull origin main',
            description: 'Pull changes from remote'
          }
        ]
      }
    ]
  },
  'code-review': {
    title: 'Code Review Process',
    description: 'Understand how to participate in code reviews',
    difficulty: 'beginner',
    prerequisites: ['git-basics'],
    sections: [
      {
        title: 'What is Code Review?',
        content: 'Code review is a software quality assurance practice where one or more people check the code changes.',
        benefits: [
          'Catch bugs early',
          'Share knowledge across the team',
          'Maintain code quality standards',
          'Mentor junior developers'
        ]
      },
      {
        title: 'Submitting a Pull Request',
        content: 'Follow these steps to submit your code for review.',
        steps: [
          'Push your branch to the remote repository',
          'Create a pull request on GitHub/GitLab',
          'Fill out the PR template',
          'Request reviewers',
          'Address initial feedback'
        ]
      },
      {
        title: 'Reviewing Others\' Code',
        content: 'When reviewing, focus on these key areas.',
        checklist: [
          'Does the code do what it claims?',
          'Is the code readable and well-documented?',
          'Are there proper tests?',
          'Does it follow project conventions?',
          'Are there any potential bugs or security issues?'
        ]
      },
      {
        title: 'Giving Constructive Feedback',
        content: 'How to provide feedback that helps rather than discourages.',
        examples: [
          {
            type: 'good',
            comment: 'Consider extracting this logic into a separate function for reusability.'
          },
          {
            type: 'good',
            comment: 'What do you think about using a constant here instead of a magic number?'
          },
          {
            type: 'avoid',
            comment: 'This is wrong. Rewrite it.'
          }
        ]
      }
    ]
  },
  'testing-basics': {
    title: 'Testing Fundamentals',
    description: 'Learn why and how to write effective tests',
    difficulty: 'intermediate',
    prerequisites: ['git-basics'],
    sections: [
      {
        title: 'Why Testing Matters',
        content: 'Tests ensure your code works correctly and prevent regressions when making changes.',
        benefits: [
          'Catch bugs before production',
          'Document expected behavior',
          'Enable confident refactoring',
          'Speed up code reviews'
        ]
      },
      {
        title: 'Types of Tests',
        content: 'Different levels of testing serve different purposes.',
        categories: [
          {
            name: 'Unit Tests',
            description: 'Test individual functions or components in isolation',
            example: 'Test that a calculateTotal() function returns correct values'
          },
          {
            name: 'Integration Tests',
            description: 'Test how multiple components work together',
            example: 'Test that a form submission correctly saves to the database'
          },
          {
            name: 'End-to-End Tests',
            description: 'Test complete user flows in a simulated environment',
            example: 'Test the entire checkout process from cart to confirmation'
          }
        ]
      },
      {
        title: 'Writing Good Tests',
        content: 'Follow the AAA pattern: Arrange, Act, Assert.',
        codeExamples: [
          {
            language: 'javascript',
            code: `describe('calculateTotal', () => {
  it('should add tax to the subtotal', () => {
    // Arrange
    const subtotal = 100;
    const taxRate = 0.1;
    
    // Act
    const total = calculateTotal(subtotal, taxRate);
    
    // Assert
    expect(total).toBe(110);
  });
});`
          }
        ]
      },
      {
        title: 'Test-Driven Development',
        content: 'TDD inverts the traditional workflow: write tests first, then write code to pass them.',
        steps: [
          'Write a failing test',
          'Write minimal code to pass the test',
          'Refactor the code',
          'Repeat'
        ],
        benefits: [
          'Better test coverage',
          'Simpler, more focused code',
          'Clearer requirements',
          'Confidence in refactoring'
        ]
      }
    ]
  },
  'api-development': {
    title: 'API Development Best Practices',
    description: 'Design and build robust REST APIs',
    difficulty: 'intermediate',
    prerequisites: ['testing-basics'],
    sections: [
      {
        title: 'REST Principles',
        content: 'REST (Representational State Transfer) is an architectural style for web APIs.',
        principles: [
          'Client-Server Architecture',
          'Statelessness',
          'Cacheability',
          'Uniform Interface'
        ]
      },
      {
        title: 'HTTP Methods',
        content: 'Use the correct HTTP method for each operation.',
        table: {
          headers: ['Method', 'Purpose', 'Idempotent', 'Example'],
          rows: [
            ['GET', 'Retrieve data', 'Yes', '/api/users'],
            ['POST', 'Create new resource', 'No', 'POST /api/users'],
            ['PUT', 'Replace a resource', 'Yes', 'PUT /api/users/1'],
            ['PATCH', 'Partially update', 'No', 'PATCH /api/users/1'],
            ['DELETE', 'Remove a resource', 'Yes', 'DELETE /api/users/1']
          ]
        }
      },
      {
        title: 'Status Codes',
        content: 'Return appropriate HTTP status codes to indicate the result.',
        categories: [
          { range: '2xx', meaning: 'Success', examples: ['200 OK', '201 Created', '204 No Content'] },
          { range: '4xx', meaning: 'Client Error', examples: ['400 Bad Request', '401 Unauthorized', '404 Not Found'] },
          { range: '5xx', meaning: 'Server Error', examples: ['500 Internal Server Error', '503 Service Unavailable'] }
        ]
      },
      {
        title: 'Error Handling',
        content: 'Return consistent, informative error responses.',
        codeExamples: [
          {
            language: 'json',
            code: `{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ]
  }
}`
          }
        ]
      }
    ]
  },
  'debugging': {
    title: 'Debugging Techniques',
    description: 'Learn systematic approaches to finding and fixing bugs',
    difficulty: 'beginner',
    prerequisites: [],
    sections: [
      {
        title: 'The Scientific Method',
        content: 'Apply the scientific method to debugging.',
        steps: [
          'Observe: Gather information about the bug',
          'Hypothesize: Form a theory about the cause',
          'Predict: What should happen if your theory is correct?',
          'Test: Run experiments to test your hypothesis',
          'Analyze: Did the results match your prediction?'
        ]
      },
      {
        title: 'Logging Strategies',
        content: 'Use strategic logging to understand code execution.',
        techniques: [
          'Log at entry and exit of functions',
          'Log variable values at decision points',
          'Use different log levels appropriately',
          'Include context (request ID, user ID) in logs'
        ]
      },
      {
        title: 'Using Debuggers',
        content: 'Interactive debuggers let you pause and inspect code execution.',
        features: [
          'Breakpoints: Pause at specific lines',
          'Step Over: Execute current line and move to next',
          'Step Into: Enter function calls',
          'Watch: Monitor variable values',
          'Call Stack: See the execution path'
        ]
      },
      {
        title: 'Common Bug Patterns',
        content: 'Watch out for these frequent bug sources.',
        patterns: [
          {
            name: 'Off-by-One Errors',
            description: 'Loop conditions or array indices are off by one'
          },
          {
            name: 'Null Reference',
            description: 'Attempting to access properties on null/undefined'
          },
          {
            name: 'Race Conditions',
            description: 'Code behavior depends on unpredictable timing'
          },
          {
            name: 'Memory Leaks',
            description: 'Resources not properly released over time'
          }
        ]
      }
    ]
  },
  'security': {
    title: 'Security Best Practices',
    description: 'Build secure applications from the start',
    difficulty: 'advanced',
    prerequisites: ['api-development'],
    sections: [
      {
        title: 'OWASP Top 10',
        content: 'The most critical web application security risks.',
        risks: [
          'Injection',
          'Broken Authentication',
          'Sensitive Data Exposure',
          'XML External Entities (XXE)',
          'Broken Access Control',
          'Security Misconfiguration',
          'Cross-Site Scripting (XSS)',
          'Insecure Deserialization',
          'Using Components with Known Vulnerabilities',
          'Insufficient Logging & Monitoring'
        ]
      },
      {
        title: 'Input Validation',
        content: 'Never trust user input. Always validate and sanitize.',
        practices: [
          'Validate on the server (client-side is for UX only)',
          'Use allowlists over blocklists',
          'Validate type, length, format, and range',
          'Sanitize output to prevent XSS'
        ]
      },
      {
        title: 'Authentication & Authorization',
        content: 'Properly implement identity and access control.',
        concepts: [
          'Authentication: Verifying who a user is',
          'Authorization: Verifying what a user can do',
          'Use proven libraries (don\'t roll your own)',
          'Implement proper session management',
          'Hash and salt passwords'
        ]
      },
      {
        title: 'Secure Coding Checklist',
        content: 'Use this checklist for every code review.',
        checklist: [
          'All user input validated and sanitized',
          'Sensitive data encrypted at rest and in transit',
          'Proper error handling (no stack traces to users)',
          'Secure defaults used',
          'Dependencies up to date',
          'Secrets not hardcoded or logged'
        ]
      }
    ]
  }
};

/**
 * Difficulty level configurations
 */
const DIFFICULTY_CONFIG = {
  beginner: {
    name: 'Beginner',
    description: 'No prior experience required',
    estimatedTime: '30-60 minutes',
    learningStyle: 'Hands-on with many examples'
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Basic understanding of the topic required',
    estimatedTime: '60-120 minutes',
    learningStyle: 'Conceptual with practical exercises'
  },
  advanced: {
    name: 'Advanced',
    description: 'Solid experience in the area needed',
    estimatedTime: '2-4 hours',
    learningStyle: 'Deep dives with complex scenarios'
  }
};

export class TutorialBuilder {
  constructor(config = {}) {
    this.config = config;
    this.topics = { ...TUTORIAL_TOPICS, ...config.customTopics };
  }

  /**
   * Build a tutorial for a topic
   */
  async build(topicName, difficulty = 'beginner') {
    console.log(chalk.cyan(`  📚 Building tutorial for: ${topicName}`));

    // Find matching topic
    const topic = this.topics[topicName.toLowerCase()];
    if (!topic) {
      // Try fuzzy matching
      const matched = this.findSimilarTopic(topicName);
      if (matched) {
        return this.buildTutorial(matched, difficulty);
      }
      throw new Error(`Topic not found: ${topicName}`);
    }

    return this.buildTutorial(topic, difficulty);
  }

  /**
   * Build a complete tutorial object
   */
  buildTutorial(topic, requestedDifficulty) {
    const difficulty = DIFFICULTY_CONFIG[requestedDifficulty] || DIFFICULTY_CONFIG.beginner;
    
    // Calculate tutorial metadata
    const totalSections = topic.sections.length;
    const estimatedTotalTime = this.estimateTime(topic, requestedDifficulty);
    
    // Filter sections based on difficulty
    const filteredSections = this.filterSectionsByDifficulty(topic.sections, requestedDifficulty);
    
    // Generate interactive elements
    const quizzes = this.generateQuizzes(filteredSections);
    const exercises = this.generateExercises(filteredSections);
    
    // Build tutorial structure
    const tutorial = {
      metadata: {
        id: topic.title.toLowerCase().replace(/\s+/g, '-'),
        title: topic.title,
        description: topic.description,
        difficulty: requestedDifficulty,
        difficultyInfo: difficulty,
        estimatedTime: estimatedTotalTime,
        prerequisites: topic.prerequisites || [],
        totalSections: filteredSections.length,
        generatedAt: new Date().toISOString()
      },
      sections: filteredSections.map((section, index) => ({
        id: `${index + 1}`,
        title: section.title,
        type: this.determineSectionType(section),
        content: section.content,
        concepts: section.concepts || [],
        steps: section.steps || [],
        codeExamples: section.codeExamples || [],
        checklist: section.checklist || [],
        table: section.table || null,
        benefits: section.benefits || [],
        categories: section.categories || [],
        patterns: section.patterns || [],
        risks: section.risks || [],
        practices: section.practices || [],
        principles: section.principles || [],
        features: section.features || [],
        techniques: section.techniques || [],
        examples: section.examples || []
      })),
      interactive: {
        quizzes,
        exercises
      },
      navigation: this.generateNavigation(filteredSections),
      resources: this.generateResources(topic.title)
    };

    return tutorial;
  }

  /**
   * Filter sections by difficulty
   */
  filterSectionsByDifficulty(sections, difficulty) {
    if (difficulty === 'advanced') {
      return sections; // Show all sections for advanced
    }
    
    // For beginner/intermediate, show most sections but mark advanced ones
    return sections.map(section => ({
      ...section,
      isAdvanced: this.isAdvancedSection(section)
    }));
  }

  /**
   * Check if a section is advanced
   */
  isAdvancedSection(section) {
    const advancedKeywords = ['advanced', 'expert', 'production', 'enterprise'];
    const content = (section.title + ' ' + (section.content || '')).toLowerCase();
    
    for (const keyword of advancedKeywords) {
      if (content.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Determine section type
   */
  determineSectionType(section) {
    if (section.codeExamples?.length > 0) return 'hands-on';
    if (section.checklist) return 'checklist';
    if (section.steps) return 'step-by-step';
    if (section.table) return 'reference';
    if (section.categories) return 'categorical';
    return 'conceptual';
  }

  /**
   * Estimate total tutorial time
   */
  estimateTime(topic, difficulty) {
    const baseMinutes = topic.sections.length * 10;
    const difficultyMultiplier = {
      beginner: 1.2,
      intermediate: 1.0,
      advanced: 0.8
    };
    
    const total = Math.round(baseMinutes * (difficultyMultiplier[difficulty] || 1));
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Generate quizzes for sections
   */
  generateQuizzes(sections) {
    const quizzes = [];
    
    for (const section of sections) {
      if (section.concepts?.length > 0) {
        quizzes.push({
          sectionId: section.title,
          questions: section.concepts.map((concept, i) => ({
            id: `${sections.indexOf(section)}-concept-${i}`,
            question: `What is "${concept}" in the context of this tutorial?`,
            type: 'short-answer',
            hint: 'Think about how this concept applies to the topic'
          }))
        });
      }
    }
    
    return quizzes;
  }

  /**
   * Generate exercises for sections
   */
  generateExercises(sections) {
    const exercises = [];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      if (section.codeExamples?.length > 0) {
        exercises.push({
          id: `exercise-${i}`,
          sectionId: section.title,
          title: `Practice: ${section.title}`,
          description: `Try the commands or code examples from this section. Experiment with variations!`,
          tasks: section.codeExamples.map((example, j) => ({
            id: `${i}-task-${j}`,
            command: example.command,
            description: example.description,
            expectedOutput: null // User defines their own
          }))
        });
      }
    }
    
    return exercises;
  }

  /**
   * Generate navigation structure
   */
  generateNavigation(sections) {
    return sections.map((section, index) => ({
      id: `${index + 1}`,
      title: section.title,
      type: this.determineSectionType(section),
      isFirst: index === 0,
      isLast: index === sections.length - 1,
      previous: index > 0 ? `${index}` : null,
      next: index < sections.length - 1 ? `${index + 2}` : null
    }));
  }

  /**
   * Generate learning resources
   */
  generateResources(topicTitle) {
    const baseResources = [
      {
        type: 'documentation',
        title: 'Official Documentation',
        url: '#'
      },
      {
        type: 'video',
        title: 'Video Tutorial',
        url: '#'
      },
      {
        type: 'practice',
        title: 'Practice Exercises',
        url: '#'
      }
    ];
    
    // Topic-specific resources could be added here
    return baseResources;
  }

  /**
   * Find similar topic using fuzzy matching
   */
  findSimilarTopic(query) {
    const queryLower = query.toLowerCase();
    
    for (const [key, topic] of Object.entries(this.topics)) {
      if (key.includes(queryLower) || topic.title.toLowerCase().includes(queryLower)) {
        return key;
      }
    }
    
    return null;
  }

  /**
   * Get all available topics
   */
  getTopics() {
    return Object.entries(this.topics).map(([key, topic]) => ({
      id: key,
      title: topic.title,
      description: topic.description,
      difficulty: topic.difficulty,
      sections: topic.sections.length
    }));
  }

  /**
   * Get topics by difficulty
   */
  getTopicsByDifficulty(difficulty) {
    return this.getTopics().filter(t => t.difficulty === difficulty);
  }

  /**
   * Export tutorial in different formats
   */
  async export(tutorial, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(tutorial, null, 2);
      case 'markdown':
        return this.exportMarkdown(tutorial);
      case 'html':
        return this.exportHTML(tutorial);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export tutorial as Markdown
   */
  exportMarkdown(tutorial) {
    let md = `# ${tutorial.metadata.title}\n\n`;
    md += `${tutorial.metadata.description}\n\n`;
    md += `**Difficulty**: ${tutorial.metadata.difficultyInfo.name}\n`;
    md += `**Estimated Time**: ${tutorial.metadata.estimatedTime}\n\n`;
    
    if (tutorial.metadata.prerequisites.length > 0) {
      md += `**Prerequisites**: ${tutorial.metadata.prerequisites.join(', ')}\n\n`;
    }

    for (const section of tutorial.sections) {
      md += `\n## ${section.id}. ${section.title}\n\n`;
      md += `${section.content}\n\n`;
      
      if (section.steps?.length > 0) {
        md += `### Steps\n`;
        section.steps.forEach((step, i) => {
          md += `${i + 1}. ${step}\n`;
        });
        md += '\n';
      }
      
      if (section.codeExamples?.length > 0) {
        md += `### Code Examples\n`;
        for (const example of section.codeExamples) {
          md += `**${example.description}**\n`;
          md += '```' + (example.language || '') + '\n';
          md += example.command || example.code || '';
          md += '\n```\n\n';
        }
      }
      
      if (section.checklist?.length > 0) {
        md += `### Checklist\n`;
        section.checklist.forEach(item => {
          md += `- [ ] ${item}\n`;
        });
        md += '\n';
      }
    }

    md += `\n---\n*Generated by Onboard Tutorial Builder*\n`;
    
    return md;
  }

  /**
   * Export tutorial as HTML
   */
  exportHTML(tutorial) {
    const markdown = this.exportMarkdown(tutorial);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tutorial.metadata.title} - Tutorial</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #333; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        .metadata { background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .section { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .checklist-item { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="metadata">
        <h1>${tutorial.metadata.title}</h1>
        <p>${tutorial.metadata.description}</p>
        <p><strong>Difficulty:</strong> ${tutorial.metadata.difficultyInfo.name}</p>
        <p><strong>Estimated Time:</strong> ${tutorial.metadata.estimatedTime}</p>
    </div>
    ${tutorial.sections.map(s => `
    <div class="section">
        <h2>${s.id}. ${s.title}</h2>
        <p>${s.content}</p>
        ${s.steps?.length ? '<ol>' + s.steps.map(step => `<li>${step}</li>`).join('') + '</ol>' : ''}
        ${s.codeExamples?.length ? s.codeExamples.map(ex => `<pre><code>${ex.command || ex.code}</code></pre><p><em>${ex.description}</em></p>`).join('') : ''}
    </div>
    `).join('')}
</body>
</html>`;
  }

  /**
   * Add a custom topic
   */
  addTopic(id, topic) {
    this.topics[id] = topic;
  }
}

export default TutorialBuilder;
