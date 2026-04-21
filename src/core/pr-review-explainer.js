/**
 * PR Review Explainer - Explains PR review comments in plain language
 * Helps new developers understand code review feedback
 */

import chalk from 'chalk';
import { diffLines } from 'diff';

/**
 * Comment category patterns
 */
const COMMENT_PATTERNS = {
  style: {
    keywords: ['style', 'formatting', 'indentation', 'whitespace', 'naming', 'convention'],
    explanation: 'This comment refers to code style and formatting conventions.',
    suggestion: 'Review the project\'s style guide and adjust your code accordingly.'
  },
  logic: {
    keywords: ['logic', 'bug', 'error', 'incorrect', 'wrong', 'issue', 'problem'],
    explanation: 'This comment identifies a potential issue with the code\'s logic or behavior.',
    suggestion: 'Review the logic carefully and consider the reviewer\'s suggestion.'
  },
  performance: {
    keywords: ['performance', 'slow', 'efficient', 'optimize', 'memory', 'cache'],
    explanation: 'This comment relates to code performance or efficiency.',
    suggestion: 'Consider the performance implications and explore optimization opportunities.'
  },
  security: {
    keywords: ['security', 'vulnerability', 'injection', 'xss', 'csrf', 'sanitize'],
    explanation: 'This comment flags a potential security concern.',
    suggestion: 'Prioritize addressing security issues. Consult security best practices.'
  },
  testing: {
    keywords: ['test', 'coverage', 'spec', 'case', 'mock', 'assertion'],
    explanation: 'This comment relates to testing requirements or quality.',
    suggestion: 'Ensure adequate test coverage for the changes you\'re making.'
  },
  documentation: {
    keywords: ['docs', 'comment', 'readme', 'documentation', 'explain', 'clarify'],
    explanation: 'This comment requests documentation improvements.',
    suggestion: 'Add or improve documentation to help others understand the code.'
  },
  design: {
    keywords: ['design', 'architecture', 'pattern', 'structure', 'refactor', 'coupling'],
    explanation: 'This comment relates to code architecture or design patterns.',
    suggestion: 'Consider if a design change would improve code maintainability.'
  },
  complexity: {
    keywords: ['complex', 'simple', 'readable', 'understand', 'confusing', 'split'],
    explanation: 'This comment suggests simplifying complex code.',
    suggestion: 'Break down complex code into smaller, more readable pieces.'
  },
  bestPractice: {
    keywords: ['best practice', 'recommended', 'should', 'prefer', 'consider'],
    explanation: 'This comment suggests following language or framework best practices.',
    suggestion: 'Review the recommended approach and consider adopting it.'
  }
};

/**
 * Common review phrases and their meanings
 */
const PHRASE_EXPLANATIONS = {
  'nit:': 'A minor suggestion - feel free to ignore if you disagree',
  'nitpick:': 'A very minor suggestion - optional to address',
  'sgtm:': 'Sounds good to me - the reviewer approves',
  'lgtm:': 'Looks good to me - approved for merging',
  'wip:': 'Work in progress - not ready for final review',
  'imo:': 'In my opinion - reviewer\'s personal preference',
  'imho:': 'In my humble opinion - reviewer\'s personal view',
  'typo:': 'Typographical error - please fix the spelling',
  'ty':': 'Thank you - positive acknowledgment',
  'nits:': 'Multiple small suggestions - optional to address',
  'Blocking:': 'Must be addressed before approval',
  'Non-blocking:': 'Optional suggestion - doesn\'t block approval',
  'Optional:': 'Suggestion you can choose to implement or not',
  'Required:': 'Must be addressed before merging'
};

/**
 * Common abbreviations in code reviews
 */
