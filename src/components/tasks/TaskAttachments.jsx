import React, { useState, useCallback } from 'react';
import { FiPaperclip, FiDownload, FiTrash2, FiX } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth.jsx';
import FileUpload from '../common/FileUpload';
import { Button } from '../ui/button';
import { Spinner } from '../common/Spinner';
import { formatFileSize, formatDate } from '../../utils/format';
import api from '../../services/api';

const TaskAttachments = ({ attachments = [], onAttachmentsChange, canEdit = false }) => {
  const { taskId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (files) => {
    if (!taskId || !canEdit) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Call the parent component with the updated attachments
      onAttachmentsChange?.(response.data);
      
      enqueueSnackbar('Files uploaded successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error uploading files:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload files';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  }, [taskId, canEdit, onAttachmentsChange, enqueueSnackbar]);

  // Handle file download
  const handleDownload = useCallback(async (attachment) => {
    try {
      const response = await api.get(
        `/tasks/${taskId}/attachments/${attachment._id}/download`,
        { responseType: 'blob' }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      enqueueSnackbar('Failed to download file', { variant: 'error' });
    }
  }, [taskId, enqueueSnackbar]);

  // Handle file deletion
  const handleDelete = useCallback(async (attachment) => {
    if (!taskId || !canEdit) return;
    
    if (!window.confirm('Are you sure you want to delete this attachment?')) {
      return;
    }

    setIsDeleting(attachment._id);
    
    try {
      await api.delete(`/tasks/${taskId}/attachments/${attachment._id}`);
      
      // Call the parent component with the updated attachments
      const updatedAttachments = attachments.filter(a => a._id !== attachment._id);
      onAttachmentsChange?.(updatedAttachments);
      
      enqueueSnackbar('Attachment deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete attachment';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsDeleting(null);
    }
  }, [taskId, attachments, onAttachmentsChange, enqueueSnackbar, canEdit]);

  // Check if the current user is the uploader of the attachment
  const isUploader = (attachment) => {
    return user && attachment.uploadedBy && user._id === attachment.uploadedBy._id;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <FiPaperclip className="mr-2" /> Attachments
        </h3>
        {attachments.length > 0 && (
          <span className="text-sm text-gray-500">
            {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
          </span>
        )}
      </div>

      {/* File upload area */}
      {canEdit && (
        <div className="mb-6">
          <FileUpload
            label="Upload files"
            multiple={true}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <Spinner size="sm" className="mr-2" />
              Uploading files...
            </div>
          )}
        </div>
      )}

      {/* Attachments list */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment._id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center min-w-0">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md mr-3">
                  <FiPaperclip className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {attachment.filename}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                    <span>{formatFileSize(attachment.size)}</span>
                    <span>•</span>
                    <span>{formatDate(attachment.uploadedAt)}</span>
                    {attachment.uploadedBy && (
                      <>
                        <span>•</span>
                        <span>
                          {attachment.uploadedBy._id === user?._id
                            ? 'Uploaded by you'
                            : `Uploaded by ${attachment.uploadedBy.name || 'user'}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <FiDownload className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
                {canEdit && (isUploader(attachment) || user?.role === 'admin') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attachment)}
                    disabled={isDeleting === attachment._id}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                  >
                    {isDeleting === attachment._id ? (
                      <Spinner size="sm" />
                    ) : (
                      <FiTrash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <FiPaperclip className="mx-auto h-10 w-10 text-gray-400" />
          <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No attachments</h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {canEdit 
              ? 'Upload files by dragging and dropping or clicking the upload area above.'
              : 'No files have been attached to this task.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;
