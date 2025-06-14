import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiPlus, FiUpload, FiFileText, FiCalendar, FiClock, 
  FiUser, FiAlertCircle, FiCheck, FiTrash2, FiEdit2, FiChevronDown, 
  FiChevronUp, FiPaperclip, FiTag, FiCheckCircle, FiXCircle, 
  FiExternalLink, FiLoader
} from 'react-icons/fi';
import { format } from 'date-fns';

const EnhancedTaskForm = ({ isOpen, onClose, onSubmit, task, existingTasks = [] }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors }, clearErrors, setError } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const modalRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
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
  const handleFormSubmit = async (data) => {
    if (isDuplicateTitle(data.title, task?.id)) {
      setError('title', {
        type: 'manual',
        message: 'A task with this title already exists',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dueDateTime = new Date(data.dueDate);
      if (data.dueTime) {
        const [hours, minutes] = data.dueTime.split(':');
        dueDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      }
      
      const result = await onSubmit({
        ...data,
        dueDate: dueDateTime.toISOString(),
        estimatedTime: Number(data.estimatedTime) || 1,
        attachments
      });

      if (result?.success) {
        reset();
        onClose();
      } else if (result?.error) {
        if (result.error.includes('title')) {
          setError('title', {
            type: 'manual',
            message: result.error,
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Reset form when task prop changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        const formData = { 
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register('description')}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register('dueDate', { required: 'Due date is required' })}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register('dueTime')}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
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
                  className="space-y-4 pt-2"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Estimated Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Time (hours)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        {...register('estimatedTime')}
                      />
                    </div>

                    {/* Assigned To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Assigned To
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        {...register('assignedTo')}
                      >
                        <option value="">Unassigned</option>
                        <option value="user1">User 1</option>
                        <option value="user2">User 2</option>
                        <option value="user3">User 3</option>
                      </select>
                    </div>
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
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleFileUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Attachments list */}
                    {attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Attached files:
                        </p>
                        <ul className="space-y-2">
                          {attachments.map((file) => (
                            <li
                              key={file.id}
                              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                            >
                              <div className="flex items-center space-x-2">
                                <FiFileText className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(file.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedTaskForm;
