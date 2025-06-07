const jobService = require('../services/jobService');
const scheduler = require('../services/scheduler');
const logger = require('../utils/logger');

class JobController {
  async createJob(req, res) {
    try {
      const job = jobService.createJob(req.body);
      
      // Schedule the job
      const scheduled = scheduler.scheduleJob(job);
      
      if (!scheduled) {
        return res.status(500).json({
          error: 'Job created but failed to schedule'
        });
      }

      res.status(201).json({
        message: 'Job created and scheduled successfully',
        job: job.toJSON()
      });
    } catch (error) {
      logger.error('Error in createJob controller', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  async getAllJobs(req, res) {
    try {
      const jobs = jobService.getAllJobs();
      res.json({
        message: 'Jobs retrieved successfully',
        jobs,
        count: jobs.length
      });
    } catch (error) {
      logger.error('Error in getAllJobs controller', error);
      res.status(500).json({
        error: 'Failed to retrieve jobs'
      });
    }
  }

  async getJobById(req, res) {
    try {
      const job = jobService.getJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({
          error: 'Job not found'
        });
      }

      res.json({
        message: 'Job retrieved successfully',
        job
      });
    } catch (error) {
      logger.error('Error in getJobById controller', error);
      res.status(500).json({
        error: 'Failed to retrieve job'
      });
    }
  }

  async updateJob(req, res) {
    try {
      const updatedJob = jobService.updateJob(req.params.id, req.body);
      
      // Reschedule the job with new parameters
      scheduler.rescheduleJob(updatedJob);

      res.json({
        message: 'Job updated successfully',
        job: updatedJob
      });
    } catch (error) {
      logger.error('Error in updateJob controller', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(400).json({
        error: error.message
      });
    }
  }

  async deleteJob(req, res) {
    try {
      // Unschedule the job first
      scheduler.unscheduleJob(req.params.id);
      
      // Then delete from service
      jobService.deleteJob(req.params.id);

      res.json({
        message: 'Job deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteJob controller', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({
        error: 'Failed to delete job'
      });
    }
  }

  async activateJob(req, res) {
    try {
      const job = jobService.activateJob(req.params.id);
      scheduler.startJob(req.params.id);

      res.json({
        message: 'Job activated successfully',
        job
      });
    } catch (error) {
      logger.error('Error in activateJob controller', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({
        error: 'Failed to activate job'
      });
    }
  }

  async deactivateJob(req, res) {
    try {
      const job = jobService.deactivateJob(req.params.id);
      scheduler.stopJob(req.params.id);

      res.json({
        message: 'Job deactivated successfully',
        job
      });
    } catch (error) {
      logger.error('Error in deactivateJob controller', error);
      
      if (error.message === 'Job not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({
        error: 'Failed to deactivate job'
      });
    }
  }

  async executeJobNow(req, res) {
    try {
      const job = jobService.getJobById(req.params.id);
      
      if (!job) {
        return res.status(404).json({
          error: 'Job not found'
        });
      }

      jobService.executeJob(req.params.id);

      res.json({
        message: 'Job executed successfully',
        executedAt: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in executeJobNow controller', error);
      res.status(500).json({
        error: 'Failed to execute job'
      });
    }
  }

  async getSystemStats(req, res) {
    try {
      const jobs = jobService.getAllJobs();
      const activeJobs = jobs.filter(job => job.isActive);
      const scheduledCount = scheduler.getScheduledJobsCount();

      res.json({
        message: 'System statistics retrieved successfully',
        stats: {
          totalJobs: jobs.length,
          activeJobs: activeJobs.length,
          inactiveJobs: jobs.length - activeJobs.length,
          scheduledJobs: scheduledCount,
          systemUptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        }
      });
    } catch (error) {
      logger.error('Error in getSystemStats controller', error);
      res.status(500).json({
        error: 'Failed to retrieve system statistics'
      });
    }
  }
}

module.exports = new JobController();