const ABBREVIATIONS = {
  'PR': 'Pull Request',
  'MR': 'Merge Request',
  'LGTM': 'Looks Good To Me (approved)',
  'IMO': 'In My Opinion',
  'IMHO': 'In My Humble Opinion',
  'IMO/IMHO': 'Personal opinion - not a blocker',
  'NIT': 'A minor issue (Latin for "nitpick")',
  'WIP': 'Work In Progress',
  'LGTM': 'Looks Good To Me - approved',
  'SGTM': 'Sounds Good To Me - agreed',
  'PTAL': 'Please Take Another Look',
  'TIL': 'Today I Learned (often used when learning something new)',
  'IDK': 'I Don\'t Know',
  'WDYT': 'What Do You Think?',
  'TL;DR': 'Too Long; Didn\'t Read - summary of long content',
  'ETA': 'Estimated Time of Arrival (or completion)',
  'RFC': 'Request For Comments',
  'SOP': 'Standard Operating Procedure',
  'MVP': 'Minimum Viable Product',
  'OOO': 'Out Of Office',
  'EOD': 'End Of Day',
  'EOW': 'End Of Week',
  'EOM': 'End Of Month',
  'P0/P1/P2': 'Priority levels (P0 = highest)',
  'AK': 'Also Known As',
  'ACK': 'Acknowledged',
  'NAK': 'Negative Acknowledgment',
  'TBD': 'To Be Determined',
  'TBI': 'To Be Implemented',
  'TBS': 'To Be Specified',
  'WRT': 'With Respect To',
  'FYI': 'For Your Information',
  'AFAIK': 'As Far As I Know',
  'IIRC': 'If I Recall Correctly',
  'TIL': 'Today I Learned',
  'LGTM!': 'Looks Good To Me - approved for merge'
};

export class PRReviewExplainer {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Explain PR review comments in plain language
   */
  async explain(prData, reviewComments) {
    console.log(chalk.cyan('  📋 Analyzing PR review...'));

    const explanations = [];
    
    for (const comment of reviewComments) {
      const explanation = this.explainComment(comment);
      explanations.push(explanation);
    }

    // Generate summary
    const summary = this.generateSummary(explanations);

    return {
      explanations,
      summary,
      actionItems: this.extractActionItems(explanations),
      blocking: this.identifyBlockingIssues(explanations),
      optional: this.identifyOptionalSuggestions(explanations),
      progress: this.calculateProgress(prData)
    };
  }

  /**
   * Explain a single comment
   */
  explainComment(comment) {
    const category = this.categorizeComment(comment);
    const phraseExplanations = this.explainPhrases(comment.body);
    const codeContext = this.explainCodeChange(comment);
    
    return {
      id: comment.id,
      author: comment.author,
      category,
      original: comment.body,
      simplified: this.simplifyLanguage(comment.body),
      explanation: COMMENT_PATTERNS[category].explanation,
      suggestion: COMMENT_PATTERNS[category].suggestion,
      phraseExplanations,
      codeContext,
      isBlocking: this.isBlocking(comment),
      priority: this.determinePriority(comment, category)
    };
  }

