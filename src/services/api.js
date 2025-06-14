import axios from 'axios';
import { getToken, clearAuth } from '../utils/auth';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized errors (token expired, invalid token, etc.)
    if (status === 401) {
      console.error('Authentication error:', data.message || 'Unauthorized');
      // Clear auth data and redirect to login
      clearAuth();
      window.location.href = '/login';
      return Promise.reject({ message: 'Your session has expired. Please log in again.' });
    }

    // Handle 403 Forbidden errors (insufficient permissions)
    if (status === 403) {
      console.error('Authorization error:', data.message || 'Forbidden');
      return Promise.reject({ 
        message: data.message || 'You do not have permission to perform this action.' 
      });
    }

    // Handle 404 Not Found errors
    if (status === 404) {
      console.error('Resource not found:', error.config.url);
      return Promise.reject({ 
        message: data.message || 'The requested resource was not found.' 
      });
    }

    // Handle 422 Validation errors
    if (status === 422 && data.errors) {
      // Format validation errors as a single message
      const errorMessages = Object.values(data.errors)
        .map(err => err.msg || err)
        .join('\n');
      
      console.error('Validation error:', errorMessages);
      return Promise.reject({ 
        message: errorMessages,
        errors: data.errors 
      });
    }

    // Handle 500 Server errors
    if (status >= 500) {
      console.error('Server error:', data.message || 'Internal server error');
      return Promise.reject({ 
        message: data.message || 'An unexpected error occurred. Please try again later.' 
      });
    }

    // For all other errors, return the error message from the server
    console.error('API error:', data.message || 'An error occurred');
    return Promise.reject({ 
      message: data.message || 'An error occurred while processing your request.' 
    });
  }
);

// Helper function to handle file uploads
export const uploadFile = async (url, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(progress);
      }
    },
  });

  return response;
};

// Helper function to download files
export const downloadFile = async (url, filename) => {
  const response = await api.get(url, {
    responseType: 'blob',
  });

  // Create a URL for the blob
  const blobUrl = window.URL.createObjectURL(new Blob([response]));
  
  // Create a temporary link element to trigger the download
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

// Export the configured axios instance
export default api;
