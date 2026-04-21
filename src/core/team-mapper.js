/**
 * Team Mapper - Maps and manages team structure and expertise
 * Helps new developers understand who does what and how to reach them
 */

import chalk from 'chalk';

/**
 * Default team structure template
 */
const DEFAULT_STRUCTURE = {
  departments: [
    {
      name: 'Engineering',
      description: 'Core development team',
      members: []
    },
    {
      name: 'Product',
      description: 'Product management and design',
      members: []
    },
    {
      name: 'DevOps',
      description: 'Infrastructure and operations',
      members: []
    },
    {
      name: 'QA',
      description: 'Quality assurance and testing',
      members: []
    }
  ]
};

/**
 * Expertise categories
 */
const EXPERTISE_CATEGORIES = [
  'frontend',
  'backend',
  'database',
  'devops',
  'security',
  'mobile',
  'testing',
  'performance',
  'architecture',
  'api',
  'ui/ux',
  'data-science',
  'machine-learning',
  'blockchain',
  'cloud',
  'microservices'
];

/**
 * Role types
 */
const ROLE_TYPES = [
  'lead',
  'senior',
  'mid-level',
  'junior',
  'principal',
  'staff',
  'architect',
  'manager',
  'director',
  'vp'
];

export class TeamMapper {
  constructor(config = {}) {
    this.config = {
      teamFile: config.teamFile || './team.json',
      cacheExpiry: config.cacheExpiry || 3600000, // 1 hour
      ...config
    };
    
    this.teamData = null;
    this.cacheTime = null;
  }

  /**
   * Get complete team structure
   */
  async getStructure() {
    if (this.isCacheValid()) {
      return this.teamData;
    }

    console.log(chalk.cyan('  👥 Loading team structure...'));

    // Try to load from file first
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(this.config.teamFile, 'utf-8');
      this.teamData = JSON.parse(data);
    } catch {
      // Use default structure
      this.teamData = this.generateSampleTeam();
    }

