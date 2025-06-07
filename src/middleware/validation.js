const validateJobCreation = (req, res, next) => {
  const { name, schedule } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Job name is required and must be a non-empty string'
    });
  }

  if (!schedule || typeof schedule !== 'object') {
    return res.status(400).json({
      error: 'Schedule is required and must be an object'
    });
  }

  if (!schedule.type || !['hourly', 'daily', 'weekly', 'custom'].includes(schedule.type)) {
    return res.status(400).json({
      error: 'Schedule type must be one of: hourly, daily, weekly, custom'
    });
  }

  if (!schedule.value || typeof schedule.value !== 'object') {
    return res.status(400).json({
      error: 'Schedule value is required and must be an object'
    });
  }

  next();
};

const validateJobUpdate = (req, res, next) => {
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: 'At least one field must be provided for update'
    });
  }

  if (updates.name !== undefined && (typeof updates.name !== 'string' || updates.name.trim().length === 0)) {
    return res.status(400).json({
      error: 'Job name must be a non-empty string'
    });
  }

  if (updates.schedule !== undefined) {
    if (typeof updates.schedule !== 'object') {
      return res.status(400).json({
        error: 'Schedule must be an object'
      });
    }

    if (!['hourly', 'daily', 'weekly', 'custom'].includes(updates.schedule.type)) {
      return res.status(400).json({
        error: 'Schedule type must be one of: hourly, daily, weekly, custom'
      });
    }
  }

  next();
};

const validateJobId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      error: 'Valid job ID is required'
    });
  }

  next();
};

module.exports = {
  validateJobCreation,
  validateJobUpdate,
  validateJobId
};
