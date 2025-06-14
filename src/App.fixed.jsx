import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  FiRefreshCw
} from 'react-icons/fi';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router>
      <div className={`flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    fixed md:relative w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white 
                    transition-transform duration-300 ease-in-out flex flex-col h-full z-20`}
        >
          <div className="p-4 flex items-center justify-between border-b border-blue-500/20 h-16">
            <h1 className="text-2xl font-bold text-white">AMC Portal</h1>
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-1.5 rounded-md hover:bg-blue-700/50 text-white transition-colors"
              aria-label="Close sidebar"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {[
                { icon: <FiHome size={20} />, label: 'Dashboard', path: '/' },
                { icon: <FiFileText size={20} />, label: 'Tasks', path: '/tasks' },
                { icon: <FiUsers size={20} />, label: 'Clients' },
                { icon: <FiFileText size={20} />, label: 'Contracts' },
                { icon: <FiPieChart size={20} />, label: 'Analytics' },
                { icon: <FiCalendar size={20} />, label: 'Calendar' },
                { icon: <FiMessageSquare size={20} />, label: 'Messages' },
              ].map((item, index) => (
                <li key={item.label}>
                  <Link 
                    to={item.path || '#'} 
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      index === 0 
                        ? 'bg-blue-700/30 text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-blue-700/30 hover:shadow-md'
                    } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto pt-4 border-t border-blue-500/20 mx-2">
              <Link 
                to="#" 
                className="flex items-center p-3 text-blue-100 hover:bg-blue-700/30 rounded-lg transition-all"
              >
                <FiSettings className="flex-shrink-0" size={20} />
                {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
              </Link>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <header className="bg-white dark:bg-gray-800 shadow-sm z-10 h-16 flex items-center px-6 sticky top-0">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 mr-4"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={20} />
            </button>
            <div className="flex-1 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search..."
                  />
                </div>
                
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                
                <div className="relative">
                  <button 
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative"
                    aria-label="Notifications"
                  >
                    <FiBell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                    JD
                  </div>
                  {sidebarOpen && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Admin</span>
                    </div>
                  )}
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto w-full bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-full px-0">
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<Tasks />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id" element={<TaskDetail />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
