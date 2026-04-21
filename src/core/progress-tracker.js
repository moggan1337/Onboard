/**
 * Progress Tracker - Tracks onboarding progress for new developers
 * Monitors tasks completion and provides milestones
 */

import chalk from 'chalk';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Default onboarding phases
 */
const DEFAULT_PHASES = [
  {
    id: 'setup',
    name: 'Environment Setup',
    description: 'Set up your development environment',
    order: 1,
    tasks: [
      { id: 'setup-1', title: 'Install required software', required: true },
      { id: 'setup-2', title: 'Clone repository', required: true },
      { id: 'setup-3', title: 'Install dependencies', required: true },
      { id: 'setup-4', title: 'Configure environment variables', required: true },
      { id: 'setup-5', title: 'Run local development server', required: true },
      { id: 'setup-6', title: 'Run test suite to verify setup', required: false }
    ]
  },
  {
    id: 'orientation',
    name: 'Codebase Orientation',
    description: 'Get familiar with the codebase structure',
    order: 2,
    tasks: [
      { id: 'orient-1', title: 'Read project README', required: true },
      { id: 'orient-2', title: 'Review architecture documentation', required: true },
      { id: 'orient-3', title: 'Explore directory structure', required: true },
      { id: 'orient-4', title: 'Identify key modules', required: true },
      { id: 'orient-5', title: 'Understand deployment process', required: false },
      { id: 'orient-6', title: 'Review coding standards', required: false }
    ]
  },
  {
    id: 'first-task',
    name: 'First Contribution',
    description: 'Make your first code contribution',
    order: 3,
    tasks: [
      { id: 'first-1', title: 'Pick a starter issue', required: true },
      { id: 'first-2', title: 'Create feature branch', required: true },
      { id: 'first-3', title: 'Implement the fix/feature', required: true },
      { id: 'first-4', title: 'Write or update tests', required: true },
      { id: 'first-5', title: 'Submit pull request', required: true },
      { id: 'first-6', title: 'Address review feedback', required: false }
    ]
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    description: 'Gain deeper understanding of specific areas',
    order: 4,
    tasks: [
      { id: 'deep-1', title: 'Pair program with a team member', required: true },
      { id: 'deep-2', title: 'Review code for another task', required: true },
      { id: 'deep-3', title: 'Present your work to the team', required: false },
      { id: 'deep-4', title: 'Document something you learned', required: false }
    ]
  },
  {
    id: 'integration',
    name: 'Team Integration',
    description: 'Become a fully integrated team member',
    order: 5,
    tasks: [
      { id: 'integrate-1', title: 'Attend team standup', required: true },
      { id: 'integrate-2', title: 'Participate in code review', required: true },
      { id: 'integrate-3', title: 'Join team communication channels', required: true },
      { id: 'integrate-4', title: 'Meet with mentor for 1:1', required: true },
      { id: 'integrate-5', title: 'Complete onboarding survey', required: true }
    ]
  }
];

/**
 * Milestone definitions
 */
const MILESTONES = [
  {
    id: 'first-commit',
    name: 'First Commit',
    description: 'Made your first code commit',
    requirement: (progress) => progress.commits >= 1
  },
  {
    id: 'first-pr',
    name: 'First PR',
    description: 'Submitted your first pull request',
    requirement: (progress) => progress.pullRequests >= 1
  },
  {
    id: 'first-review',
    name: 'Code Reviewer',
    description: 'Participated in your first code review',
    requirement: (progress) => progress.reviews >= 1
  },
  {
    id: 'setup-complete',
    name: 'Environment Ready',
    description: 'Completed all setup tasks',
    requirement: (progress) => progress.completedTasks >= 5
  },
  {
    id: 'week-one',
    name: 'Week One',
    description: 'Completed first week of onboarding',
    requirement: (progress) => progress.daysActive >= 7
  },
  {
    id: 'onboarding-complete',
    name: 'Fully Onboarded',
    description: 'Completed all onboarding phases',
    requirement: (progress) => progress.phase === 'integration' && progress.completedTasks >= 15
  }
];

export class ProgressTracker {
  constructor(config = {}) {
    this.config = {
      dataDir: config.dataDir || './.onboard',
      userFile: config.userFile || 'users.json',
      milestonesFile: config.milestonesFile || 'milestones.json',
      ...config
    };
    
    this.phases = config.phases || DEFAULT_PHASES;
    this.milestones = config.milestones || MILESTONES;
    this.data = {
      users: {},
      milestones: {}
    };
  }

