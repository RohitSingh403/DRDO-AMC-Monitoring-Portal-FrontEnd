import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FormDatePicker = ({ label, name, control, required, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      control={control}
      name={name}
      rules={{ required: required && `${label} is required` }}
      render={({ field: { onChange, onBlur, value } }) => (
        <DatePicker
          selected={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
          dateFormat="MMMM d, yyyy"
          showTimeSelect={false}
          placeholderText="Select date"
          {...props}
        />
      )}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
);

export default FormDatePicker;
