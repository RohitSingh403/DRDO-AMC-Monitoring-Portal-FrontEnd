const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getMyAssignedTasks
} = require('../controllers/taskController');

// All routes below this middleware are protected
router.use(protect);

// Routes for /api/tasks
router
  .route('/')
  .get(getTasks)
  .post(createTask);

// Routes for /api/tasks/status/:status
router.get('/status/:status', getTasksByStatus);

// Routes for /api/tasks/assigned/me
router.get('/assigned/me', getMyAssignedTasks);

// Routes for /api/tasks/:id
router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
