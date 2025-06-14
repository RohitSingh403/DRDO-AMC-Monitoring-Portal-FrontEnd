/**
 * Application configuration
 * 
 * This file contains all the configuration variables used throughout the application.
 * For production, these values should be overridden by environment variables.
 */

// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Authentication configuration
export const AUTH_CONFIG = {
  // Token expiration time in minutes (default: 1 day)
  TOKEN_EXPIRY: import.meta.env.VITE_APP_TOKEN_EXPIRY || 1440,
  
  // Refresh token expiration time in days (default: 7 days)
  REFRESH_TOKEN_EXPIRY: import.meta.env.VITE_APP_REFRESH_TOKEN_EXPIRY || 7,
  
  // Cookie domain for auth cookies (set to your domain in production)
  COOKIE_DOMAIN: import.meta.env.VITE_APP_COOKIE_DOMAIN || 'localhost',
  
  // Cookie secure flag (should be true in production with HTTPS)
  COOKIE_SECURE: import.meta.env.PROD,
};

// File upload configuration
export const UPLOAD_CONFIG = {
  // Maximum file size in bytes (default: 10MB)
  MAX_FILE_SIZE: import.meta.env.VITE_APP_MAX_FILE_SIZE ? parseInt(import.meta.env.VITE_APP_MAX_FILE_SIZE) : 10 * 1024 * 1024,
  
  // Maximum number of files that can be uploaded at once (default: 5)
  MAX_FILES: import.meta.env.VITE_APP_MAX_FILES ? parseInt(import.meta.env.VITE_APP_MAX_FILES) : 5,
  
  // Allowed file types (MIME types or extensions with dot)
  ALLOWED_TYPES: [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    
    // Extensions (for browsers that don't provide MIME types)
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
    '.csv',
  ].join(','),
};

// Application settings
export const APP_CONFIG = {
  // Application name
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AMC Monitoring Portal',
  
  // Default page title
  DEFAULT_TITLE: import.meta.env.VITE_APP_DEFAULT_TITLE || 'AMC Monitoring Portal',
  
  // Default page description
  DEFAULT_DESCRIPTION: import.meta.env.VITE_APP_DEFAULT_DESCRIPTION || 
    'Asset Management and Compliance Monitoring Portal',
  
  // Default theme (light/dark/system)
  DEFAULT_THEME: import.meta.env.VITE_APP_DEFAULT_THEME || 'light',
  
  // Enable/disable features
  FEATURES: {
    REGISTRATION: import.meta.env.VITE_APP_FEATURE_REGISTRATION !== 'false',
    PASSWORD_RESET: import.meta.env.VITE_APP_FEATURE_PASSWORD_RESET !== 'false',
    EMAIL_VERIFICATION: import.meta.env.VITE_APP_FEATURE_EMAIL_VERIFICATION !== 'false',
    TWO_FACTOR_AUTH: import.meta.env.VITE_APP_FEATURE_TWO_FACTOR_AUTH === 'true',
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
};

// Feature flags (for enabling/disabling features without redeploying)
// These can be overridden by environment variables if needed
export const FEATURE_FLAGS = {
  ENABLE_TASKS: true,
  ENABLE_ATTACHMENTS: true,
  ENABLE_REPORTS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
};

// Export all config as default for easier importing
export default {
  API_BASE_URL,
  AUTH_CONFIG,
  UPLOAD_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
};
