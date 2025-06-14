import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

// Simple ID generator for client-side use
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
// Commonly used icons
import {
  FiX, FiPlus, FiUpload, FiFileText, FiCalendar,
  FiClock, FiUser, FiAlertCircle, FiCheck, FiTrash2, FiEdit2,
  FiChevronDown, FiChevronUp, FiPaperclip, FiTag, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiExternalLink, FiLoader
} from 'react-icons/fi';
import { format } from 'date-fns';

const EnhancedTaskForm = ({ isOpen, onClose, onSubmit, task, existingTasks = [] }) => {
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors }, clearErrors, setError } = useForm({
    defaultValues: {
      id: null,
      title: '',
      description: '',
      type: 'general',
      priority: 'medium',
      dueDate: new Date(),
      dueTime: '12:00',
      assignedTo: '',
      status: 'pending',
      estimatedTime: 1,
      attachments: []
    },
    mode: 'onChange'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const modalRef = useRef(null);

  // Task types with icons
  const taskTypes = [
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'inspection', label: 'Inspection', icon: '🔍' },
    { value: 'repair', label: 'Repair', icon: '🛠️' },
    { value: 'installation', label: 'Installation', icon: '⚙️' },
    { value: 'safety', label: 'Safety Check', icon: '⚠️' },
    { value: 'general', label: 'General', icon: '📝' },
  ];

  // Priority options
  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  // Status options
  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  // Mock users - replace with actual API call
  const assignees = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Technician' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Supervisor' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
      preview: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Handle file removal
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  // Check if task title is a duplicate
  const isDuplicateTitle = (title, currentId = null) => {
    return existingTasks.some(task => 
      task.title.toLowerCase() === title.toLowerCase() && 
      (!currentId || task.id !== currentId)
    );
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    if (isDuplicateTitle(data.title, task?.id)) {
      setError('title', {
        type: 'manual',
        message: 'A task with this title already exists',
      });
      return;
    }

    // Format the due date and time
    let dueDate = data.dueDate;
    if (data.dueTime) {
      const [hours, minutes] = data.dueTime.split(':');
      const date = new Date(dueDate);
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      dueDate = date.toISOString();
    }

    const taskData = {
      ...data,
      dueDate,
      // Let the parent component handle ID generation for new tasks
      // This ensures IDs are unique across the application
      id: task?.id,
      attachments: attachments,
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(taskData);
      onClose();
      setIsSubmitting(false);
    }, 500);
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClick = (e) => {
      // Only close if clicking on the overlay (semi-transparent background)
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
      // Re-enable body scroll when modal closes
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Reset form when task prop changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Convert task data to form format
        const formData = { 
          ...task,
          // Format date for date input
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Format time for time input if needed
          dueTime: task.dueDate ? format(new Date(task.dueDate), 'HH:mm') : '12:00'
        };
        reset(formData);
      } else {
        reset({
          title: '',
          description: '',
          type: 'general',
          priority: 'medium',
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: '12:00',
          assignedTo: '',
          status: 'pending',
          estimatedTime: 1,
          attachments: []
        });
      }
      clearErrors();
    }
  }, [task, isOpen, reset, clearErrors]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fixed inset-0" onClick={onClose}></div>
          
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-2xl mx-auto my-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {task ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="title"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.title 
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 pr-10' 
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        }`}
                        placeholder="Enter task title"
                        {...register('title', { 
                          required: 'Title is required',
                          validate: (value) => {
                            if (isDuplicateTitle(value, watch('id'))) {
                              return 'A task with this title already exists';
                            }
                            return true;
                          },
                          minLength: {
                            value: 3,
                            message: 'Title must be at least 3 characters',
                          },
                          maxLength: {
                            value: 100,
                            message: 'Title cannot exceed 100 characters',
                          },
                        })}
                        onFocus={() => clearErrors('title')}
                      />
                      {errors.title ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiX className="h-5 w-5 text-red-500" />
                        </div>
                      ) : watch('title')?.length > 0 ? (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiCheck className="h-5 w-5 text-green-500" />
                        </div>
                      ) : null}
                    </div>
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Task Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="type"
                        {...register('type', { required: 'Task type is required' })}
                        className={`block w-full pl-3 pr-10 py-2 border ${
                          errors.type ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none`}
                      >
                        {taskTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {priorities.map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            watch('priority') === priority.value
                              ? `${priority.color} ring-2 ring-offset-1 ring-blue-500`
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => setValue('priority', priority.value, { shouldValidate: true })}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('status', { required: 'Status is required' })}
                        className={`block w-full pl-3 pr-10 py-2 border ${
                          errors.status ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none`}
                      >
                        {statuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task description..."
                />
              </div>

              {/* Advanced Options */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-2"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? (
                    <>
                      <FiChevronUp className="mr-1 h-4 w-4" />
                      Hide Advanced Options
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="mr-1 h-4 w-4" />
                      Show Advanced Options
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiCalendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="datetime-local"
                              id="dueDate"
                              {...register('dueDate')}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Assign To
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              id="assignedTo"
                              {...register('assignedTo')}
                              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                            >
                              <option value="">Select assignee</option>
                              {assignees.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name} ({user.role})
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <FiChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Estimated Time (hours)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiClock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="estimatedTime"
                              min="0.5"
                              step="0.5"
                              {...register('estimatedTime', { min: 0.5 })}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="e.g. 2.5"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, PDF, DOC, XLS up to 10MB
                    </p>
                  </div>
                </div>

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            {attachment.type === 'image' ? (
                              <FiImage className="h-5 w-5 text-blue-500" />
                            ) : (
                              <FiFile className="h-5 w-5 text-gray-500" />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {attachment.size} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {task ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    {task ? 'Update Task' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedTaskForm;
