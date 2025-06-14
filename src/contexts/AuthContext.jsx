import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/auth';

// Create the auth context
export const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    
    if (token && user) {
      setCurrentUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Make API call to login endpoint
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Store token and user data
      await setToken(token);
      await setUser(user);
      setCurrentUser(user);
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Show success message
      enqueueSnackbar('Login successful!', { variant: 'success' });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  // Logout function
  const logout = () => {
    // Clear auth data
    clearAuth();
    setCurrentUser(null);
    delete api.defaults.headers.common['Authorization'];
    
    // Redirect to login page
    navigate('/login');
    
    // Show success message
    enqueueSnackbar('You have been logged out.', { variant: 'info' });
  };

  // Update user data
  const updateUser = (userData) => {
    setCurrentUser(prev => ({
      ...prev,
      ...userData
    }));
    setUser({ ...currentUser, ...userData });
  };

  // Check if user has required role(s)
  const hasRole = (roles) => {
    if (!currentUser?.role) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    
    return currentUser.role === roles;
  };

  // Check if user has any of the required permissions
  const hasAnyPermission = (permissions) => {
    if (!currentUser?.permissions?.length) return false;
    
    if (Array.isArray(permissions)) {
      return permissions.some(permission => 
        currentUser.permissions.includes(permission)
      );
    }
    
    return currentUser.permissions.includes(permissions);
  };

  // Check if user has all required permissions
  const hasAllPermissions = (permissions) => {
    if (!currentUser?.permissions?.length) return false;
    
    if (Array.isArray(permissions)) {
      return permissions.every(permission => 
        currentUser.permissions.includes(permission)
      );
    }
    
    return currentUser.permissions.includes(permissions);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!getToken();
  };

  // Value to be provided by context
  const value = {
    user: currentUser,
    isAuthenticated: isAuthenticated(),
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default { AuthContext, AuthProvider, useAuthContext };
