import api from './api';

/**
 * Get activity logs for a specific task
 * @param {string} taskId - Task ID
 * @param {Object} options - Query options (page, limit, sortBy)
 * @returns {Promise<Object>} Paginated activity logs
 */
export const getTaskActivityLogs = async (taskId, options = {}) => {
  try {
    const { page = 1, limit = 20, sortBy = 'createdAt:desc' } = options;
    
    const response = await api.get(`/activity-logs/task/${taskId}`, {
      params: {
        page,
        limit,
        sortBy,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching task activity logs:', error);
    throw error;
  }
};

/**
 * Get all activity logs (admin only)
 * @param {Object} filters - Filter criteria
 * @param {Object} options - Query options (page, limit, sortBy)
 * @returns {Promise<Object>} Paginated activity logs
 */
export const getAllActivityLogs = async (filters = {}, options = {}) => {
  try {
    const { page = 1, limit = 20, sortBy = 'createdAt:desc' } = options;
    
    const response = await api.get('/activity-logs', {
      params: {
        ...filters,
        page,
        limit,
        sortBy,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching all activity logs:', error);
    throw error;
  }
};

/**
 * Log a custom activity
 * @param {Object} activityData - Activity data
 * @param {string} activityData.type - Activity type
 * @param {string} activityData.taskId - Task ID
 * @param {Object} activityData.changes - Object containing changes
 * @param {Object} activityData.metadata - Additional metadata
 * @returns {Promise<Object>} Created activity log
 */
export const logCustomActivity = async (activityData) => {
  try {
    const response = await api.post('/activity-logs/custom', activityData);
    return response.data;
  } catch (error) {
    console.error('Error logging custom activity:', error);
    throw error;
  }
};

export const activityTypes = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TASK_ASSIGNED: 'task_assigned',
  TASK_DUE_DATE_CHANGED: 'task_due_date_changed',
  TASK_COMPLETED: 'task_completed',
  TASK_CANCELLED: 'task_cancelled',
  TASK_REMARK_ADDED: 'task_remark_added',
  TASK_PHOTO_ADDED: 'task_photo_added',
  TASK_ATTACHMENT_ADDED: 'task_attachment_added',
  TASK_ATTACHMENT_REMOVED: 'task_attachment_removed',
  CUSTOM_ACTIVITY: 'custom_activity',
};
