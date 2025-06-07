const cron = require('node-cron');
const jobService = require('./jobService');
const logger = require('../utils/logger');

class Scheduler {
  constructor() {
    this.scheduledJobs = new Map();
  }

  scheduleJob(job) {
    try {
      if (this.scheduledJobs.has(job.id)) {
        this.unscheduleJob(job.id);
      }

      const task = cron.schedule(job.cronExpression, () => {
        jobService.executeJob(job.id);
      }, {
        scheduled: false
      });

      this.scheduledJobs.set(job.id, task);
      
      if (job.isActive) {
        task.start();
        logger.info(`Job scheduled and started: ${job.name}`, { 
          jobId: job.id, 
          cronExpression: job.cronExpression 
        });
      }

      return true;
    } catch (error) {
      logger.error(`Error scheduling job: ${job.name}`, { 
        jobId: job.id, 
        error: error.message 
      });
      return false;
    }
  }

  unscheduleJob(jobId) {
    const task = this.scheduledJobs.get(jobId);
    if (task) {
      task.stop();
      task.destroy();
      this.scheduledJobs.delete(jobId);
      logger.info(`Job unscheduled`, { jobId });
      return true;
    }
    return false;
  }

  startJob(jobId) {
    const task = this.scheduledJobs.get(jobId);
    if (task) {
      task.start();
      logger.info(`Job started`, { jobId });
      return true;
    }
    return false;
  }

  stopJob(jobId) {
    const task = this.scheduledJobs.get(jobId);
    if (task) {
      task.stop();
      logger.info(`Job stopped`, { jobId });
      return true;
    }
    return false;
  }

  rescheduleJob(job) {
    return this.scheduleJob(job);
  }

  getScheduledJobsCount() {
    return this.scheduledJobs.size;
  }
}

module.exports = new Scheduler();
