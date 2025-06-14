import React, { useState, useEffect, useRef } from 'react';
import { 
  FiDownload, 
  FiRefreshCw, 
  FiFilter, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiClipboard,
  FiChevronRight,
  FiBarChart2,
  FiTrendingUp,
  FiFileText,
  FiMessageSquare,
  FiPlus,
  FiX
} from 'react-icons/fi';
import './ReportsPage.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Chart.js registration
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: '30',
    taskType: 'all',
    status: 'all'
  });
  const [expandedTask, setExpandedTask] = useState(null);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newRemark, setNewRemark] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState({
    summary: {
      total: 124,
      completed: 89,
      inProgress: 22,
      pending: 8,
      overdue: 5,
      efficiency: '87.5%',
      completionRate: '71.8%'
    },
    tasks: Array(8).fill().map((_, i) => ({
      id: `TASK-${1000 + i}`,
      title: `Task ${i + 1}: ${['Maintenance', 'Inspection', 'Repair', 'Installation'][i % 4]}`,
      status: ['Completed', 'In Progress', 'Pending', 'Overdue'][i % 4],
      dueDate: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString(),
      priority: ['High', 'Medium', 'Low'][i % 3],
      assignedTo: 'John Doe',
      progress: Math.floor(Math.random() * 100)
    }))
  });

  // Enhanced data
  const taskTypes = [
    { id: 'all', name: 'All Tasks', icon: '📊', count: 124 },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', count: 45 },
    { id: 'inspection', name: 'Inspection', icon: '🔍', count: 32 },
    { id: 'repair', name: 'Repair', icon: '🛠️', count: 28 },
    { id: 'installation', name: 'Installation', icon: '⚙️', count: 19 }
  ];

  const dateRanges = [
    { id: '7', name: 'Last 7 days', color: 'from-blue-500 to-blue-600' },
    { id: '30', name: 'Last 30 days', color: 'from-purple-500 to-purple-600' },
    { id: '90', name: 'Last 90 days', color: 'from-pink-500 to-pink-600' },
    { id: 'custom', name: 'Custom Range', color: 'from-indigo-500 to-indigo-600' }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiBarChart2 /> },
    { id: 'analytics', name: 'Analytics', icon: <FiTrendingUp /> },
    { id: 'reports', name: 'Reports', icon: <FiFileText /> },
    { id: 'export', name: 'Export', icon: <FiDownload /> }
  ];

  // Generate sample report data
  const generateReportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate API call
      const newTasks = Array(8).fill().map((_, i) => ({
        id: `TASK-${1000 + i}`,
        title: `Task ${i + 1}: ${['Maintenance', 'Inspection', 'Repair', 'Installation'][i % 4]}`,
        status: ['Completed', 'In Progress', 'Pending', 'Overdue'][i % 4],
        dueDate: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString(),
        priority: ['High', 'Medium', 'Low'][i % 3],
        assignedTo: 'John Doe',
        progress: Math.floor(Math.random() * 100)
      }));
      
      const newSummary = {
        total: newTasks.length,
        completed: newTasks.filter(t => t.status === 'Completed').length,
        inProgress: newTasks.filter(t => t.status === 'In Progress').length,
        pending: newTasks.filter(t => t.status === 'Pending').length,
        overdue: newTasks.filter(t => t.status === 'Overdue').length,
        efficiency: `${Math.floor(Math.random() * 10) + 85}%`,
        completionRate: `${Math.floor(Math.random() * 10) + 65}%`
      };

      setReportData({ summary: newSummary, tasks: newTasks });
      setIsLoading(false);
    }, 500);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Chart data for status distribution
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [{
      label: 'Tasks',
      data: [
        reportData.summary.completed,
        reportData.summary.inProgress,
        reportData.summary.pending,
        reportData.summary.overdue
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 12 },
        bodyFont: { size: 14 },
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} tasks`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { stepSize: 10 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  const handleAddRemarkClick = (task) => {
    setSelectedTask(task);
    setShowRemarkModal(true);
  };

  const handleRemarkSubmit = (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    // In a real app, you would save this to your backend
    console.log('Adding remark to task:', selectedTask.id, 'Remark:', newRemark);
    
    // Close modal and reset form
    setShowRemarkModal(false);
    setNewRemark('');
    setSelectedTask(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Animation variants for task items
  const taskItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      },
    }),
  };

  // Get status count for tasks
  const getStatusCount = (status) => {
    return reportData.tasks.filter(task => task.status.toLowerCase() === status.toLowerCase()).length;
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percent) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="reports-page flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white shadow-lg sticky top-0 z-10">
        <div className="w-full px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">Reports</h1>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{reportData.summary.total} Tasks</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{reportData.summary.efficiency} Efficiency</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={generateReportData}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <FiRefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                <FiFilter className="h-5 w-5 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                <FiDownload className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel with Smooth Animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className="overflow-hidden"
      >
        {showFilters && (
          <div className="bg-white/5 dark:bg-gray-900/50 backdrop-blur-md shadow-md">
            <div className="w-full px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Task Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Task Type</label>
                  <select
                    name="taskType"
                    value={filters.taskType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-white/20 bg-white/5 dark:bg-gray-900/50 text-white rounded-md focus:ring-2 focus:ring-white focus:border-transparent"
                  >
                    {taskTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-white/20 bg-white/5 dark:bg-gray-900/50 text-white rounded-md focus:ring-2 focus:ring-white focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Date Range</label>
                  <select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-white/20 bg-white/5 dark:bg-gray-900/50 text-white rounded-md focus:ring-2 focus:ring-white focus:border-transparent"
                  >
                    {dateRanges.map(range => (
                      <option key={range.id} value={range.id}>
                        {range.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 reports-container">
        <div className="w-full px-4 md:px-6 py-8">
          {/* Tabs with Enhanced Design */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: 'Total Tasks', 
                value: reportData.summary.total,
                icon: <FiClipboard className="h-6 w-6" />,
                color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
                trend: 'up',
                trendValue: '12%',
                trendText: 'from last month'
              },
              { 
                title: 'Completed', 
                value: reportData.summary.completed,
                icon: <FiCheckCircle className="h-6 w-6" />,
                color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
                trend: 'up',
                trendValue: '8%',
                trendText: 'from last month'
              },
              { 
                title: 'In Progress', 
                value: reportData.summary.inProgress,
                icon: <FiClock className="h-6 w-6" />,
                color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                trend: 'down',
                trendValue: '3%',
                trendText: 'from last month'
              },
              { 
                title: 'Overdue', 
                value: reportData.summary.overdue,
                icon: <FiAlertTriangle className="h-6 w-6" />,
                color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
                trend: 'down',
                trendValue: '15%',
                trendText: 'from last month'
              }
            ].map((stat, index) => (
              <motion.div 
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ease: "easeOut" }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-30`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <span className={`${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-semibold`}>
                    {stat.trendValue}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{stat.trendText}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Charts and Recent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Status Distribution Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Status Distribution</h2>
                <div className="flex items-center space-x-2">
                  <motion.select 
                    className="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange({ target: { name: 'dateRange', value: e.target.value } })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {dateRanges.map(range => (
                      <option key={range.id} value={range.id}>
                        {range.name}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </div>
              <div className="h-80 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Bar 
                    data={statusChartData} 
                    options={chartOptions} 
                  />
                </motion.div>
              </div>
            </div>

            {/* Enhanced Recent Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  View All
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {reportData.tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, ease: "easeOut" }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                         onClick={() => setExpandedTask(task.id === expandedTask ? null : task.id)}
                    >
                      <div className={`p-2 rounded-full ${getStatusColor(task.status).split(' ')[0]} bg-opacity-20 mr-3`}>
                        {task.status === 'Completed' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
                        {task.status === 'In Progress' && <FiClock className="h-5 w-5 text-blue-500" />}
                        {task.status === 'Pending' && <FiClock className="h-5 w-5 text-yellow-500" />}
                        {task.status === 'Overdue' && <FiAlertTriangle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Due {formatDate(task.dueDate)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRemarkClick(task);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        title="Add remark/issue"
                      >
                        <FiMessageSquare className="h-4 w-4" />
                      </button>
                      <motion.div
                        animate={{ rotate: task.id === expandedTask ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 dark:text-gray-500"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                    
                    {task.id === expandedTask && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                            <div className="w-32">
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <div 
                                  className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                                {task.progress}% Complete
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Remark Modal */}
      <AnimatePresence>
        {showRemarkModal && selectedTask && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRemarkModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Remark/Issue
                </h3>
                <button 
                  onClick={() => setShowRemarkModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Adding remark for: <span className="font-medium text-gray-900 dark:text-white">{selectedTask.title}</span>
                </p>
                <form onSubmit={handleRemarkSubmit}>
                  <textarea
                    rows="4"
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the issue or add remarks..."
                    autoFocus
                  />
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRemarkModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    >
                      <FiPlus className="mr-2 h-4 w-4" />
                      Add Remark
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
