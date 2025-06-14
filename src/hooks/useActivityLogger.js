import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logCustomActivity, activityTypes } from '../services/activityLogService';

/**
 * Custom hook for logging activities
 * @returns {Object} - Object with logActivity function
 */
const useActivityLogger = () => {
  const { user } = useAuth();

  /**
   * Log an activity
   * @param {Object} params - Activity parameters
   * @param {string} params.type - Activity type (from activityTypes)
   * @param {string} params.taskId - Task ID
   * @param {Object} [params.changes] - Object containing changes (before/after)
   * @param {Object} [params.metadata] - Additional metadata
   * @returns {Promise<Object>} - Created activity log
   */
  const logActivity = useCallback(async (params) => {
    if (!user) {
      console.warn('Cannot log activity: No user is authenticated');
      return null;
    }

    try {
      const activity = await logCustomActivity({
        ...params,
        userId: user.id,
      });
      return activity;
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw the error to prevent breaking the main functionality
      return null;
    }
  }, [user]);

  return {
    logActivity,
    activityTypes,
  };
};

export default useActivityLogger;
