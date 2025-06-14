import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiUpload, FiX, FiCalendar } from 'react-icons/fi';
import TaskTypeSelect from './TaskTypeSelect';
import FormInput from '../../common/FormInput';
import FormTextarea from '../../common/FormTextarea';
import FormDatePicker from '../../common/FormDatePicker';
import FormDateTimePicker from '../../common/FormDateTimePicker';
import FormSelect from '../../common/FormSelect';
import FileUpload from '../../common/FileUpload';
import { useAuth } from '../../../hooks/useAuth';

const TaskForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      ...initialData,
      scheduledFor: initialData.scheduledFor || null,
    },
  });
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const taskTypes = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const assignees = [
    { value: 'john', label: 'John Doe' },
    { value: 'jane', label: 'Jane Smith' },
    { value: 'bob', label: 'Bob Johnson' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Task Title"
          name="title"
          placeholder="Enter task title"
          register={register}
          required
          error={errors.title}
        />

        <TaskTypeSelect
          label="Task Type"
          name="type"
          control={control}
          options={taskTypes}
          required
          error={errors.type}
        />

        <div className="space-y-4">
          <FormDatePicker
            label="Due Date"
            name="dueDate"
            control={control}
            required
            error={errors.dueDate}
          />
          
          {isAdmin && (
            <FormDateTimePicker
              label="Schedule For (Optional)"
              name="scheduledFor"
              control={control}
              minDate={new Date()}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date and time to schedule this task"
              error={errors.scheduledFor}
            />
          )}
        </div>

        <FormSelect
          label="Assign To"
          name="assignedTo"
          control={control}
          options={assignees}
          required
          error={errors.assignedTo}
        />
      </div>

      <FormTextarea
        label="Description"
        name="description"
        placeholder="Enter task description"
        register={register}
        rows={4}
        error={errors.description}
      />

      <FileUpload
        label="Attachments"
        name="attachment"
        register={register}
        onChange={handleFileChange}
        preview={preview}
        onRemove={() => setPreview(null)}
        accept="image/*"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="-ml-1 mr-2 h-4 w-4" />
          Create Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
