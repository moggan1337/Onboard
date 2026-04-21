/**
 * Q&A Bot - GPT-powered question answering about the codebase
 * Provides intelligent answers based on extracted knowledge
 */

import OpenAI from 'openai';
import { KnowledgeExtractor } from './knowledge-extractor.js';
import chalk from 'chalk';

/**
 * Conversation context for maintaining history
 */
class ConversationContext {
  constructor(maxHistory = 10) {
    this.history = [];
    this.maxHistory = maxHistory;
  }

  add(role, content) {
    this.history.push({ role, content, timestamp: new Date() });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  getHistory() {
    return this.history.map(h => ({
      role: h.role,
      content: h.content
    }));
  }

  clear() {
    this.history = [];
  }
}

/**
 * Answer templates for common question types
 */
const ANSWER_TEMPLATES = {
  'how-to': {
    keywords: ['how', 'howto', 'how to', 'implement', 'create', 'build'],
    format: (answer) => `## How to\n\n${answer}\n\n### Steps\n1. Understand the current architecture\n2. Follow the established patterns\n3. Write tests\n4. Update documentation`
  },
  'explanation': {
    keywords: ['what', 'what is', 'explain', 'describe', 'definition'],
    format: (answer) => `## Explanation\n\n${answer}\n\n### Key Points\n- This component handles specific functionality\n- It follows established patterns in the codebase\n- See related files for more context`
  },
  'location': {
    keywords: ['where', 'file', 'location', 'path'],
    format: (answer) => `## Location\n\n${answer}`
  },
  'api': {
    keywords: ['api', 'endpoint', 'route', 'request', 'response'],
    format: (answer) => `## API Reference\n\n${answer}`
  }
};

export class QABot {
  constructor(config = {}) {
    this.config = {
      openaiApiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
      model: config.model || 'gpt-4-turbo-preview',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000,
      ...config
    };

    this.openai = this.config.openaiApiKey 
      ? new OpenAI({ apiKey: this.config.openaiApiKey })
      : null;
    
    this.knowledgeExtractor = new KnowledgeExtractor(config);
    this.conversations = new Map();
  }

  /**
   * Get or create a conversation context
   */
  getContext(conversationId = 'default') {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, new ConversationContext());
    }
    return this.conversations.get(conversationId);
  }

  /**
   * Ask a question about the codebase
   */
  async ask(question, context = {}) {
    const conversationId = context.conversationId || 'default';
    const conversation = this.getContext(conversationId);

    console.log(chalk.cyan('  💭 Processing question...'));

    try {
      // Extract relevant knowledge
      const knowledge = await this.knowledgeExtractor.extract();
      
      // Detect question type
      const questionType = this.detectQuestionType(question);
      
      // Build context for the model
      const contextPrompt = this.buildContextPrompt(knowledge, question, questionType);
      
      // Get answer from OpenAI or use fallback
      let answer;
      if (this.openai) {
        answer = await this.getOpenAIAnswer(conversation, contextPrompt, question);
      } else {
        answer = this.getFallbackAnswer(question, knowledge, questionType);
      }

      // Add to conversation history
      conversation.add('user', question);
      conversation.add('assistant', answer);

      return this.formatAnswer(answer, questionType);
    } catch (error) {
      console.error(chalk.red('  ❌ Error answering question:'), error.message);
      return this.getErrorResponse(question);
    }
  }

  /**
   * Detect the type of question being asked
   */
  detectQuestionType(question) {
    const lowerQuestion = question.toLowerCase();
    
    for (const [type, template] of Object.entries(ANSWER_TEMPLATES)) {
      for (const keyword of template.keywords) {
        if (lowerQuestion.includes(keyword)) {
          return type;
        }
      }
    }
    
    return 'general';
  }

  /**
   * Build a context prompt for the AI
   */
  buildContextPrompt(knowledge, question, questionType) {
    const summary = knowledge.summary;
    const patterns = knowledge.patterns.slice(0, 5);
    const keyModules = summary.keyModules.slice(0, 5);

    let context = `You are a helpful coding assistant helping developers understand a codebase.\n\n`;
    context += `Project Summary:\n`;
    context += `- Primary Language: ${summary.byLanguage ? Object.keys(summary.byLanguage)[0] : 'Unknown'}\n`;
    context += `- Total Entities: ${summary.totalEntities}\n`;
    context += `- Total Relationships: ${summary.totalRelationships}\n\n`;

    if (patterns.length > 0) {
      context += `Identified Patterns:\n`;
      patterns.forEach(p => {
        context += `- ${p.type}: ${p.occurrences} occurrences\n`;
      });
      context += '\n';
    }

    if (keyModules.length > 0) {
      context += `Key Modules (by connectivity):\n`;
      keyModules.forEach(m => {
        context += `- ${m.file} (score: ${m.connectivityScore})\n`;
      });
      context += '\n';
    }

    context += `Question Type: ${questionType}\n`;
    context += `User Question: ${question}\n\n`;

    return context;
  }

  /**
   * Get answer from OpenAI
   */
  async getOpenAIAnswer(conversation, contextPrompt, question) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert developer assistant with deep knowledge of software architecture, 
