import React, { useRef, useState, useCallback, useEffect } from 'react';
import { FiUpload, FiX, FiFile, FiImage, FiFileText } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const FileUpload = ({
  label = 'Upload files',
  name = 'files',
  multiple = true,
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt',
  maxFiles = MAX_FILES,
  maxSize = MAX_FILE_SIZE,
  value = [],
  onChange,
  onError,
  disabled = false,
  className = '',
  ...props
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState(value || []);
  const [errors, setErrors] = useState([]);

  // Get file icon based on MIME type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FiImage className="h-5 w-5 text-blue-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FiFileText className="h-5 w-5 text-red-500" />;
    }
    if (file.type.includes('word') || file.type.includes('document')) {
      return <FiFileText className="h-5 w-5 text-blue-600" />;
    }
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return <FiFileText className="h-5 w-5 text-green-600" />;
    }
    return <FiFile className="h-5 w-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    const newErrors = [];
    
    // Check file size
    if (file.size > maxSize) {
      newErrors.push(`File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`);
    }
    
    // Check file type if accept prop is provided
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return fileName.endsWith(type);
        } else if (type.endsWith('/*')) {
          // Check MIME type group (e.g., image/*)
          const group = type.split('/')[0];
          return fileType.startsWith(group);
        } else {
          // Exact MIME type match
          return fileType === type;
        }
      });
      
      if (!isAccepted) {
        newErrors.push(`File type not supported: ${file.name}`);
      }
    }
    
    return newErrors;
  };

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    let allErrors = [];
    const validFiles = [];
    
    // Check if adding these files would exceed the maximum allowed
    if (files.length + newFiles.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed`;
      setErrors([error]);
      onError?.([error]);
      return;
    }

    // Process each file
    newFiles.forEach(file => {
      const fileErrors = validateFile(file);
      
      if (fileErrors.length > 0) {
        allErrors = [...allErrors, ...fileErrors];
      } else {
        // Add unique ID to track the file
        const fileWithId = Object.assign(file, {
          id: uuidv4(),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        });
        validFiles.push(fileWithId);
      }
    });

    // Update state with new files and errors
    if (allErrors.length > 0) {
      setErrors(allErrors);
      onError?.(allErrors);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    }
    
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [files, maxFiles, maxSize, accept, onChange, onError]);

  // Handle file removal
  const handleRemove = useCallback((fileId, e) => {
    if (e) e.stopPropagation();
    
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      const updatedFiles = prevFiles.filter(f => f.id !== fileId);
      onChange?.(updatedFiles);
      return updatedFiles;
    });
    
    // Clear errors when removing files
    if (errors.length > 0) {
      setErrors([]);
      onError?.([]);
    }
  }, [onChange, errors, onError]);

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      // Create a fake event to reuse the file change handler
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      };
      handleFileChange(event);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Update files when value prop changes
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(files)) {
      setFiles(value);
    }
  }, [value, files]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div 
        className={`mt-1 flex flex-col rounded-lg border-2 border-dashed ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        } overflow-hidden transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4 text-center">
          <div className="flex justify-center">
            <FiUpload className={`h-10 w-10 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <label 
              htmlFor={name}
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload files</span>
              <input
                id={name}
                ref={fileInputRef}
                name={name}
                type="file"
                className="sr-only"
                multiple={multiple}
                accept={accept}
                onChange={handleFileChange}
                disabled={disabled || (maxFiles > 0 && files.length >= maxFiles)}
                {...props}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept ? `Accepted formats: ${accept}` : 'Any file type'}
            {maxSize > 0 && ` • Max size: ${formatFileSize(maxSize)}`}
            {maxFiles > 0 && ` • Max files: ${maxFiles}`}
          </p>
        </div>
        
        {/* Uploaded files preview */}
        {files.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2">
            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id || file.name}
                  className="group flex items-center justify-between rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                          {getFileIcon(file)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(file.id || file.name, e)}
                    className="invisible group-hover:visible text-gray-400 hover:text-red-500 focus:outline-none"
                    disabled={disabled}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            {maxFiles > 0 && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                {files.length} of {maxFiles} files
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Error messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
