import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../services/api';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/auth';

// Create auth context
const AuthContext = createContext(null);

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
      // Set auth token for API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token and user data
      setToken(token);
      setUser(user);
      setCurrentUser(user);
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the hook as default
export default useAuth;
