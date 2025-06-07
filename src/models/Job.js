const { v4: uuidv4 } = require('uuid');

class Job {
  constructor(name, schedule, type = 'console', filePath = null) {
    this.id = uuidv4();
    this.name = name;
    this.schedule = schedule;
    this.type = type; // 'console' or 'file'
    this.filePath = filePath;
    this.createdAt = new Date();
    this.lastRun = null;
    this.nextRun = null;
    this.runCount = 0;
    this.isActive = true;
    this.cronExpression = this.generateCronExpression();
  }

  generateCronExpression() {
    const { type, value } = this.schedule;
    
    switch (type) {
      case 'hourly':
        // Run at specific minute of every hour
        return `${value.minute || 0} * * * *`;
      
      case 'daily':
        // Run at specific time every day
        const hour = value.hour || 0;
        const minute = value.minute || 0;
        return `${minute} ${hour} * * *`;
      
      case 'weekly':
        // Run at specific time on specific day of week
        const weekHour = value.hour || 0;
        const weekMinute = value.minute || 0;
        const dayOfWeek = value.dayOfWeek || 0; // 0 = Sunday, 1 = Monday, etc.
        return `${weekMinute} ${weekHour} * * ${dayOfWeek}`;
      
      case 'custom':
        // Allow custom cron expression
        return value.cronExpression;
      
      default:
        throw new Error('Invalid schedule type');
    }
  }

  updateLastRun() {
    this.lastRun = new Date();
    this.runCount++;
  }

  setNextRun(nextRunTime) {
    this.nextRun = nextRunTime;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      schedule: this.schedule,
      type: this.type,
      filePath: this.filePath,
      createdAt: this.createdAt,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      runCount: this.runCount,
      isActive: this.isActive,
      cronExpression: this.cronExpression
    };
  }
}

module.exports = Job;
