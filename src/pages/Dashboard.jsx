import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiClock, 
  FiUsers, 
  FiFileText,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiArrowRight,
  FiMoreHorizontal,
  FiPlus,
  FiPieChart,
  FiBarChart2,
  FiTable,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Recent updates data
const recentUpdates = [
  {
    id: 1,
    title: 'Q2 Maintenance Schedule',
    description: 'Updated maintenance schedule for Q2 2025',
    date: '2025-06-10',
    status: 'completed',
    type: 'maintenance'
  },
  {
    id: 2,
    title: 'System Upgrade',
    description: 'Completed system upgrade to version 2.1',
    date: '2025-06-09',
    status: 'completed',
    type: 'upgrade'
  },
  {
    id: 3,
    title: 'Inspection Report',
    description: 'Quarterly inspection report submitted',
    date: '2025-06-08',
    status: 'pending',
    type: 'inspection'
  }
];

// Import Components
import TaskCategories from '../components/TaskCategories';
import TaskForm from '../components/forms/task/TaskForm';
import Modal from '../components/common/Modal';

// Sample data for recent activities
const activities = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'New task assigned: Dashboard Design',
    time: '2 minutes ago',
    status: 'completed',
    statusText: 'Completed'
  },
  {
    id: 2,
    title: 'Meeting',
    description: 'Team sync - Q2 Planning',
    time: '1 hour ago',
    status: 'upcoming',
    statusText: 'In 30 min'
  },
  {
    id: 3,
    title: 'Project Beta',
    description: 'Bug reported in user authentication',
    time: '3 hours ago',
    status: 'alert',
    statusText: 'Attention needed'
  }
];

// Stats data with dark mode support
const statsData = [
  { 
    title: 'Total Projects', 
    value: '24', 
    change: '+5', 
    trend: 'up',
    icon: <FiFileText className="h-5 w-5" />,
    color: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600',
    darkColor: 'dark:bg-blue-900/30',
    darkTextColor: 'dark:text-blue-400'
  },
  { 
    title: 'Tasks Completed', 
    value: '156', 
    change: '+12', 
    trend: 'up',
    icon: <FiCheckCircle className="h-5 w-5" />,
    color: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600',
    darkColor: 'dark:bg-green-900/30',
    darkTextColor: 'dark:text-green-400'
  },
  { 
    title: 'Pending Tasks', 
    value: '8', 
    change: '-3', 
    trend: 'down',
    icon: <FiAlertTriangle className="h-5 w-5" />,
    color: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-600',
    darkColor: 'dark:bg-amber-900/30',
    darkTextColor: 'dark:text-amber-400'
  },
  { 
    title: 'Team Members', 
    value: '12', 
    change: '+2', 
    trend: 'up',
    icon: <FiUsers className="h-5 w-5" />,
    color: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600',
    darkColor: 'dark:bg-purple-900/30',
    darkTextColor: 'dark:text-purple-400'
  }
];

// Sample data for projects
const projectsData = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    progress: 75,
    status: 'In Progress',
    team: [
      { name: 'JD', bg: 'bg-blue-500' },
      { name: 'AS', bg: 'bg-green-500' },
      { name: 'MJ', bg: 'bg-purple-500' },
      { name: '+2', bg: 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300' }
    ],
    deadline: 'May 15, 2023',
    budget: '$12,500',
    priority: 'High',
    startDate: 'Mar 1, 2023'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Building a cross-platform mobile application with React Native',
    progress: 45,
    status: 'In Progress',
    team: [
      { name: 'TM', bg: 'bg-red-500' },
      { name: 'AK', bg: 'bg-yellow-500' },
      { name: '+3', bg: 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300' }
    ],
    deadline: 'Jun 30, 2023',
    budget: '$24,000',
    priority: 'Medium',
    startDate: 'Feb 15, 2023'
  }
];

