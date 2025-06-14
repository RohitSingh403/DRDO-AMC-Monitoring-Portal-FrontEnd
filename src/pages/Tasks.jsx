import React, { useState, useMemo } from 'react';
import { 
  FiFilter, 
  FiSearch, 
  FiCalendar, 
  FiClock, 
  FiSun, 
  FiEdit, 
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiAlertTriangle,
  FiPlus,
  FiUpload,
  FiTool,
  FiFileText
} from 'react-icons/fi';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'on_hold': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const priorityColors = {
    'critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  };

  const priorityIcons = {
    'critical': <FiAlertTriangle className="h-4 w-4" />,
    'high': <FiAlertCircle className="h-4 w-4" />,
    'medium': <FiAlertCircle className="h-4 w-4" />,
    'low': <FiCheck className="h-4 w-4" />
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <FiTool className="h-4 w-4" />;
      case 'inspection':
        return <FiSearch className="h-4 w-4" />;
      case 'repair':
        return <FiTool className="h-4 w-4" />;
      case 'installation':
        return <FiTool className="h-4 w-4" />;
      case 'safety':
        return <FiAlertTriangle className="h-4 w-4" />;
      default:
        return <FiFileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{task.title}</h3>
              <span 
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
                title={`Priority: ${task.priority}`}
              >
                {priorityIcons[task.priority]}
                <span className="ml-1">{task.priority}</span>
              </span>
            </div>
            
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>
            
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span 
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}
              >
                {task.status.replace('_', ' ')}
              </span>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded">
                {getTypeIcon(task.type)}
                <span className="ml-1 capitalize">{task.type}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FiClock className="h-3 w-3 mr-1" />
                <span>{task.estimatedTime}h</span>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex space-x-1">
            <button 
              onClick={() => onEdit(task)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
              aria-label="Edit task"
            >
              <FiEdit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
              aria-label="Delete task"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-medium">
              {task.assignedTo?.charAt(0) || '?'}
            </div>
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
              {task.assignedToName || 'Unassigned'}
            </span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tasks = ({ tasks = [], onEditTask, onDeleteTask }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter tasks based on search, status, and priority
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks, searchQuery, selectedStatus, selectedPriority]);
  
  // Get unique statuses and priorities for filters
  const statuses = useMemo(() => {
    const uniqueStatuses = new Set(tasks.map(task => task.status));
    return Array.from(uniqueStatuses);
  }, [tasks]);
  
  const priorities = useMemo(() => {
    const uniquePriorities = new Set(tasks.map(task => task.priority));
    return Array.from(uniquePriorities);
  }, [tasks]);

  return (
    <div className="w-full max-w-full space-y-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title, description, or assignee..."
                className="w-full px-4 py-2.5 pr-10 text-sm text-gray-900 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFilter className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').replace(/^./, str => str.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Priorities</option>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedPriority('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/30"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-500">
            <FiFileText className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new task.'}
          </p>
          {(!searchQuery && selectedStatus === 'all' && selectedPriority === 'all') && (
            <div className="mt-6">
              <button
                onClick={() => onEditTask()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                New Task
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
