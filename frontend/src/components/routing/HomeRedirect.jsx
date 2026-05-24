import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteByRole } from '../../utils/authUtils';

export default function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomeRouteByRole(user?.role)} replace />;
}
