import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DriverRouteGuard() {
  const { isAuthenticated, isDriver } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isDriver) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