    this.cacheTime = Date.now();
    return this.teamData;
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    if (!this.teamData || !this.cacheTime) return false;
    return Date.now() - this.cacheTime < this.config.cacheExpiry;
  }

  /**
   * Generate sample team for demonstration
   */
  generateSampleTeam() {
    return {
      departments: [
        {
          name: 'Engineering',
          description: 'Core development team responsible for building and maintaining the product',
          members: [
            {
              id: 'eng-001',
              name: 'Alex Chen',
              role: 'Engineering Lead',
              email: 'alex.chen@company.com',
              slack: '@alexchen',
              timezone: 'PST',
              expertise: ['architecture', 'backend', 'api'],
              bio: 'Full-stack engineer with 10+ years experience. Loves clean architecture and scalable systems.',
              currentlyWorkingOn: 'API v2 redesign',
              preferredContact: 'slack'
            },
            {
              id: 'eng-002',
              name: 'Sarah Johnson',
              role: 'Senior Frontend Engineer',
              email: 'sarah.johnson@company.com',
              slack: '@sarahj',
              timezone: 'EST',
              expertise: ['frontend', 'ui/ux', 'react'],
              bio: 'Frontend specialist focused on user experience and performance optimization.',
              currentlyWorkingOn: 'Design system implementation',
              preferredContact: 'slack'
            },
            {
              id: 'eng-003',
              name: 'Mike Rodriguez',
              role: 'Backend Engineer',
              email: 'mike.rodriguez@company.com',
              slack: '@miker',
              timezone: 'CST',
              expertise: ['backend', 'database', 'python'],
              bio: 'Backend developer with expertise in data processing and API development.',
              currentlyWorkingOn: 'Database optimization',
              preferredContact: 'email'
            },
            {
              id: 'eng-004',
              name: 'Emily Wang',
              role: 'Full Stack Developer',
              email: 'emily.wang@company.com',
              slack: '@emilyw',
              timezone: 'PST',
              expertise: ['frontend', 'backend', 'testing'],
              bio: 'Versatile developer who enjoys working across the stack.',
              currentlyWorkingOn: 'Integration testing',
              preferredContact: 'slack'
            }
          ],
          channels: {
            general: '#engineering',
            help: '#eng-help',
            announcements: '#eng-announcements'
          }
        },
        {
          name: 'DevOps',
          description: 'Infrastructure, CI/CD, and operations team',
          members: [
            {
              id: 'devops-001',
              name: 'James Wilson',
              role: 'DevOps Lead',
              email: 'james.wilson@company.com',
              slack: '@jamesw',
              timezone: 'EST',
              expertise: ['devops', 'cloud', 'microservices'],
              bio: 'Infrastructure expert ensuring reliability and scalability.',
              currentlyWorkingOn: 'Kubernetes migration',
              preferredContact: 'slack'
            },
            {
              id: 'devops-002',
              name: 'Lisa Park',
              role: 'SRE Engineer',
              email: 'lisa.park@company.com',
              slack: '@lisap',
              timezone: 'PST',
              expertise: ['devops', 'performance', 'monitoring'],
              bio: 'Site Reliability Engineer focused on system health and incident response.',
              currentlyWorkingOn: 'Monitoring dashboard improvements',
              preferredContact: 'slack'
            }
          ],
          channels: {
            general: '#devops',
            incidents: '#incidents',
            deployments: '#deployments'
          }
        },
        {
          name: 'Product',
          description: 'Product management and design team',
          members: [
            {
              id: 'prod-001',
              name: 'Rachel Green',
              role: 'Product Manager',
              email: 'rachel.green@company.com',
              slack: '@rachelg',
              timezone: 'EST',
              expertise: ['product', 'strategy', 'api'],
              bio: 'Product manager connecting business goals with technical implementation.',
              currentlyWorkingOn: 'Q2 roadmap planning',
              preferredContact: 'slack'
            },
            {
              id: 'prod-002',
              name: 'David Kim',
              role: 'UX Designer',
              email: 'david.kim@company.com',
              slack: '@davidk',
              timezone: 'PST',
              expertise: ['ui/ux', 'frontend', 'design'],
              bio: 'Designer passionate about creating intuitive user experiences.',
              currentlyWorkingOn: 'Onboarding flow redesign',
              preferredContact: 'slack'
            }
          ],
          channels: {
            general: '#product',
            design: '#design',
            feedback: '#product-feedback'
          }
        },
        {
          name: 'QA',
          description: 'Quality assurance and testing team',
          members: [
            {
              id: 'qa-001',
              name: 'Tom Anderson',
              role: 'QA Lead',
              email: 'tom.anderson@company.com',
              slack: '@toma',
              timezone: 'CST',
              expertise: ['testing', 'automation', 'security'],
              bio: 'QA professional ensuring product quality and reliability.',
              currentlyWorkingOn: 'Test automation framework',
              preferredContact: 'email'
            }
          ],
          channels: {
            general: '#qa',
            bugs: '#bug-reports',
            testing: '#qa-testing'
          }
        }
      ],
      metadata: {
        updatedAt: new Date().toISOString(),
        totalMembers: 10,
        timezoneDistribution: this.calculateTimezoneDistribution()
      }
    };
  }

  /**
   * Calculate timezone distribution
   */
  calculateTimezoneDistribution() {
    const distribution = {};
    for (const dept of this.teamData.departments) {
      for (const member of dept.members) {
        const tz = member.timezone;
        distribution[tz] = (distribution[tz] || 0) + 1;
      }
    }
    return distribution;
  }

  /**
   * Find team members by expertise
   */
  async findByExpertise(expertise) {
    const structure = await this.getStructure();
    const results = [];

    for (const dept of structure.departments) {
      for (const member of dept.members) {
        if (member.expertise.some(e => 
          e.toLowerCase().includes(expertise.toLowerCase())
        )) {
          results.push({
            ...member,
            department: dept.name
          });
        }
      }
    }

    return results.sort((a, b) => b.expertise.length - a.expertise.length);
  }

  /**
   * Find the best person to contact for help
   */
  async findMentor(skillLevel, topic) {
    const experts = await this.findByExpertise(topic);
    
    if (experts.length === 0) {
      return null;
    }

    // Filter based on skill level preference
    let preferredRoles;
    if (skillLevel === 'beginner') {
      preferredRoles = ['senior', 'lead', 'principal', 'staff'];
    } else if (skillLevel === 'intermediate') {
      preferredRoles = ['senior', 'mid-level', 'lead'];
    } else {
      preferredRoles = ['architect', 'principal', 'staff', 'senior'];
    }

    const filtered = experts.filter(e => 
      preferredRoles.some(r => e.role.toLowerCase().includes(r))
    );

    return filtered.length > 0 ? filtered[0] : experts[0];
  }

  /**
   * Get department by name
   */
  async getDepartment(departmentName) {
    const structure = await this.getStructure();
    return structure.departments.find(d => 
      d.name.toLowerCase() === departmentName.toLowerCase()
    );
  }

  /**
   * Get member by ID
   */
  async getMember(memberId) {
    const structure = await this.getStructure();

    for (const dept of structure.departments) {
      const member = dept.members.find(m => m.id === memberId);
      if (member) {
        return {
          ...member,
          department: dept.name
        };
      }
    }

    return null;
  }

  /**
   * Get team statistics
   */
  async getStatistics() {
    const structure = await this.getStructure();
    const stats = {
      totalMembers: 0,
      byDepartment: {},
      byExpertise: {},
      byTimezone: {},
      expertiseCoverage: []
    };

    for (const dept of structure.departments) {
      stats.byDepartment[dept.name] = dept.members.length;
      stats.totalMembers += dept.members.length;

      for (const member of dept.members) {
        // Count timezones
        stats.byTimezone[member.timezone] = (stats.byTimezone[member.timezone] || 0) + 1;

        // Count expertise
        for (const exp of member.expertise) {
          stats.byExpertise[exp] = (stats.byExpertise[exp] || 0) + 1;
        }
      }
    }

    // Calculate expertise coverage
    for (const exp of EXPERTISE_CATEGORIES) {
      const experts = await this.findByExpertise(exp);
      stats.expertiseCoverage.push({
        expertise: exp,
        count: experts.length,
        primaryExpert: experts[0]?.name || null
      });
    }

    return stats;
  }

  /**
   * Get org chart visualization
   */
  async getOrgChart() {
    const structure = await this.getStructure();
    let chart = 'Organization Chart\n';
    chart += '==================\n\n';

    for (const dept of structure.departments) {
      chart += `\n${dept.name} (${dept.description})\n`;
      chart += '-'.repeat(50) + '\n';

      for (const member of dept.members) {
        chart += `  📧 ${member.name} - ${member.role}\n`;
        chart += `     Expertise: ${member.expertise.join(', ')}\n`;
        chart += `     Contact: ${member.preferredContact === 'slack' ? member.slack : member.email}\n`;
      }

      if (dept.channels) {
        chart += `\n  Channels:\n`;
        for (const [name, channel] of Object.entries(dept.channels)) {
          chart += `    • ${name}: ${channel}\n`;
        }
      }
    }

    return chart;
  }

  /**
   * Update team data
   */
  async updateMember(memberId, updates) {
    const structure = await this.getStructure();
    let updated = false;

    for (const dept of structure.departments) {
      const memberIndex = dept.members.findIndex(m => m.id === memberId);
      if (memberIndex !== -1) {
        dept.members[memberIndex] = {
          ...dept.members[memberIndex],
          ...updates
        };
        updated = true;
        break;
      }
    }

    if (updated) {
      // Save to file
      try {
        const fs = await import('fs/promises');
        await fs.writeFile(
          this.config.teamFile,
          JSON.stringify(structure, null, 2)
        );
        this.cacheTime = null; // Invalidate cache
      } catch (error) {
        console.warn('Could not save team data:', error.message);
      }
    }

    return updated;
  }

  /**
   * Add new team member
   */
  async addMember(departmentName, member) {
    const structure = await this.getStructure();
    const dept = structure.departments.find(d => 
      d.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!dept) {
      throw new Error(`Department not found: ${departmentName}`);
    }

    // Generate ID
    member.id = `${dept.name.toLowerCase().replace(/\s+/g, '-')}-${String(dept.members.length + 1).padStart(3, '0')}`;
    
    dept.members.push(member);
    this.cacheTime = null; // Invalidate cache

    // Save
    try {
      const fs = await import('fs/promises');
      await fs.writeFile(
        this.config.teamFile,
        JSON.stringify(structure, null, 2)
      );
    } catch (error) {
      console.warn('Could not save team data:', error.message);
    }

    return member;
  }

  /**
   * Get meeting schedule based on timezones
   */
  async getMeetingSchedule() {
    const structure = await this.getStructure();
    const schedule = {
      allHands: {
        bestTime: '11:00 UTC',
        description: 'Best time for all-hands meeting',
        attendees: structure.metadata.timezoneDistribution
      },
      regional: []
    };

    // Group by timezone
    const byTimezone = {};
    for (const dept of structure.departments) {
      for (const member of dept.members) {
        if (!byTimezone[member.timezone]) {
          byTimezone[member.timezone] = [];
        }
        byTimezone[member.timezone].push(member);
      }
    }

    for (const [tz, members] of Object.entries(byTimezone)) {
      schedule.regional.push({
        timezone: tz,
        members: members.map(m => m.name),
        size: members.length
      });
    }

    return schedule;
  }

  /**
   * Export team data
   */
  async export(format = 'json') {
    const structure = await this.getStructure();
    
    switch (format) {
      case 'json':
        return JSON.stringify(structure, null, 2);
      case 'markdown':
        return this.exportMarkdown(structure);
      case 'csv':
        return this.exportCSV(structure);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Export as Markdown
   */
  exportMarkdown(structure) {
    let md = '# Team Directory\n\n';
    md += `Last updated: ${structure.metadata.updatedAt}\n\n`;

    for (const dept of structure.departments) {
      md += `## ${dept.name}\n\n`;
      md += `${dept.description}\n\n`;

      for (const member of dept.members) {
        md += `### ${member.name}\n\n`;
        md += `- **Role**: ${member.role}\n`;
        md += `- **Email**: ${member.email}\n`;
        md += `- **Slack**: ${member.slack}\n`;
        md += `- **Timezone**: ${member.timezone}\n`;
        md += `- **Expertise**: ${member.expertise.join(', ')}\n`;
        md += `- **Currently working on**: ${member.currentlyWorkingOn}\n\n`;
        md += `${member.bio}\n\n`;
      }
    }

    return md;
  }

  /**
   * Export as CSV
   */
  exportCSV(structure) {
    let csv = 'Name,Role,Department,Email,Slack,Timezone,Expertise,Currently Working On\n';

    for (const dept of structure.departments) {
      for (const member of dept.members) {
        csv += `"${member.name}","${member.role}","${dept.name}","${member.email}","${member.slack}","${member.timezone}","${member.expertise.join('; ')}","${member.currentlyWorkingOn}"\n`;
      }
    }

    return csv;
  }

  /**
   * Get available expertise categories
   */
  getExpertiseCategories() {
    return EXPERTISE_CATEGORIES;
  }

  /**
   * Get role types
   */
  getRoleTypes() {
    return ROLE_TYPES;
  }
}

export default TeamMapper;
