const fs = require('fs');
const path = require('path');
const Job = require('../models/Job');
const logger = require('../utils/logger');

class JobService {
  constructor() {
    this.jobs = new Map();
  }

  createJob(jobData) {
    try {
      const { name, schedule, type = 'console', filePath = null } = jobData;
      
      // Validate schedule
      this.validateSchedule(schedule);
      
      const job = new Job(name, schedule, type, filePath);
      this.jobs.set(job.id, job);
      
      logger.info(`Job created: ${job.name}`, { jobId: job.id });
      return job;
    } catch (error) {
      logger.error('Error creating job', error);
      throw error;
    }
  }

  validateSchedule(schedule) {
    const { type, value } = schedule;
    
    switch (type) {
      case 'hourly':
        if (!value || typeof value.minute !== 'number' || value.minute < 0 || value.minute > 59) {
          throw new Error('Hourly schedule requires minute (0-59)');
        }
        break;
      
      case 'daily':
        if (!value || typeof value.hour !== 'number' || value.hour < 0 || value.hour > 23) {
          throw new Error('Daily schedule requires hour (0-23)');
        }
        if (typeof value.minute !== 'number' || value.minute < 0 || value.minute > 59) {
          throw new Error('Daily schedule requires minute (0-59)');
        }
        break;
      
      case 'weekly':
        if (!value || typeof value.dayOfWeek !== 'number' || value.dayOfWeek < 0 || value.dayOfWeek > 6) {
          throw new Error('Weekly schedule requires dayOfWeek (0-6, 0=Sunday)');
        }
        if (typeof value.hour !== 'number' || value.hour < 0 || value.hour > 23) {
          throw new Error('Weekly schedule requires hour (0-23)');
        }
        if (typeof value.minute !== 'number' || value.minute < 0 || value.minute > 59) {
          throw new Error('Weekly schedule requires minute (0-59)');
        }
        break;
      
      case 'custom':
        if (!value || !value.cronExpression) {
          throw new Error('Custom schedule requires cronExpression');
        }
        break;
      
      default:
        throw new Error('Invalid schedule type. Must be: hourly, daily, weekly, or custom');
    }
  }

  getAllJobs() {
    return Array.from(this.jobs.values()).map(job => job.toJSON());
  }

  getJobById(id) {
    const job = this.jobs.get(id);
    return job ? job.toJSON() : null;
  }

  updateJob(id, updates) {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error('Job not found');
    }

    if (updates.schedule) {
      this.validateSchedule(updates.schedule);
      job.schedule = updates.schedule;
      job.cronExpression = job.generateCronExpression();
    }

    if (updates.name) job.name = updates.name;
    if (updates.type) job.type = updates.type;
    if (updates.filePath !== undefined) job.filePath = updates.filePath;

    logger.info(`Job updated: ${job.name}`, { jobId: job.id });
    return job.toJSON();
  }

  deleteJob(id) {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error('Job not found');
    }

    this.jobs.delete(id);
    logger.info(`Job deleted: ${job.name}`, { jobId: job.id });
    return true;
  }

  activateJob(id) {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error('Job not found');
    }

    job.activate();
    logger.info(`Job activated: ${job.name}`, { jobId: job.id });
    return job.toJSON();
  }

  deactivateJob(id) {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error('Job not found');
    }

    job.deactivate();
    logger.info(`Job deactivated: ${job.name}`, { jobId: job.id });
    return job.toJSON();
  }

  executeJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job || !job.isActive) {
      return;
    }

    try {
      const message = `Hello World - Job: ${job.name} executed at ${new Date().toISOString()}`;
      
      if (job.type === 'console') {
        console.log(message);
      } else if (job.type === 'file' && job.filePath) {
        const logDir = path.dirname(job.filePath);
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(job.filePath, message + '\n');
      }

      job.updateLastRun();
      logger.info(`Job executed successfully: ${job.name}`, { jobId: job.id });
    } catch (error) {
      logger.error(`Error executing job: ${job.name}`, { jobId: job.id, error: error.message });
    }
  }
}

module.exports = new JobService();
