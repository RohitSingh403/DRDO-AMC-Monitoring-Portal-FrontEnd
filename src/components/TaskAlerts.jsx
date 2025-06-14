import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

const TaskAlerts = ({ tasks = [] }) => {
  // Categorize tasks based on due date
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  const categorizedTasks = tasks.reduce(
    (acc, task) => {
      if (!task.dueDate) return acc;
      
      const dueDate = new Date(task.dueDate);
      const diffDays = Math.ceil((dueDate - now) / oneDay);
      
      if (diffDays < 0) {
        acc.overdue.push({ ...task, status: 'overdue', daysDiff: Math.abs(diffDays) });
      } else if (diffDays <= 3) {
        acc.dueSoon.push({ ...task, status: 'dueSoon', daysDiff: diffDays });
      } else {
        acc.onTrack.push({ ...task, status: 'onTrack', daysDiff: diffDays });
      }
      return acc;
    },
    { overdue: [], dueSoon: [], onTrack: [] }
  );

  // Status configurations
  const statusConfig = {
    overdue: {
      icon: <FiAlertTriangle className="w-5 h-5" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-200 dark:border-red-900',
      title: 'Overdue Tasks',
    },
    dueSoon: {
      icon: <FiClock className="w-5 h-5 text-amber-500" />,
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-800 dark:text-amber-200',
      borderColor: 'border-amber-200 dark:border-amber-900',
      title: 'Due Soon',
    },
    onTrack: {
      icon: <FiCheckCircle className="w-5 h-5 text-green-500" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-200',
      borderColor: 'border-green-200 dark:border-green-900',
      title: 'On Track',
    },
  };

  const renderTaskList = (tasks, status) => {
    if (tasks.length === 0) return null;
    
    const config = statusConfig[status];
    
    return (
      <div 
        key={status}
        className={`mb-4 rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}
      >
        <div className="flex items-center mb-2">
          <span className={`mr-2 ${config.textColor}`}>
            {config.icon}
          </span>
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title} ({tasks.length})
          </h3>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-start justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {task.title}
              </span>
              <span className={`text-xs ${config.textColor}`}>
                {status === 'overdue' 
                  ? `${task.daysDiff} days overdue`
                  : status === 'dueSoon'
                  ? `Due in ${task.daysDiff} day${task.daysDiff !== 1 ? 's' : ''}`
                  : `Due in ${task.daysDiff} days`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderTaskList(categorizedTasks.overdue, 'overdue')}
      {renderTaskList(categorizedTasks.dueSoon, 'dueSoon')}
      {renderTaskList(categorizedTasks.onTrack, 'onTrack')}
      
      {tasks.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No tasks to display
        </div>
      )}
    </div>
  );
};

export default TaskAlerts;
