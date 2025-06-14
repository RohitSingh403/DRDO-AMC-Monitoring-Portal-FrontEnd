import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiClock } from 'react-icons/fi';

const FormDateTimePicker = ({
  name,
  control,
  label,
  placeholderText,
  error,
  minDate,
  showTimeSelect = true,
  timeFormat = 'HH:mm',
  timeIntervals = 15,
  dateFormat = 'MMMM d, yyyy h:mm aa',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(date) => onChange(date)}
              className={`block w-full pl-10 pr-3 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholderText={placeholderText}
              minDate={minDate}
              showTimeSelect={showTimeSelect}
              timeFormat={timeFormat}
              timeIntervals={timeIntervals}
              dateFormat={dateFormat}
              timeCaption="Time"
              {...props}
            />
          </div>
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormDateTimePicker;
