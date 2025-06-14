import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} [props.allowedRoles] - Array of allowed role names (default: ['admin'])
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required (default: true)
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({
  children,
  allowedRoles = ['admin'],
  requireAuth = true,
}) => {
  const { isAuthenticated, user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = user && allowedRoles.includes(user.role);

  // If role is required but user doesn't have it, show unauthorized
  if (requireAuth && !hasRequiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;