  /**
   * Initialize the progress tracker
   */
  async initialize() {
    console.log(chalk.cyan('  📊 Initializing progress tracker...'));
    
    // Ensure data directory exists
    try {
      await mkdir(this.config.dataDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Load existing data
    try {
      const userData = await readFile(
        join(this.config.dataDir, this.config.userFile),
        'utf-8'
      );
      this.data.users = JSON.parse(userData);
    } catch {
      this.data.users = {};
    }

    try {
      const milestoneData = await readFile(
        join(this.config.dataDir, this.config.milestonesFile),
        'utf-8'
      );
      this.data.milestones = JSON.parse(milestoneData);
    } catch {
      this.data.milestones = {};
    }

    return this.data;
  }

  /**
   * Save data to disk
   */
  async save() {
    try {
      await writeFile(
        join(this.config.dataDir, this.config.userFile),
        JSON.stringify(this.data.users, null, 2)
      );
      await writeFile(
        join(this.config.dataDir, this.config.milestonesFile),
        JSON.stringify(this.data.milestones, null, 2)
      );
    } catch (error) {
      console.error('Failed to save progress data:', error.message);
    }
  }

  /**
   * Create or update a user profile
   */
  async createUser(userId, profile = {}) {
    const user = {
      id: userId,
      name: profile.name || userId,
      email: profile.email,
      startDate: profile.startDate || new Date().toISOString(),
      skillLevel: profile.skillLevel || 'beginner',
      interests: profile.interests || [],
      mentor: profile.mentor,
      currentPhase: 'setup',
      completedTasks: [],
      notes: {},
      activity: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.users[userId] = user;
    await this.save();
    
    return user;
  }

  /**
   * Get user progress
   */
  async getProgress(userId) {
    const user = this.data.users[userId];
    if (!user) {
      return null;
    }

    const currentPhase = this.phases.find(p => p.id === user.currentPhase);
    const completedCount = user.completedTasks.length;
    const totalTasks = this.phases.reduce((sum, p) => sum + p.tasks.length, 0);
    
    // Calculate phase progress
    const phaseIndex = this.phases.findIndex(p => p.id === user.currentPhase);
    const previousTasks = this.phases
      .slice(0, phaseIndex)
      .reduce((sum, p) => sum + p.tasks.length, 0);
    const currentPhaseTasks = currentPhase ? currentPhase.tasks.length : 0;
    const currentPhaseCompleted = user.completedTasks.filter(t => 
      currentPhase && currentPhase.tasks.some(ct => ct.id === t)
    ).length;

    // Calculate milestones
    const earnedMilestones = this.checkMilestones(user);

    // Calculate days active
    const startDate = new Date(user.startDate);
    const daysActive = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24));

    return {
      user: {
        id: user.id,
        name: user.name,
        skillLevel: user.skillLevel,
        startDate: user.startDate,
        mentor: user.mentor
      },
      currentPhase: {
        id: currentPhase?.id,
        name: currentPhase?.name,
        description: currentPhase?.description,
        progress: currentPhaseTasks > 0 
          ? Math.round((currentPhaseCompleted / currentPhaseTasks) * 100) 
          : 0,
        completed: currentPhaseCompleted,
        total: currentPhaseTasks
      },
      overall: {
        completed: completedCount,
        total: totalTasks,
        percentage: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
      },
      phases: this.getPhasesProgress(user),
      milestones: earnedMilestones,
      upcomingMilestones: this.getUpcomingMilestones(user),
      stats: {
        daysActive,
        commits: user.activity.filter(a => a.type === 'commit').length,
        pullRequests: user.activity.filter(a => a.type === 'pr').length,
        reviews: user.activity.filter(a => a.type === 'review').length
      },
      activity: user.activity.slice(-10)
    };
  }

  /**
   * Get phases progress for a user
   */
  getPhasesProgress(user) {
    return this.phases.map(phase => {
      const completed = user.completedTasks.filter(t => 
        phase.tasks.some(ct => ct.id === t)
      ).length;
      
      return {
        id: phase.id,
        name: phase.name,
        description: phase.description,
        order: phase.order,
        completed,
        total: phase.tasks.length,
        percentage: phase.tasks.length > 0 
          ? Math.round((completed / phase.tasks.length) * 100) 
          : 0,
        isCurrent: phase.id === user.currentPhase,
        isCompleted: completed === phase.tasks.length
      };
    }).sort((a, b) => a.order - b.order);
  }

  /**
   * Mark a task as complete
   */
  async completeTask(userId, taskId) {
    const user = this.data.users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Find which phase contains this task
    for (const phase of this.phases) {
      const task = phase.tasks.find(t => t.id === taskId);
      if (task) {
        if (!user.completedTasks.includes(taskId)) {
          user.completedTasks.push(taskId);
          user.activity.push({
            type: 'task_completed',
            taskId,
            taskTitle: task.title,
            phase: phase.name,
            timestamp: new Date().toISOString()
          });

          // Check if phase is complete
          const phaseTasksCompleted = user.completedTasks.filter(t =>
            phase.tasks.some(pt => pt.id === t)
          ).length;
          
          if (phaseTasksCompleted === phase.tasks.length) {
            // Move to next phase
            const currentIndex = this.phases.findIndex(p => p.id === phase.id);
            if (currentIndex < this.phases.length - 1) {
              user.currentPhase = this.phases[currentIndex + 1].id;
              user.activity.push({
                type: 'phase_completed',
                phase: phase.name,
                newPhase: this.phases[currentIndex + 1].name,
                timestamp: new Date().toISOString()
              });
            }
          }

          user.updatedAt = new Date().toISOString();
          await this.save();
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Record activity
   */
  async recordActivity(userId, activity) {
    const user = this.data.users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    user.activity.push({
      ...activity,
      timestamp: new Date().toISOString()
    });
    user.updatedAt = new Date().toISOString();
    
    await this.save();
  }

  /**
   * Check which milestones have been earned
   */
  checkMilestones(user) {
    const progress = {
      commits: user.activity.filter(a => a.type === 'commit').length,
      pullRequests: user.activity.filter(a => a.type === 'pr').length,
      reviews: user.activity.filter(a => a.type === 'review').length,
      completedTasks: user.completedTasks.length,
      phase: user.currentPhase,
      daysActive: Math.floor((Date.now() - new Date(user.startDate)) / (1000 * 60 * 60 * 24))
    };

    const earned = [];
    for (const milestone of this.milestones) {
      if (this.data.milestones[user.id]?.includes(milestone.id)) {
        earned.push({
          ...milestone,
          earnedAt: this.data.milestones[user.id][milestone.id]
        });
      } else if (milestone.requirement(progress)) {
        if (!this.data.milestones[user.id]) {
          this.data.milestones[user.id] = {};
        }
        this.data.milestones[user.id][milestone.id] = new Date().toISOString();
        earned.push({
          ...milestone,
          earnedAt: new Date().toISOString()
        });
      }
    }

    return earned;
  }

  /**
   * Get upcoming milestones
   */
  getUpcomingMilestones(user) {
    const earnedIds = this.data.milestones[user.id] 
      ? Object.keys(this.data.milestones[user.id]) 
      : [];

    return this.milestones
      .filter(m => !earnedIds.includes(m.id))
      .map(m => ({
        id: m.id,
        name: m.name,
        description: m.description
      }));
  }

  /**
   * Get task suggestions for current phase
   */
  async getTaskSuggestions(userId) {
    const user = this.data.users[userId];
    if (!user) {
      return [];
    }

    const currentPhase = this.phases.find(p => p.id === user.currentPhase);
    if (!currentPhase) {
      return [];
    }

    const completedTaskIds = user.completedTasks;
    return currentPhase.tasks
      .filter(t => !completedTaskIds.includes(t.id))
      .sort((a, b) => {
        // Required tasks first
        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;
        return 0;
      });
  }

  /**
   * Add a note to user profile
   */
  async addNote(userId, key, value) {
    const user = this.data.users[userId];
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    user.notes[key] = value;
    user.updatedAt = new Date().toISOString();
    await this.save();
  }

  /**
   * Get all users summary
   */
  async getAllUsersSummary() {
    const summaries = [];
    
    for (const [userId, user] of Object.entries(this.data.users)) {
      const progress = await this.getProgress(userId);
      summaries.push({
        id: userId,
        name: user.name,
        currentPhase: progress.currentPhase.name,
        overallProgress: progress.overall.percentage,
        daysActive: progress.stats.daysActive,
        milestonesEarned: progress.milestones.length
      });
    }

    return summaries;
  }

  /**
   * Export progress report
   */
  async exportReport(userId, format = 'json') {
    const progress = await this.getProgress(userId);
    if (!progress) {
      throw new Error(`User not found: ${userId}`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(progress, null, 2);
      case 'markdown':
        return this.exportMarkdown(progress);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export progress as Markdown
   */
  exportMarkdown(progress) {
    let md = `# Onboarding Progress Report\n\n`;
    md += `## ${progress.user.name}\n\n`;
    md += `- **Started**: ${new Date(progress.user.startDate).toLocaleDateString()}\n`;
    md += `- **Skill Level**: ${progress.user.skillLevel}\n`;
    md += `- **Current Phase**: ${progress.currentPhase.name}\n`;
    md += `- **Overall Progress**: ${progress.overall.percentage}%\n\n`;

    md += `### Phases Progress\n\n`;
    for (const phase of progress.phases) {
      const status = phase.isCompleted ? '✅' : phase.isCurrent ? '🔄' : '⬜';
      md += `${status} **${phase.name}**: ${phase.completed}/${phase.total} tasks (${phase.percentage}%)\n`;
    }

    md += `\n### Milestones\n\n`;
    for (const milestone of progress.milestones) {
      md += `🏆 **${milestone.name}** - ${milestone.description}\n`;
      md += `   Earned: ${new Date(milestone.earnedAt).toLocaleDateString()}\n\n`;
    }

    if (progress.upcomingMilestones.length > 0) {
      md += `\n### Upcoming Milestones\n\n`;
      for (const milestone of progress.upcomingMilestones) {
        md += `🔒 **${milestone.name}** - ${milestone.description}\n`;
      }
    }

    md += `\n### Statistics\n\n`;
    md += `- **Days Active**: ${progress.stats.daysActive}\n`;
    md += `- **Commits**: ${progress.stats.commits}\n`;
    md += `- **Pull Requests**: ${progress.stats.pullRequests}\n`;
    md += `- **Code Reviews**: ${progress.stats.reviews}\n`;

    return md;
  }

  /**
   * Get all phases
   */
  getAllPhases() {
    return this.phases;
  }

  /**
   * Get all milestones
   */
  getAllMilestones() {
    return this.milestones;
  }
}

export default ProgressTracker;
