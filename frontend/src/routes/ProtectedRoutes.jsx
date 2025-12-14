import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  // ⛔ Never return null here
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed
  return children;
}
