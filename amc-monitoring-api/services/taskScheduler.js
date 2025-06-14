const cron = require('node-cron');
const Task = require('../models/Task');
const logger = require('../utils/logger');

class TaskScheduler {
  constructor() {
    this.taskCheckJob = null;
  }

  /**
   * Initialize and start all scheduled tasks
   */
  start() {
    // Check for overdue tasks every day at midnight
    this.taskCheckJob = cron.schedule('0 0 * * *', async () => {
      try {
        await this.checkAndUpdateOverdueTasks();
        logger.info('Successfully checked and updated overdue tasks');
      } catch (error) {
        logger.error('Error in task check job:', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    logger.info('Task scheduler started');
  }

  /**
   * Stop all scheduled tasks
   */
  stop() {
    if (this.taskCheckJob) {
      this.taskCheckJob.stop();
      logger.info('Task scheduler stopped');
    }
  }

  /**
   * Check for tasks that are overdue and update their status
   */
  async checkAndUpdateOverdueTasks() {
    try {
      // Find all tasks that are due before now and not completed/overdue
      const tasks = await Task.findOverdueTasks();
      
      if (tasks.length === 0) {
        logger.info('No overdue tasks found');
        return;
      }

      // Update each task to be marked as overdue
      const updatePromises = tasks.map(task => task.markAsOverdue());
      await Promise.all(updatePromises);
      
      logger.info(`Marked ${tasks.length} tasks as overdue`);
      
      // Here you could also add notification logic
      // e.g., send email notifications to assigned users
      
    } catch (error) {
      logger.error('Error checking overdue tasks:', error);
      throw error;
    }
  }

  /**
   * Manually trigger overdue task check (for testing)
   */
  async manualOverdueCheck() {
    logger.info('Manually triggering overdue task check');
    await this.checkAndUpdateOverdueTasks();
  }
}

// Export a singleton instance
module.exports = new TaskScheduler();
