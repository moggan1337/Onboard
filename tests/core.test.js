/**
 * Onboard - Test Suite
 */

import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import { KnowledgeExtractor } from '../src/core/knowledge-extractor.js';
import { QABot } from '../src/core/qa-bot.js';
import { TaskSuggester } from '../src/core/task-suggester.js';
import { TeamMapper } from '../src/core/team-mapper.js';
import { ProgressTracker } from '../src/core/progress-tracker.js';
import { TutorialBuilder } from '../src/core/tutorial-builder.js';
import { PRReviewExplainer } from '../src/core/pr-review-explainer.js';
import { 
  formatBytes, 
  formatDuration, 
  truncate, 
  deepClone,
  isEmpty,
  percentage,
  pluralize 
} from '../src/utils/logger.js';

describe('Utility Functions', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      assert.strictEqual(formatBytes(0), '0 Bytes');
    });

    it('should format bytes correctly', () => {
      assert.strictEqual(formatBytes(1024), '1 KB');
      assert.strictEqual(formatBytes(1048576), '1 MB');
      assert.strictEqual(formatBytes(1073741824), '1 GB');
    });

    it('should handle decimal values', () => {
      const result = formatBytes(1536);
      assert.ok(result.includes('KB'));
    });
  });

  describe('formatDuration', () => {
    it('should format milliseconds', () => {
      assert.strictEqual(formatDuration(500), '1s');
    });

    it('should format seconds', () => {
      assert.strictEqual(formatDuration(5000), '5s');
    });

    it('should format minutes', () => {
      assert.strictEqual(formatDuration(120000), '2m 0s');
    });

    it('should format hours', () => {
      assert.strictEqual(formatDuration(3600000), '1h 0m');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      assert.strictEqual(truncate('hello', 10), 'hello');
    });

    it('should truncate long strings', () => {
      assert.strictEqual(truncate('hello world', 8), 'hello...');
    });
  });

  describe('deepClone', () => {
    it('should create a deep copy', () => {
      const original = { a: 1, b: { c: 2 } };
      const clone = deepClone(original);
      clone.b.c = 3;
      assert.strictEqual(original.b.c, 2);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      assert.strictEqual(isEmpty(null), true);
      assert.strictEqual(isEmpty(undefined), true);
      assert.strictEqual(isEmpty(''), true);
      assert.strictEqual(isEmpty([]), true);
      assert.strictEqual(isEmpty({}), true);
    });

    it('should detect non-empty values', () => {
      assert.strictEqual(isEmpty('hello'), false);
      assert.strictEqual(isEmpty([1]), false);
      assert.strictEqual(isEmpty({ a: 1 }), false);
    });
  });

  describe('percentage', () => {
    it('should calculate percentages', () => {
      assert.strictEqual(percentage(50, 100), 50);
      assert.strictEqual(percentage(1, 3), 33);
    });

    it('should handle zero total', () => {
      assert.strictEqual(percentage(5, 0), 0);
    });
  });

  describe('pluralize', () => {
    it('should singularize for one', () => {
      assert.strictEqual(pluralize(1, 'task'), 'task');
    });

    it('should pluralize for more than one', () => {
      assert.strictEqual(pluralize(2, 'task'), 'tasks');
    });

    it('should use custom plural', () => {
      assert.strictEqual(pluralize(2, 'category', 'categories'), 'categories');
    });
  });
});

describe('KnowledgeExtractor', () => {
  let extractor;

  beforeEach(() => {
    extractor = new KnowledgeExtractor({
      projectPath: './test-project'
    });
  });

  describe('constructor', () => {
    it('should create instance with config', () => {
      assert.ok(extractor instanceof KnowledgeExtractor);
      assert.strictEqual(extractor.config.projectPath, './test-project');
    });

    it('should have default exclude patterns', () => {
      assert.ok(Array.isArray(extractor.config.excludePatterns));
      assert.ok(extractor.config.excludePatterns.includes('node_modules/**'));
    });
  });

  describe('detectPrimaryLanguage', () => {
    it('should detect TypeScript', () => {
      const files = ['/path/to/file.ts', '/path/to/file.tsx'];
      const lang = extractor.detectPrimaryLanguage(files);
      assert.strictEqual(lang, 'typescript');
    });

    it('should detect JavaScript', () => {
      const files = ['/path/to/file.js', '/path/to/file.jsx'];
      const lang = extractor.detectPrimaryLanguage(files);
      assert.strictEqual(lang, 'javascript');
    });

    it('should handle empty files', () => {
      const lang = extractor.detectPrimaryLanguage([]);
      assert.strictEqual(lang, 'unknown');
    });
  });

  describe('categorizeEntity', () => {
    it('should categorize controllers', () => {
      const entity = { name: 'UserController', file: 'controllers/user.ts' };
      const category = extractor.categorizeEntity(entity);
      assert.strictEqual(category, 'controllers');
    });

    it('should categorize services', () => {
      const entity = { name: 'UserService', file: 'services/user.ts' };
      const category = extractor.categorizeEntity(entity);
      assert.strictEqual(category, 'services');
    });

    it('should categorize utils', () => {
      const entity = { name: 'formatDate', file: 'utils/date.ts' };
      const category = extractor.categorizeEntity(entity);
      assert.strictEqual(category, 'utils');
    });
  });
});

