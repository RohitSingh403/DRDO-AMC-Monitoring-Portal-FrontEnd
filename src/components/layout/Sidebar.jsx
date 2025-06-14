import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart2, 
  Settings, 
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
  { icon: <ClipboardList size={20} />, label: 'Tasks', path: '/tasks' },
  { icon: <BarChart2 size={20} />, label: 'Reports', path: '/reports' },
  { icon: <Users size={20} />, label: 'Team', path: '/team' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg text-gray-700"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ 
          x: isMobileMenuOpen ? 0 : isOpen ? 0 : -250,
          width: isOpen ? '250px' : '80px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-700 to-blue-900 text-white z-50 shadow-2xl overflow-hidden ${
          isMobileMenuOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-blue-600">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold"
              >
                AMC Portal
              </motion.div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-blue-600 transition-colors"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <motion.li
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href={item.path}
                    onClick={() => {
                      setActiveItem(item.label);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeItem === item.label
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-100 hover:bg-blue-600 hover:bg-opacity-50'
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-blue-600">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                U
              </div>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-3"
                >
                  <div className="text-sm font-medium">User Name</div>
                  <div className="text-xs text-blue-200">Admin</div>
                </motion.div>
              )}
              <button className="ml-auto text-blue-200 hover:text-white">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