const StatCard = ({ title, value, change, trend, icon, color, textColor, darkColor, darkTextColor }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:shadow-primary-100/20 dark:hover:shadow-primary-900/20 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{value}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              trend === 'up' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {trend === 'up' ? (
                <FiTrendingUp className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              ) : (
                <FiTrendingDown className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              )}
              {change}
            </span>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                trend === 'up' 
                  ? 'bg-gradient-to-r from-green-400 to-green-500' 
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: trend === 'up' ? '75%' : '25%' }}
            ></div>
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${color} ${darkColor} transition-all group-hover:scale-110`}>
          <span className={`${textColor} ${darkTextColor} text-xl`}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, description, time, status, statusText }) => {
  const statusIcons = {
    completed: <FiCheckCircle className="h-4 w-4 text-green-500" />,
    upcoming: <FiClock className="h-4 w-4 text-blue-500" />,
    alert: <FiAlertTriangle className="h-4 w-4 text-amber-500" />
  };

  return (
    <div className="flex items-start pb-4 last:pb-0">
      <div className="flex-shrink-0 mt-1 mr-3">
        {statusIcons[status]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="ml-4 text-xs text-gray-400 whitespace-nowrap">{time}</div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const priorityColors = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'almost done':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'on hold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:shadow-primary-100/20 dark:hover:shadow-primary-900/10 hover:-translate-y-0.5">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{project.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[project.priority] || ''}`}>
                {project.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button 
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="More options"
            >
              <FiMoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-5 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  project.progress < 30 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                  project.progress < 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                  'bg-gradient-to-r from-green-400 to-green-500'
                }`} 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FiCalendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>{project.startDate}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span>Due {project.deadline}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team.map((member, idx) => (
              <div 
                key={idx}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shadow-sm ${
                  member.bg.includes('bg-gray-200') 
                    ? 'text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600' 
                    : 'text-white'
                } ${member.bg}`}
                title={member.name.startsWith('+') ? `${member.name.replace('+', '')} more` : member.name}
              >
                {member.name}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{project.budget}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddTask = async (data) => {
    try {
      // Format the task data
      const taskData = {
        ...data,
        // Convert scheduledFor to ISO string if it exists
        scheduledFor: data.scheduledFor ? data.scheduledFor.toISOString() : null
      };

      console.log('New task:', taskData);
      
      // Here you would typically make an API call to save the task
      // const response = await api.post('/tasks', taskData);
      
      // If task is scheduled, add it to the scheduled tasks list
      if (taskData.scheduledFor) {
        setScheduledTasks(prev => [...prev, taskData]);
        enqueueSnackbar('Task scheduled successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('Task created successfully!', { variant: 'success' });
      }
      
      setIsTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      enqueueSnackbar('Failed to create task. Please try again.', { variant: 'error' });
    }
  };

  // Check for scheduled tasks that are due
  const checkScheduledTasks = () => {
    const now = new Date();
    const dueTasks = scheduledTasks.filter(task => {
      const scheduledTime = new Date(task.scheduledFor);
      return scheduledTime <= now && scheduledTime > new Date(now.getTime() - 5 * 60 * 1000); // Within last 5 minutes
    });

    dueTasks.forEach(task => {
      enqueueSnackbar(`Scheduled task due now: ${task.title}`, { 
        variant: 'info',
        autoHideDuration: 10000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    });

    // Remove processed tasks
    setScheduledTasks(prev => 
      prev.filter(task => new Date(task.scheduledFor) > now)
    );
  };

  // Check for scheduled tasks every minute
  useEffect(() => {
    const interval = setInterval(checkScheduledTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [scheduledTasks]);

  // Mock data for charts
  const complianceData = {
    labels: ['Compliant', 'Non-Compliant'],
    datasets: [{
      data: [85, 15],
      backgroundColor: ['#4CAF50', '#F44336'],
      hoverBackgroundColor: ['#45a049', '#da190b'],
      borderWidth: 0
    }]
  };

  const taskTypesData = {
    labels: ['Maintenance', 'Repairs', 'Inspections', 'Upgrades'],
    datasets: [{
      label: 'Tasks Completed',
      data: [45, 30, 25, 20],
      backgroundColor: [
        '#4CAF50',
        '#2196F3',
        '#FFC107',
        '#9C27B0'
      ],
      borderColor: [
        '#4CAF50',
        '#2196F3',
        '#FFC107',
        '#9C27B0'
      ],
      borderWidth: 1
    }]
  };

  // Chart options
  const complianceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Compliance Status (%)',
        color: '#333'
      }
    }
  };

  const taskTypesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Types Completed',
        color: '#333'
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your AMC management system
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Task
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Assets', value: '125', icon: FiCheckCircle, color: 'bg-blue-500' },
          { title: 'Active Contracts', value: '87', icon: FiFileText, color: 'bg-green-500' },
          { title: 'Pending Tasks', value: '14', icon: FiClock, color: 'bg-yellow-500' },
          { title: 'Maintenance Due', value: '5', icon: FiAlertTriangle, color: 'bg-red-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Compliance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FiPieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Compliance Overview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current compliance status across all assets
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <FiFilter className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <Pie data={complianceData} options={{
              ...complianceOptions,
              plugins: {
                ...complianceOptions.plugins,
                title: {
                  ...complianceOptions.plugins.title,
                  font: {
                    size: 18
                  }
                },
                legend: {
                  ...complianceOptions.plugins.legend,
                  labels: {
                    color: '#333'
                  }
                }
              }
            }} />
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <FiBarChart2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Task Distribution
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distribution of completed tasks by type
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <FiFilter className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <Bar data={taskTypesData} options={{
              ...taskTypesOptions,
              plugins: {
                ...taskTypesOptions.plugins,
                title: {
                  ...taskTypesOptions.plugins.title,
                  font: {
                    size: 18
                  }
                },
                legend: {
                  ...taskTypesOptions.plugins.legend,
                  labels: {
                    color: '#333'
                  }
                }
              },
              scales: {
                ...taskTypesOptions.scales,
                y: {
                  ...taskTypesOptions.scales.y,
                  grid: {
                    color: '#eee'
                  },
                  ticks: {
                    color: '#666'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#666'
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Updates Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Recent Updates
          </h2>
          <FiTable className="h-6 w-6 text-blue-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentUpdates.map((update) => (
                <tr key={update.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {update.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {update.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {new Date(update.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      update.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {update.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      update.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                      update.type === 'upgrade' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {update.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Task Categories */}
      <div className="w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Categories</h2>
        <TaskCategories />
      </div>
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map(activity => (
                  <ActivityItem key={activity.id} {...activity} />
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="#" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View all activities
                  <FiArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h2>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View all
              </a>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {projectsData.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm 
          onSubmit={handleAddTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