patterns, and best practices. You help developers understand codebases quickly and effectively.
Be concise but thorough. Use code examples when helpful. Format your responses with markdown.`
      },
      {
        role: 'user',
        content: contextPrompt
      },
      ...conversation.getHistory()
    ];

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens
    });

    return response.choices[0].message.content;
  }

  /**
   * Get fallback answer when OpenAI is not available
   */
  getFallbackAnswer(question, knowledge, questionType) {
    const summary = knowledge.summary;
    const questionLower = question.toLowerCase();

    // Try to find relevant entities
    const relevantEntities = knowledge.entities.filter(e =>
      questionLower.includes(e.name.toLowerCase()) ||
      e.name.toLowerCase().includes(questionLower)
    );

    let answer = '';

    if (questionType === 'how-to') {
      answer = `Based on the codebase structure, here's how you might approach this:\n\n`;
      answer += `1. **Understand the existing patterns**: The project uses ${summary.byLanguage ? Object.keys(summary.byLanguage)[0] : 'various languages'}\n`;
      answer += `2. **Identify key modules**: Look at the high-connectivity files identified\n`;
      answer += `3. **Follow established conventions**: Check similar implementations in ${relevantEntities.length > 0 ? relevantEntities[0].file : 'the codebase'}\n`;
      answer += `4. **Implement and test**: Add tests following the project's testing patterns\n`;
    } else if (questionType === 'explanation') {
      answer = `Here's an explanation based on the codebase:\n\n`;
      if (relevantEntities.length > 0) {
        answer += `**${relevantEntities[0].name}** is defined in ${relevantEntities[0].file}\n`;
        answer += `Type: ${relevantEntities[0].type}\n\n`;
      }
      answer += `The codebase contains ${summary.totalEntities} entities organized into logical modules. `;
      answer += `Key patterns identified include: ${knowledge.patterns.map(p => p.type).join(', ') || 'standard coding patterns'}.`;
    } else if (questionType === 'location') {
      if (relevantEntities.length > 0) {
        answer = `The relevant code is located at:\n\n`;
        relevantEntities.forEach(e => {
          answer += `- **${e.name}** → \`${e.file}\` (${e.type})\n`;
        });
      } else {
        answer = `I couldn't find a specific match for your query. The codebase has ${summary.totalEntities} entities across multiple files.`;
      }
    } else {
      answer = `I can help you with this! Here's what I found in the codebase:\n\n`;
      answer += `- **Total entities**: ${summary.totalEntities}\n`;
      answer += `- **Patterns detected**: ${knowledge.patterns.length}\n`;
      answer += `- **Key modules**: ${summary.keyModules.slice(0, 3).map(m => m.file).join(', ')}\n\n`;
      answer += `Could you provide more specific details about what you're looking for?`;
    }

    return answer;
  }

  /**
   * Format the answer based on question type
   */
  formatAnswer(answer, questionType) {
    const template = ANSWER_TEMPLATES[questionType];
    if (template) {
      return template.format(answer);
    }
    return answer;
  }

  /**
   * Get error response
   */
  getErrorResponse(question) {
    return `I couldn't process your question: "${question}"\n\n` +
           `Make sure the project is properly initialized with the 'onboard init' command.\n` +
           `You may also need to set your OPENAI_API_KEY environment variable for full functionality.`;
  }

  /**
   * Get related questions based on current question
   */
  async getRelatedQuestions(question) {
    const suggestions = [
      'How is the project structured?',
      'What are the main components?',
      'How do I add a new feature?',
      'Where are the tests located?',
      'What testing framework is used?'
    ];

    return suggestions;
  }

  /**
   * Search for code related to a query
   */
  async searchCode(query) {
    const knowledge = await this.knowledgeExtractor.extract();
    const results = [];

    const queryLower = query.toLowerCase();
    
    for (const entity of knowledge.entities) {
      if (entity.name.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'entity',
          name: entity.name,
          file: entity.file,
          relevance: this.calculateRelevance(query, entity.name)
        });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  }

  /**
   * Calculate relevance score
   */
  calculateRelevance(query, target) {
    const queryLower = query.toLowerCase();
    const targetLower = target.toLowerCase();
    
    if (targetLower === queryLower) return 100;
    if (targetLower.startsWith(queryLower)) return 80;
    if (targetLower.includes(queryLower)) return 60;
    
    // Calculate Levenshtein distance for fuzzy matching
    const distance = this.levenshteinDistance(queryLower, targetLower);
    const maxLen = Math.max(queryLower.length, targetLower.length);
    return Math.max(0, 100 - (distance / maxLen) * 100);
  }

  /**
   * Calculate Levenshtein distance
   */
  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]) + 1;
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Clear conversation history
   */
  clearConversation(conversationId = 'default') {
    if (this.conversations.has(conversationId)) {
      this.conversations.get(conversationId).clear();
    }
  }
}

export default QABot;
