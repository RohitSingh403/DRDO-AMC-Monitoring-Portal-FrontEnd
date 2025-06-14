import React, { useState } from 'react';
import TaskAlerts from '../components/TaskAlerts';

// Sample task data
const sampleTasks = [
  { id: 1, title: 'Complete project proposal', dueDate: '2025-06-10' }, // Overdue
  { id: 2, title: 'Submit monthly report', dueDate: '2025-06-12' }, // Due soon
  { id: 3, title: 'Team meeting', dueDate: '2025-06-15' }, // Due soon
  { id: 4, title: 'Client presentation', dueDate: '2025-06-01' }, // Overdue
  { id: 5, title: 'Code review', dueDate: '2025-06-20' }, // On track
  { id: 6, title: 'Update documentation', dueDate: '2025-06-25' }, // On track
];

const TaskAlertsDemo = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      dueDate: newTask.dueDate,
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', dueDate: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Task Alerts</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Color-coded task alerts to help you stay on top of your deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Tasks
            </h2>
            <TaskAlerts tasks={tasks} />
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Task
            </h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Task
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Legend
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Overdue</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Due Soon (≤ 3 days)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">On Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAlertsDemo;