describe('TaskSuggester', () => {
  let suggester;

  before(() => {
    suggester = new TaskSuggester();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      assert.ok(suggester instanceof TaskSuggester);
    });
  });

  describe('suggest', () => {
    it('should suggest tasks for beginners', () => {
      const tasks = suggester.suggest('beginner');
      assert.ok(Array.isArray(tasks));
      assert.ok(tasks.length > 0);
      assert.ok(tasks.length <= 10);
    });

    it('should suggest tasks for intermediates', () => {
      const tasks = suggester.suggest('intermediate');
      assert.ok(Array.isArray(tasks));
    });

    it('should suggest tasks for advanced', () => {
      const tasks = suggester.suggest('advanced');
      assert.ok(Array.isArray(tasks));
    });

    it('should filter by interests', () => {
      const tasks = suggester.suggest('beginner', ['frontend']);
      assert.ok(Array.isArray(tasks));
    });

    it('should include task metadata', () => {
      const tasks = suggester.suggest('beginner');
      const task = tasks[0];
      assert.ok(task.title);
      assert.ok(task.description);
      assert.ok(typeof task.complexity === 'number');
      assert.ok(task.estimatedTime);
      assert.ok(task.priority);
    });
  });

  describe('getSkillLevelInfo', () => {
    it('should return skill level info', () => {
      const info = suggester.getSkillLevelInfo('beginner');
      assert.strictEqual(info.name, 'Beginner');
    });
  });

  describe('getAvailableInterests', () => {
    it('should return interests array', () => {
      const interests = suggester.getAvailableInterests();
      assert.ok(Array.isArray(interests));
      assert.ok(interests.includes('frontend'));
      assert.ok(interests.includes('backend'));
    });
  });
});

describe('TeamMapper', () => {
  let mapper;

  before(async () => {
    mapper = new TeamMapper({ teamFile: './nonexistent.json' });
  });

  describe('constructor', () => {
    it('should create instance', () => {
      assert.ok(mapper instanceof TeamMapper);
    });
  });

  describe('getStructure', () => {
    it('should return team structure', async () => {
      const structure = await mapper.getStructure();
      assert.ok(structure.departments);
      assert.ok(Array.isArray(structure.departments));
      assert.ok(structure.departments.length > 0);
    });
  });

  describe('findByExpertise', () => {
    it('should find members by expertise', async () => {
      const members = await mapper.findByExpertise('frontend');
      assert.ok(Array.isArray(members));
    });
  });

  describe('getMember', () => {
    it('should return null for nonexistent member', async () => {
      const member = await mapper.getMember('nonexistent');
      assert.strictEqual(member, null);
    });
  });

  describe('getStatistics', () => {
    it('should return team statistics', async () => {
      const stats = await mapper.getStatistics();
      assert.ok(typeof stats.totalMembers === 'number');
      assert.ok(stats.byDepartment);
      assert.ok(stats.byExpertise);
    });
  });

  describe('getExpertiseCategories', () => {
    it('should return expertise categories', () => {
      const categories = mapper.getExpertiseCategories();
      assert.ok(Array.isArray(categories));
      assert.ok(categories.includes('frontend'));
      assert.ok(categories.includes('backend'));
    });
  });
});

describe('ProgressTracker', () => {
  let tracker;

  before(async () => {
    tracker = new ProgressTracker({ dataDir: './.test-onboard' });
  });

  describe('constructor', () => {
    it('should create instance', () => {
      assert.ok(tracker instanceof ProgressTracker);
    });

    it('should have default phases', () => {
      assert.ok(Array.isArray(tracker.phases));
      assert.ok(tracker.phases.length > 0);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await tracker.createUser('test-user-1', {
        name: 'Test User',
        skillLevel: 'beginner'
      });
      assert.strictEqual(user.id, 'test-user-1');
      assert.strictEqual(user.name, 'Test User');
      assert.strictEqual(user.skillLevel, 'beginner');
    });
  });

  describe('getProgress', () => {
    it('should return null for nonexistent user', async () => {
      const progress = await tracker.getProgress('nonexistent');
      assert.strictEqual(progress, null);
    });

    it('should return progress for existing user', async () => {
      const progress = await tracker.getProgress('test-user-1');
      assert.ok(progress);
      assert.ok(progress.user);
      assert.ok(progress.currentPhase);
      assert.ok(progress.overall);
    });
  });

  describe('completeTask', () => {
    it('should mark task as complete', async () => {
      const result = await tracker.completeTask('test-user-1', 'setup-1');
      assert.strictEqual(result, true);
    });

    it('should throw for nonexistent user', async () => {
      await assert.rejects(
        () => tracker.completeTask('nonexistent', 'task-1'),
        /User not found/
      );
    });
  });

  describe('getAllPhases', () => {
    it('should return all phases', () => {
      const phases = tracker.getAllPhases();
      assert.ok(Array.isArray(phases));
      assert.strictEqual(phases[0].id, 'setup');
    });
  });

  describe('getAllMilestones', () => {
    it('should return all milestones', () => {
      const milestones = tracker.getAllMilestones();
      assert.ok(Array.isArray(milestones));
      assert.ok(milestones.length > 0);
    });
  });
});

