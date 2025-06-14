import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiEdit2,
  FiImage,
  FiSend,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiCamera,
  FiPaperclip,
  FiTrash2,
  FiDownload
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../hooks/useAuth.jsx';
import FileUpload from '../components/common/FileUpload';
import TaskAttachments from '../components/tasks/TaskAttachments';
import api from '../services/api';

const TaskDetail = ({ match }) => {
  const taskId = match.params.id;
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [taskRemarks, setTaskRemarks] = useState([
    {
      id: 1,
      content: 'Facing issues with API integration. Need to check with the backend team.',
      timestamp: '2025-06-10T14:30:00',
      user: 'JD',
      status: 'open'
    }
  ]);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch task data from API
  const fetchTask = useCallback(async () => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      setTask(response.data);
      setSelectedStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching task:', error);
      enqueueSnackbar('Failed to load task details', { variant: 'error' });
      navigate('/tasks');
    }
  }, [taskId, enqueueSnackbar, navigate]);

  // Initial data fetch
  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Handle task update
  const handleTaskUpdate = useCallback(async (updatedData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updatedData);
      setTask(prev => ({ ...prev, ...response.data }));
      enqueueSnackbar('Task updated successfully', { variant: 'success' });
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      throw error;
    }
  }, [taskId, enqueueSnackbar]);

  // Handle attachments change
  const handleAttachmentsChange = async (updatedAttachments) => {
    try {
      await handleTaskUpdate({ attachments: updatedAttachments });
    } catch (error) {
      console.error('Error updating attachments:', error);
    }
  };

  // Sample task data - in a real app, this would come from an API
  useEffect(() => {
    const sampleTask = {
      id: taskId,
      title: 'Complete Dashboard Design',
      description: 'Design and implement the new dashboard layout with all required features',
      status: 'in-progress',
      priority: 'high',
      type: 'daily',
      assignee: user ? { _id: user._id, name: user.name } : { _id: '1', name: 'JD' },
      dueDate: '2025-06-15',
      createdAt: '2025-06-10',
      attachments: [],
      comments: [
        {
          id: 1,
          user: 'JD',
          content: 'Started working on the dashboard layout',
          timestamp: '2025-06-10T10:00:00',
          image: null
        }
      ]
    };
    setTask(sampleTask);
    setComments(sampleTask.comments);
    setSelectedStatus(sampleTask.status);
  }, [taskId]);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    
    try {
      await handleTaskUpdate({ status: newStatus });
    } catch (error) {
      // Revert on error
      setSelectedStatus(task.status);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: 'JD',
      content: newComment,
      timestamp: new Date().toISOString(),
      image: previewImage || null
    };

    setComments(prev => [...prev, newComment]);
    setNewComment('');
    setPreviewImage(null);
    setIsImageUploading(false);
  };

  const handleImageUpload = (file) => {
    setIsImageUploading(true);
    // In a real app, you would upload the file here
    // For now, we'll just store the file URL
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    const newRemark = {
      id: Date.now(),
      content: remarks,
      timestamp: new Date().toISOString(),
      user: 'JD', // In a real app, this would be the current user
      status: 'open'
    };

    setTaskRemarks(prev => [newRemark, ...prev]);
    setRemarks('');
  };

  const handleResolveRemark = (remarkId) => {
    setTaskRemarks(prev => 
      prev.map(remark => 
        remark.id === remarkId 
          ? { ...remark, status: 'resolved', resolvedAt: new Date().toISOString() } 
          : remark
      )
    );
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-full px-6 py-6 space-y-6">
      {/* Task Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {isEditing ? <FiCheck className="h-5 w-5" /> : <FiEdit2 className="h-5 w-5" />}
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiImage className="-ml-1 mr-2 h-4 w-4" />
            Add Attachment
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{task.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status</h3>
            {isEditing ? (
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md sm:text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} className={option.color}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusOptions.find(s => s.value === task.status).color
              }`}>
                {task.status.replace('-', ' ')}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Priority</h3>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {task.priority}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned To</h3>
            <div className="mt-1 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {task.assignee}
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{task.assignee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <TaskAttachments 
          attachments={task.attachments || []} 
          onAttachmentsChange={handleAttachmentsChange}
          canEdit={!task.completed && (user?.role === 'admin' || user?._id === task.assignee?._id)}
        />
      </div>

      {/* Remarks & Issues Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remarks & Issues</h3>
          
          {/* Add New Remark */}
          <form onSubmit={handleAddRemark} className="space-y-3">
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add Remark/Issue
              </label>
              <textarea
                id="remarks"
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe any issues, blockers, or additional remarks..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Remark
            </button>
          </form>

          {/* Remarks List */}
          <div className="mt-6 space-y-4">
            {taskRemarks.map(remark => (
              <div 
                key={remark.id} 
                className={`p-4 rounded-lg border ${
                  remark.status === 'resolved' 
                    ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
                    : 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800/50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                      {remark.user}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {remark.user}
                    </span>
                    {remark.status === 'resolved' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Resolved
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(remark.timestamp).toLocaleString()}
                    {remark.resolvedAt && (
                      <span className="block text-xs text-gray-400 dark:text-gray-500">
                        Resolved: {new Date(remark.resolvedAt).toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {remark.content}
                </p>
                {remark.status === 'open' && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleResolveRemark(remark.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comments</h3>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {comment.user}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{comment.user}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                {comment.image && (
                  <div className="mt-2">
                    <img 
                      src={comment.image} 
                      alt="Comment attachment"
                      className="max-w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2.5 pr-10 text-sm text-gray-900 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <FiSend className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <FileUpload
                onUpload={handleImageUpload}
                isUploading={isImageUploading}
                previewImage={previewImage}
                icon={<FiCamera className="h-5 w-5" />}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
