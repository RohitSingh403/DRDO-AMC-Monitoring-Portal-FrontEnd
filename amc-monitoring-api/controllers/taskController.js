const Task = require('../models/Task');
const logger = require('../utils/logger');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error(`Error getting tasks: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Error getting task: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is task owner or admin
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    // If task is being marked as completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = Date.now();
    }
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Error updating task: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is task owner or admin
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }
    
    await task.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting task: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get tasks by status
 * @route   GET /api/tasks/status/:status
 * @access  Private
 */
exports.getTasksByStatus = async (req, res, next) => {
  try {
    const tasks = await Task.find({ status: req.params.status })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error(`Error getting tasks by status: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get tasks assigned to current user
 * @route   GET /api/tasks/assigned/me
 * @access  Private
 */
exports.getMyAssignedTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error(`Error getting assigned tasks: ${error.message}`);
    next(error);
  }
};