describe('TutorialBuilder', () => {
  let builder;

  before(() => {
    builder = new TutorialBuilder();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      assert.ok(builder instanceof TutorialBuilder);
    });
  });

  describe('build', () => {
    it('should build git-basics tutorial', async () => {
      const tutorial = await builder.build('git-basics', 'beginner');
      assert.ok(tutorial);
      assert.ok(tutorial.metadata);
      assert.ok(tutorial.sections);
      assert.strictEqual(tutorial.metadata.title, 'Git Basics');
    });

    it('should build testing tutorial', async () => {
      const tutorial = await builder.build('testing-basics', 'intermediate');
      assert.ok(tutorial);
      assert.strictEqual(tutorial.metadata.difficulty, 'intermediate');
    });

    it('should throw for unknown topic', async () => {
      await assert.rejects(
        () => builder.build('unknown-topic', 'beginner'),
        /Topic not found/
      );
    });
  });

  describe('getTopics', () => {
    it('should return available topics', () => {
      const topics = builder.getTopics();
      assert.ok(Array.isArray(topics));
      assert.ok(topics.length > 0);
      assert.ok(topics.some(t => t.id === 'git-basics'));
    });
  });

  describe('export', () => {
    it('should export as markdown', async () => {
      const tutorial = await builder.build('debugging', 'beginner');
      const markdown = await builder.export(tutorial, 'markdown');
      assert.ok(typeof markdown === 'string');
      assert.ok(markdown.includes('# Debugging'));
    });

    it('should export as json', async () => {
      const tutorial = await builder.build('debugging', 'beginner');
      const json = await builder.export(tutorial, 'json');
      const parsed = JSON.parse(json);
      assert.ok(parsed.metadata);
    });
  });
});

describe('PRReviewExplainer', () => {
  let explainer;

  before(() => {
    explainer = new PRReviewExplainer();
  });

  describe('constructor', () => {
    it('should create instance', () => {
      assert.ok(explainer instanceof PRReviewExplainer);
    });
  });

  describe('explain', () => {
    it('should explain review comments', async () => {
      const prData = { totalComments: 2, resolvedComments: 0 };
      const comments = [
        {
          id: '1',
          author: 'reviewer1',
          body: 'Please fix the style issue with indentation.',
          category: 'style'
        },
        {
          id: '2',
          author: 'reviewer2',
          body: 'This is a security concern - please sanitize input.',
          category: 'security'
        }
      ];

      const result = await explainer.explain(prData, comments);
      assert.ok(result);
      assert.ok(result.explanations);
      assert.strictEqual(result.explanations.length, 2);
      assert.ok(result.summary);
    });
  });

  describe('categorizeComment', () => {
    it('should categorize style comments', () => {
      const category = explainer.categorizeComment({ body: 'Please fix the indentation' });
      assert.strictEqual(category, 'style');
    });

    it('should categorize security comments', () => {
      const category = explainer.categorizeComment({ body: 'This is a security vulnerability' });
      assert.strictEqual(category, 'security');
    });
  });

  describe('isBlocking', () => {
    it('should identify blocking comments', () => {
      assert.strictEqual(
        explainer.isBlocking({ body: 'This is blocking - please fix' }),
        true
      );
    });

    it('should identify non-blocking comments', () => {
      assert.strictEqual(
        explainer.isBlocking({ body: 'Optional nitpick' }),
        false
      );
    });
  });
});

// Run integration tests if test project exists
describe('Integration Tests', () => {
  it('should export markdown correctly', async () => {
    const builder = new TutorialBuilder();
    const tutorial = await builder.build('git-basics', 'beginner');
    const markdown = await builder.export(tutorial, 'markdown');
    
    // Verify markdown structure
    assert.ok(markdown.startsWith('# Git Basics'));
    assert.ok(markdown.includes('##'));
  });
});
