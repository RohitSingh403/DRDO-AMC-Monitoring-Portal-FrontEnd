import React from 'react';

const FormInput = ({ label, name, register, required, error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      {...register(name, { required: required && `${label} is required` })}
      className={`block w-full px-3 py-2 border ${
        error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

export default FormInput;
