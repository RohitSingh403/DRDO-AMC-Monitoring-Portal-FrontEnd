import React from 'react';
import { FiSun, FiCalendar, FiClock } from 'react-icons/fi';

const TaskCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'Daily Tasks',
      count: 12,
      icon: <FiSun className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      hoverBg: 'hover:bg-blue-50',
      darkBg: 'dark:bg-blue-900/30',
      darkBorder: 'dark:border-blue-800/50'
    },
    {
      id: 2,
      title: 'Weekly Tasks',
      count: 8,
      icon: <FiCalendar className="w-6 h-6" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      hoverBg: 'hover:bg-green-50',
      darkBg: 'dark:bg-green-900/30',
      darkBorder: 'dark:border-green-800/50'
    },
    {
      id: 3,
      title: 'Monthly Tasks',
      count: 5,
      icon: <FiClock className="w-6 h-6" />,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      hoverBg: 'hover:bg-amber-50',
      darkBg: 'dark:bg-amber-900/30',
      darkBorder: 'dark:border-amber-800/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`p-6 rounded-xl border ${category.bgColor} ${category.borderColor} ${category.hoverBg} ${category.darkBg} ${category.darkBorder} transition-all duration-200 cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${category.bgColor} ${category.textColor} ${category.darkBg} inline-flex`}>
              {category.icon}
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{category.count}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {category.count} tasks to complete
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full ${category.textColor.replace('text-', 'bg-')} ${category.darkBg}`}
              style={{ width: `${Math.min(100, (category.count / 15) * 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskCategories;