  /**
   * Categorize a comment based on keywords
   */
  categorizeComment(comment) {
    const body = comment.body.toLowerCase();
    
    for (const [category, config] of Object.entries(COMMENT_PATTERNS)) {
      for (const keyword of config.keywords) {
        if (body.includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'bestPractice'; // Default category
  }

  /**
   * Simplify review language
   */
  simplifyLanguage(text) {
    let simplified = text;
    
    // Replace abbreviations
    for (const [abbr, full] of Object.entries(ABBREVIATIONS)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      simplified = simplified.replace(regex, full);
    }
    
    // Replace complex phrases
    const phraseReplacements = {
      'could you please': 'Please',
      'would you mind': 'Please consider',
      'might want to': 'Consider',
      'should probably': 'Should',
      'it would be great if': 'Please',
      'have you considered': 'Consider',
      'in order to': 'to',
      'due to the fact that': 'because',
      'at this point in time': 'now',
      'in the event that': 'if',
      'for the purpose of': 'to'
    };
    
    for (const [complex, simple] of Object.entries(phraseReplacements)) {
      simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
    }
    
    return simplified;
  }

  /**
   * Explain common review phrases
   */
  explainPhrases(text) {
    const explanations = [];
    const lowerText = text.toLowerCase();
    
    for (const [phrase, meaning] of Object.entries(PHRASE_EXPLANATIONS)) {
      if (lowerText.includes(phrase.toLowerCase())) {
        explanations.push({
          phrase,
          meaning,
          action: this.getPhraseAction(phrase)
        });
      }
    }
    
    return explanations;
  }

  /**
   * Get action for a phrase
   */
  getPhraseAction(phrase) {
    const actions = {
      'nit:': 'Optional: Address if easy, ignore if not',
      'nitpick:': 'Optional: Very minor, address if you agree',
      'lgtm:': 'No action needed: Approved!',
      'sgtm:': 'No action needed: Agreed!',
      'wip:': 'Action needed: Finish the work before review',
      'imo:': 'No action needed: Reviewer\'s personal opinion',
      'imho:': 'No action needed: Reviewer\'s personal view',
      'typo:': 'Action needed: Fix the spelling error',
      'ty:': 'No action needed: Positive acknowledgment',
      'nits:': 'Optional: Multiple small suggestions',
      'Blocking:': 'Action required: Must address before merge',
      'Non-blocking:': 'Optional: Does not prevent merge',
      'Optional:': 'Optional: Your choice to implement',
      'Required:': 'Action required: Must address before merge'
    };
    
    return actions[phrase] || 'Review the comment and decide';
  }

  /**
   * Explain code change context
   */
  explainCodeChange(comment) {
    if (!comment.diff) return null;
    
    const lines = comment.diff.split('\n');
    const explanations = [];
    
    for (const line of lines) {
      if (line.startsWith('+')) {
        explanations.push({
          type: 'added',
          content: line.substring(1),
          explanation: 'This line was added'
        });
      } else if (line.startsWith('-')) {
        explanations.push({
          type: 'removed',
          content: line.substring(1),
          explanation: 'This line was removed'
        });
      }
    }
    
    return explanations;
  }

  /**
   * Determine if a comment is blocking
   */
  isBlocking(comment) {
    const body = comment.body.toLowerCase();
    const blockingKeywords = ['blocking', 'required', 'must', 'important', 'critical'];
    const nonBlockingKeywords = ['optional', 'nit', 'nice to have', 'consider'];
    
    for (const keyword of blockingKeywords) {
      if (body.includes(keyword)) return true;
    }
    
    for (const keyword of nonBlockingKeywords) {
      if (body.includes(keyword)) return false;
    }
    
    // Default based on category
    return ['security', 'logic', 'bug'].includes(this.categorizeComment(comment));
  }

  /**
   * Determine comment priority
   */
  determinePriority(comment, category) {
    const priorities = {
      security: 'critical',
      logic: 'high',
      performance: 'high',
      testing: 'medium',
      style: 'low',
      documentation: 'low',
      design: 'medium',
      complexity: 'medium',
      bestPractice: 'low'
    };
    
    // Check for explicit priority markers
    const body = comment.body.toLowerCase();
    if (body.includes('critical') || body.includes('blocking')) return 'critical';
    if (body.includes('important')) return 'high';
    if (body.includes('optional') || body.includes('nit')) return 'low';
    
    return priorities[category] || 'medium';
  }

  /**
   * Generate summary of all comments
   */
  generateSummary(explanations) {
    const categories = {};
    const priorities = {};
    const blockers = explanations.filter(e => e.isBlocking).length;
    
    for (const exp of explanations) {
      categories[exp.category] = (categories[exp.category] || 0) + 1;
      priorities[exp.priority] = (priorities[exp.priority] || 0) + 1;
    }
    
    const total = explanations.length;
    const critical = priorities.critical || 0;
    const high = priorities.high || 0;
    const medium = priorities.medium || 0;
    const low = priorities.low || 0;
    
    let overallMessage = '';
    if (critical > 0) {
      overallMessage = `${critical} critical issue${critical > 1 ? 's' : ''} must be addressed before merging.`;
    } else if (high > 0) {
      overallMessage = `${high} important suggestion${high > 1 ? 's' : ''} to address for better code quality.`;
    } else if (medium > 0) {
      overallMessage = `${medium} recommendation${medium > 1 ? 's' : ''} to consider improving the code.`;
    } else {
      overallMessage = 'Mostly minor suggestions. The PR is in good shape!';
    }
    
    return {
      totalComments: total,
      byCategory: categories,
      byPriority: priorities,
      blockingCount: blockers,
      overallMessage,
      progress: blockers === 0 ? 'Ready to merge' : `${blockers} blocking issue${blockers > 1 ? 's' : ''}`
    };
  }

  /**
   * Extract action items from explanations
   */
  extractActionItems(explanations) {
    const items = [];
    
    for (const exp of explanations) {
      if (exp.isBlocking || exp.priority === 'critical' || exp.priority === 'high') {
        items.push({
          comment: exp.simplified,
          action: exp.suggestion,
          category: exp.category,
          priority: exp.priority
        });
      }
    }
    
    return items.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Identify blocking issues
   */
  identifyBlockingIssues(explanations) {
    return explanations
      .filter(e => e.isBlocking)
      .map(e => ({
        comment: e.simplified,
        reason: e.explanation,
        author: e.author
      }));
  }

  /**
   * Identify optional suggestions
   */
  identifyOptionalSuggestions(explanations) {
    return explanations
      .filter(e => !e.isBlocking && (e.priority === 'low' || e.phraseExplanations.some(p => p.phrase.includes('nit'))))
      .map(e => ({
        comment: e.simplified,
        reason: e.explanation
      }));
  }

  /**
   * Calculate review progress
   */
  calculateProgress(prData) {
    const totalComments = prData.totalComments || 0;
    const resolvedComments = prData.resolvedComments || 0;
    
    return {
      total: totalComments,
      resolved: resolvedComments,
      remaining: totalComments - resolvedComments,
      percentage: totalComments > 0 ? Math.round((resolvedComments / totalComments) * 100) : 100,
      status: resolvedComments === totalComments ? 'approved' : 'in_progress'
    };
  }

  /**
   * Explain diff changes
   */
  explainDiff(diff) {
    const changes = diffLines(diff.old, diff.new);
    const explanations = [];
    
    for (const part of changes) {
      const lines = part.value.split('\n').filter(l => l.length > 0);
      
      for (const line of lines) {
        if (part.added) {
          explanations.push({
            type: 'added',
            content: line,
            explanation: 'This line was added to the code'
          });
        } else if (part.removed) {
          explanations.push({
            type: 'removed',
            content: line,
            explanation: 'This line was removed from the code'
          });
        }
      }
    }
    
    return explanations;
  }

  /**
   * Get learning resources for a category
   */
  getLearningResources(category) {
    const resources = {
      style: [
        { title: 'JavaScript Style Guide', url: 'https://github.com/airbnb/javascript' },
        { title: 'Google Style Guides', url: 'https://google.github.io/styleguide/' }
      ],
      logic: [
        { title: 'Debugging Techniques', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/A_first_splash' }
      ],
      security: [
        { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
        { title: 'Secure Coding Practices', url: 'https://securecoding.djangoproject.com/' }
      ],
      testing: [
        { title: 'Testing Best Practices', url: 'https://github.com/goldbergyoni/javascript-testing-best-practices' }
      ],
      performance: [
        { title: 'Web Performance', url: 'https://web.dev/fast/' }
      ]
    };
    
    return resources[category] || [];
  }
}

export default PRReviewExplainer;
