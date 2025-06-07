const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { validateJobCreation, validateJobUpdate, validateJobId } = require('../middleware/validation');

// Create a new job
router.post('/', validateJobCreation, jobController.createJob);

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get system statistics
router.get('/stats', jobController.getSystemStats);

// Get a specific job by ID
router.get('/:id', validateJobId, jobController.getJobById);

// Update a job
router.put('/:id', validateJobId, validateJobUpdate, jobController.updateJob);

// Delete a job
router.delete('/:id', validateJobId, jobController.deleteJob);

// Activate a job
router.post('/:id/activate', validateJobId, jobController.activateJob);

// Deactivate a job
router.post('/:id/deactivate', validateJobId, jobController.deactivateJob);

// Execute a job immediately
router.post('/:id/execute', validateJobId, jobController.executeJobNow);

module.exports = router;
