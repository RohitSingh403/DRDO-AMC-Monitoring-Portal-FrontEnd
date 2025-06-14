import React from 'react';
import { FiMenu, FiBell, FiUser, FiSearch } from 'react-icons/fi/index';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 left-64 bg-white shadow-sm z-10 transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="relative mx-4 lg:mx-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </span>
            <input
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
            <FiBell className="h-6 w-6" />
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <span className="ml-2 text-gray-700">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
