/**
 * Authentication utility functions for managing user sessions and tokens
 */

// Default user object structure
const defaultUser = {
  id: null,
  email: '',
  name: '',
  role: 'user',
  permissions: [],
  avatar: '',
  isEmailVerified: false
};

// Key names for localStorage
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

/**
 * Save the authentication token to localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // Update axios default headers
      if (typeof window !== 'undefined') {
        import('../services/api').then(({ default: api }) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        });
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      if (typeof window !== 'undefined') {
        import('../services/api').then(({ default: api }) => {
          delete api.defaults.headers.common['Authorization'];
        });
      }
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save the refresh token to localStorage
 * @param {string} refreshToken - Refresh token
 */
export const setRefreshToken = (refreshToken) => {
  try {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error setting refresh token:', error);
  }
};

/**
 * Get the refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 * @param {Object} user - User data object
 * @returns {Promise<void>}
 */
export const setUser = async (user) => {
  try {
    if (user) {
      // Ensure we have all required user fields with defaults
      const userData = { ...defaultUser, ...user };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.error('Error setting user data:', error);
    throw error;
  }
};

/**
 * Get user data from localStorage
 * @returns {Object} User data object (with defaults if not found)
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? { ...defaultUser, ...JSON.parse(userData) } : { ...defaultUser };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { ...defaultUser };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user has a specific role
 * @param {string|Array} roles - Role or array of roles to check
 * @returns {boolean} True if user has the required role(s)
 */
export const hasRole = (roles) => {
  const user = getUser();
  if (!user || !user.role) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * Check if user has any of the specified permissions
 * @param {string|Array} permissions - Permission or array of permissions to check
 * @returns {boolean} True if user has any of the specified permissions
 */
export const hasAnyPermission = (permissions) => {
  const user = getUser();
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
  
  const userPermissions = user.permissions;
  
  if (Array.isArray(permissions)) {
    return permissions.some(permission => userPermissions.includes(permission));
  }
  
  return userPermissions.includes(permissions);
};

/**
 * Check if user has all of the specified permissions
 * @param {string|Array} permissions - Permission or array of permissions to check
 * @returns {boolean} True if user has all of the specified permissions
 */
export const hasAllPermissions = (permissions) => {
  const user = getUser();
  if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
  
  const userPermissions = user.permissions;
  
  if (Array.isArray(permissions)) {
    return permissions.every(permission => userPermissions.includes(permission));
  }
  
  return userPermissions.includes(permissions);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Clear axios default headers
    if (typeof window !== 'undefined') {
      const api = require('../services/api').default;
      delete api.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Set up authentication with tokens and user data
 * @param {string} token - JWT token
 * @param {string} refreshToken - Refresh token
 * @param {Object} user - User data object
 */
export const setupAuth = (token, refreshToken, user) => {
  setToken(token);
  setRefreshToken(refreshToken);
  setUser(user);
};

export default {
  setToken,
  getToken,
  setRefreshToken,
  getRefreshToken,
  setUser,
  getUser,
  isAuthenticated,
  hasRole,
  hasAnyPermission,
  hasAllPermissions,
  clearAuth,
  setupAuth,
};
