import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // No token - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Parse user info
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    // Invalid user data - clear and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  // Admin-only route but user is not admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  // All checks passed - render the protected component
  return children;
};

export default ProtectedRoute;
