import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, X, Moon, Sun, Activity, LogOut, User, Settings, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MuiMenu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider as MuiDivider,
  Typography,
  Box,
  Avatar 
} from '@mui/material';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New report generated', time: '10 min ago', read: false },
    { id: 2, text: 'Task completed successfully', time: '1 hour ago', read: true },
    { id: 3, text: 'System update available', time: '2 days ago', read: true },
  ]);
  
  const { user, isAuthenticated, logout } = useAuthContext();
  
  // Default user for guest users
  const currentUser = isAuthenticated && user ? user : {
    name: 'Guest User',
    email: 'guest@example.com',
    avatar: 'G',
    role: 'guest'
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleActivityLogClick = () => {
    handleMenuClose();
    navigate('/activity-logs');
  };
  
  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };
  
  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.header 
      className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-white dark:bg-gray-900'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button (hidden on md and up) */}
          <div className="md:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Center - Search bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right side - Navigation items */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform -translate-y-1/2 translate-x-1/2 bg-red-500 rounded-full"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="ml-2">
              <button
                onClick={handleMenuOpen}
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="relative">
                  <Avatar 
                    className="h-8 w-8 bg-blue-600 text-white"
                    alt={currentUser.name}
                    src={currentUser.avatar}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {currentUser.role === 'admin' && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      A
                    </span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline-block">
                  {currentUser.name}
                </span>
              </button>
              
              {/* User Dropdown Menu */}
              <MuiMenu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    width: 240,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <div className="flex items-center">
                    <Avatar 
                      className="bg-blue-600 text-white mr-2"
                      alt={currentUser.name}
                      src={currentUser.avatar}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography variant="subtitle2" className="font-medium">
                        {currentUser.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    {currentUser.email}
                  </Typography>
                </Box>
                <MuiDivider />
                
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <User className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText>My Profile</ListItemText>
                </MenuItem>
                
                <MenuItem onClick={handleActivityLogClick}>
                  <ListItemIcon>
                    <Activity className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText>Activity Logs</ListItemText>
                </MenuItem>
                
                {currentUser.role === 'admin' && (
                  <>
                    <MuiDivider />
                    <Box sx={{ px: 2, py: 0.5 }}>
                      <Typography variant="caption" className="text-gray-500 uppercase text-xs font-medium">
                        Admin
                      </Typography>
                    </Box>
                    <MenuItem onClick={() => navigate('/admin/users')}>
                      <ListItemIcon>
                        <Users className="h-5 w-5" />
                      </ListItemIcon>
                      <ListItemText>Manage Users</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/settings')}>
                      <ListItemIcon>
                        <Settings className="h-5 w-5" />
                      </ListItemIcon>
                      <ListItemText>System Settings</ListItemText>
                    </MenuItem>
                  </>
                )}
                
                <MuiDivider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogOut className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </MuiMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search (shown only on mobile) */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search..."
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
