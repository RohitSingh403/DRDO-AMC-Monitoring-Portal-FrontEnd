import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiFileText, 
  FiPieChart, 
  FiCalendar, 
  FiMessageSquare,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiRefreshCw,
  FiSun,
  FiMoon,
  FiUser,
  FiHelpCircle,
  FiLogOut,
  FiBarChart2,
  FiUpload,
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Clients from './pages/Clients';
import Contracts from './pages/Contracts';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Messages from './pages/Messages';
import TaskAlertsDemo from './pages/TaskAlertsDemo';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import EnhancedTaskForm from './components/forms/task/EnhancedTaskForm';
// import { FiUpload } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // Load tasks from localStorage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: 1,
        title: 'Complete Dashboard Design',
        type: 'maintenance',
        description: 'Finish the dashboard layout and styling',
        dueDate: '2025-06-15',
        priority: 'high',
        status: 'in_progress',
        assignedTo: '1',
        estimatedTime: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Mobile App Development',
        type: 'development',
        description: 'Implement new features and fix bugs',
        dueDate: '2025-06-20',
        priority: 'medium',
        status: 'pending',
        assignedTo: '2',
        estimatedTime: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  

  // Get tasks that are due soon or overdue
  const getTaskReminders = useCallback(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate - now;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      
      // Show tasks due today or overdue
      return daysDiff <= 1 && daysDiff >= -1;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  // Get authentication state from context
  const { isAuthenticated, user: currentUser, logout, loading: authLoading } = useAuthContext();
  const userRole = currentUser?.role;
  const location = useLocation();
  
  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login', { state: { from: location } });
  };
  
  // Get page title based on path
  const getPageTitle = (path) => {
    const pathMap = {
      '/': 'Dashboard',
      '/tasks': 'Tasks',
      '/clients': 'Clients',
      '/contracts': 'Contracts',
      '/analytics': 'Analytics',
      '/calendar': 'Calendar',
      '/messages': 'Messages',
      '/reports': 'Reports',
      '/activity-logs': 'Activity Logs',
      '/profile': 'My Profile',
      '/admin/users': 'User Management',
      '/admin/settings': 'System Settings'
    };
    
    // Check for task detail page
    if (path.startsWith('/tasks/')) {
      const taskId = path.split('/')[2];
      const task = tasks.find(t => t.id === parseInt(taskId));
      return task ? `Task: ${task.title}` : 'Task Details';
    }
    
    return pathMap[path] || 'Page';
  };

  // Protected Route component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }
    
    return children;
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // Check if task title already exists
  const isTaskTitleUnique = (title, excludeId = null) => {
    return !tasks.some(task => 
      task.title.toLowerCase() === title.toLowerCase() && 
      (excludeId ? task.id !== excludeId : true)
    );
  };

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle task submission
  const handleTaskSubmit = async (formData) => {
    return new Promise((resolve) => {
      try {
        // Check for duplicate task title
        if (!isTaskTitleUnique(formData.title, formData.id)) {
          return resolve({ success: false, error: 'A task with this title already exists' });
        }

        if (formData.id) {
          // Update existing task
          setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task => 
              task.id === formData.id ? { 
                ...task, 
                ...formData, 
                updatedAt: new Date().toISOString() 
              } : task
            );
            return updatedTasks;
          });
        } else {
          // Add new task
          const newTask = {
            ...formData,
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setTasks(prevTasks => [...prevTasks, newTask]);
        }
        
        resolve({ success: true });
      } catch (error) {
        console.error('Error saving task:', error);
        resolve({ success: false, error: 'Failed to save task' });
      }
    });
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => {
        const newTasks = prevTasks.filter(task => task.id !== taskId);
        return newTasks;
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <EnhancedTaskForm
        key={selectedTask ? `edit-${selectedTask.id}` : 'create'}
        isOpen={isTaskFormOpen}
        onClose={() => {
          setSelectedTask(null);
          setIsTaskFormOpen(false);
        }}
        onSubmit={async (formData) => {
          const result = await handleTaskSubmit(formData);
          if (result.success) {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
          }
          return result;
        }}
        task={selectedTask}
        existingTasks={tasks}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                {/* Top Navigation Bar */}
                <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700 z-50">
                  <div className="h-full container mx-auto px-4 sm:px-6">
                    <div className="flex h-full items-center justify-between">
                      {/* Left section - Logo and App name */}
                      <div className="flex items-center space-x-3">
                        {/* Logo - Replace src with your actual logo */}
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-auto"
                            src="/src/assets/Screenshot 2025-06-11 at 9.09.03 PM.png"
                            alt="AMC Portal Logo"
                          />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                          AMC Portal
                        </h1>
                      </div>

                      {/* Right section */}
                      <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden lg:block">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Search..."
                          />
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">
                          {/* Dark mode toggle */}
                          <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                          >
                            {darkMode ? (
                              <FiSun size={18} className="text-yellow-400" />
                            ) : (
                              <FiMoon size={18} className="text-gray-600 dark:text-gray-300" />
                            )}
                          </button>

                          {/* Notifications */}
                          <div className="relative" ref={notificationsRef}>
                            <button
                              onClick={() => setNotificationsOpen(!notificationsOpen)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 relative"
                              aria-label="View notifications"
                              aria-expanded={notificationsOpen}
                            >
                              <FiBell size={18} />
                              {getTaskReminders().length > 0 && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                              )}
                            </button>
                            
                            {/* Notifications dropdown */}
                            {notificationsOpen && (
                              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Task Reminders</h3>
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                      {getTaskReminders().length} {getTaskReminders().length === 1 ? 'reminder' : 'reminders'}
                                    </span>
                                  </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                  {getTaskReminders().length > 0 ? (
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                      {getTaskReminders().map((task) => {
                                        const dueDate = new Date(task.dueDate);
                                        const now = new Date();
                                        const isOverdue = dueDate < now;
                                        const isToday = dueDate.toDateString() === now.toDateString();
                                        
                                        return (
                                          <li key={task.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <div className="flex items-start">
                                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                                isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                                              }`}>
                                                <FiAlertTriangle className={`h-5 w-5 ${
                                                  isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                                                }`} />
                                              </div>
                                              <div className="ml-3 flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                  {task.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                  Due {isToday ? 'today' : isOverdue ? 'overdue' : 'tomorrow'} • {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                              </div>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  ) : (
                                    <div className="p-4 text-center">
                                      <FiCheckCircle className="mx-auto h-8 w-8 text-gray-400" />
                                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No upcoming task reminders</p>
                                    </div>
                                  )}
                                </div>
                                {getTaskReminders().length > 0 && (
                                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-center">
                                    <a 
                                      href="/tasks" 
                                      className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/tasks');
                                        setNotificationsOpen(false);
                                      }}
                                    >
                                      View all tasks
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Profile dropdown */}
                          <div className="relative" ref={userMenuRef}>
                            <button
                              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                              className="flex items-center space-x-2 p-1 pr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                              aria-expanded={userDropdownOpen}
                              aria-haspopup="true"
                            >
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                UN
                              </div>
                              <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-200">
                                User Name
                              </span>
                              <FiChevronDown 
                                size={16} 
                                className={`text-gray-500 dark:text-gray-400 transition-transform ${userDropdownOpen ? 'transform rotate-180' : ''}`} 
                              />
                            </button>
                            
                            {userDropdownOpen && (
                              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">User Name</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                                </div>

                                <Link 
                                  to="/profile" 
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => setUserDropdownOpen(false)}
                                >
                                  <FiUser className="inline-block mr-2" size={14} />
                                  My Profile
                                </Link>
                                <Link 
                                  to="/help" 
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => setUserDropdownOpen(false)}
                                >
                                  <FiHelpCircle className="inline-block mr-2" size={14} />
                                  Help & Support
                                </Link>
                                <button 
                                  onClick={handleSignOut}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                  <FiLogOut className="inline-block mr-2" size={14} />
                                  Sign out
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Sidebar */}
                <aside 
                  className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                                fixed md:relative w-64 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                                border-r border-gray-200 dark:border-gray-700
                                transition-transform duration-300 ease-in-out flex flex-col h-full z-10`}
                >
                  <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 h-16">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">AMC Portal</h1>
                    <button 
                      onClick={toggleSidebar}
                      className="md:hidden p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                      aria-label="Close sidebar"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  
                  <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                      {[
                        { icon: <FiHome size={20} />, label: 'Dashboard', path: '/' },
                        { icon: <FiFileText size={20} />, label: 'Tasks', path: '/tasks' },
                        { icon: <FiBarChart2 size={20} />, label: 'Reports', path: '/reports' },
                        { icon: <FiUser size={20} />, label: 'My Profile', path: '/profile' }
                      ].map((item, index) => (
                        <li key={index}>
                          <Link 
                            to={item.path || '#'}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                              window.location.pathname === item.path 
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16">
                  <div className="container mx-auto px-4 sm:px-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route 
                        path="/tasks" 
                        element={
                          <div className="p-6 w-full">
                            <div className="flex justify-between items-center mb-6">
                              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => {
                                    setSelectedTask(null);
                                    setIsTaskFormOpen(true);
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                                  New Task
                                </button>
                                <button
                                  onClick={() => {
                                    // Handle import functionality
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FiUpload className="-ml-1 mr-2 h-4 w-4" />
                                  Import
                                </button>
                              </div>
                            </div>
                            <Tasks 
                              tasks={tasks} 
                              onEditTask={(task) => {
                                setSelectedTask(task);
                                setIsTaskFormOpen(true);
                              }}
                              onDeleteTask={handleDeleteTask}
                            />
                          </div>
                        } 
                      />
                      <Route path="/task-detail/:id" element={<TaskDetail />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/task-alerts" element={<TaskAlertsDemo />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/activity-logs" element={<ActivityLogsPage />} />
                      <Route path="/help" element={<div className="p-6">Help & Support</div>} />
                    </Routes>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
