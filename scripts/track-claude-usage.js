const fs = require('fs');
const path = require('path');

// Simple tracker for Claude token usage
class ClaudeUsageTracker {
  constructor() {
    this.usageFile = path.join(__dirname, '../.claude/usage.json');
    this.usage = this.loadUsage();
  }

  loadUsage() {
    try {
      if (fs.existsSync(this.usageFile)) {
        return JSON.parse(fs.readFileSync(this.usageFile, 'utf8'));
      }
    } catch (err) {
      console.error('Error loading usage data:', err);
    }
    
    return {
      dailyUsage: {},
      totalTokens: 0,
      sessions: 0,
      taskCategories: {
        'feature-implementation': 0,
        'bug-fix': 0,
        'refactoring': 0,
        'other': 0
      }
    };
  }

  recordUsage(tokens, category = 'other') {
    const today = new Date().toISOString().split('T')[0];
    
    // Update daily usage
    this.usage.dailyUsage[today] = (this.usage.dailyUsage[today] || 0) + tokens;
    
    // Update totals
    this.usage.totalTokens += tokens;
    this.usage.sessions += 1;
    
    // Update category
    if (this.usage.taskCategories[category] !== undefined) {
      this.usage.taskCategories[category] += 1;
    } else {
      this.usage.taskCategories.other += 1;
    }
    
    // Save usage data
    this.saveUsage();
    
    // Log usage
    console.log(`Recorded ${tokens} tokens for ${category}`);
    console.log(`Total usage: ${this.usage.totalTokens} tokens across ${this.usage.sessions} sessions`);
  }

  saveUsage() {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.usageFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.usageFile, JSON.stringify(this.usage, null, 2));
    } catch (err) {
      console.error('Error saving usage data:', err);
    }
  }

  generateReport() {
    // Generate simple report
    const report = [
      '# Claude Usage Report',
      '',
      `Total Tokens: ${this.usage.totalTokens}`,
      `Total Sessions: ${this.usage.sessions}`,
      '',
      '## Task Categories',
      ...Object.entries(this.usage.taskCategories)
        .map(([category, count]) => `- ${category}: ${count} sessions`),
      '',
      '## Daily Usage',
      ...Object.entries(this.usage.dailyUsage)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, tokens]) => `- ${date}: ${tokens} tokens`)
    ].join('\n');
    
    return report;
  }
}

// Export tracker
module.exports = new ClaudeUsageTracker();