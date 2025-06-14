import React from 'react';
import { Controller } from 'react-hook-form';
import { FiCalendar, FiClock, FiSun } from 'react-icons/fi';

const TaskTypeSelect = ({ control, name, label, options, error, ...props }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'daily':
        return <FiSun className="h-4 w-4 mr-2" />;
      case 'weekly':
        return <FiCalendar className="h-4 w-4 mr-2" />;
      case 'monthly':
        return <FiClock className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getTypeClasses = (type) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weekly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'monthly':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-colors ${
                  field.value === option.value
                    ? `${getTypeClasses(option.value)} border-blue-500`
                    : 'hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                />
                <div className="flex items-center">
                  {getIcon(option.value)}
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default TaskTypeSelect;
