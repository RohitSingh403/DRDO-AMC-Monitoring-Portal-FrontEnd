import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

const FormSelect = ({ label, name, control, options, required, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required && `${label} is required` }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            classNamePrefix="react-select"
            className={`react-select-container ${
              error ? 'react-select--error' : ''
            }`}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: error ? '#fca5a5' : '#d1d5db',
                '&:hover': {
                  borderColor: error ? '#f87171' : '#9ca3af',
                },
                backgroundColor: 'var(--bg-color)',
                minHeight: '42px',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? '#2563eb'
                  : isFocused
                  ? 'var(--hover-bg)'
                  : 'transparent',
                color: isSelected ? 'white' : 'var(--text-color)',
                '&:hover': {
                  backgroundColor: isSelected ? '#1d4ed8' : 'var(--hover-bg)',
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: 'var(--text-color)',
              }),
              input: (base) => ({
                ...base,
                color: 'var(--text-color)',
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#2563eb',
                primary25: '#dbeafe',
                neutral0: 'var(--bg-color)',
                neutral80: 'var(--text-color)',
              },
            })}
            {...props}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      <style jsx global>{`
        :root {
          --bg-color: #ffffff;
          --text-color: #111827;
          --hover-bg: #f3f4f6;
        }
        .dark {
          --bg-color: #1f2937;
          --text-color: #f3f4f6;
          --hover-bg: #374151;
        }
        .react-select__placeholder {
          color: #9ca3af !important;
        }
        .react-select__single-value {
          color: var(--text-color) !important;
        }
        .react-select__input input {
          color: var(--text-color) !important;
        }
      `}</style>
    </div>
  );
};

export default FormSelect;
