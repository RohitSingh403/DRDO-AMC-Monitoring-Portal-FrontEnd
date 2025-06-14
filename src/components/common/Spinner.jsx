import React from 'react';

/**
 * A loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the spinner (sm, md, lg)
 * @param {string} [props.color='primary'] - Color of the spinner
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} Spinner component
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
  };

  const colorClasses = {
    primary: 'border-t-primary-500 border-r-primary-500/30 border-b-primary-500/30 border-l-primary-500/30',
    white: 'border-t-white border-r-white/30 border-b-white/30 border-l-white/30',
    gray: 'border-t-gray-400 border-r-gray-400/30 border-b-gray-400/30 border-l-gray-400/30',
    red: 'border-t-red-500 border-r-red-500/30 border-b-red-500/30 border-l-red-500/30',
    green: 'border-t-green-500 border-r-green-500/30 border-b-green-500/30 border-l-green-500/30',
    blue: 'border-t-blue-500 border-r-blue-500/30 border-b-blue-500/30 border-l-blue-500/30',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${
        colorClasses[color] || colorClasses.primary
      } ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Spinner };
