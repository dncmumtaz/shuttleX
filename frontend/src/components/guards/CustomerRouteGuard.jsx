import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CustomerRouteGuard() {
  const { isAuthenticated, isCustomer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isCustomer) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
