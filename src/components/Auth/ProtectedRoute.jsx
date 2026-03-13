import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

// Route guard component that redirects unauthenticated users to the login page
// Renders child routes via Outlet only when a valid JWT token exists
function ProtectedRoute() {
  const { token, loading } = useAuth();

  // Show loading spinner while checking auth state on initial load
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if no JWT token is present
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected child routes
  return <Outlet />;
}

export default ProtectedRoute;
