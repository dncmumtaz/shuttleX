import { Navigate, Route, Routes } from 'react-router-dom';
import CustomerRouteGuard from './components/guards/CustomerRouteGuard';
import DriverRouteGuard from './components/guards/DriverRouteGuard';
import DashboardLayout from './components/layout/DashboardLayout';
import DriverDashboardLayout from './components/layout/DriverDashboardLayout';
import HomeRedirect from './components/routing/HomeRedirect';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookingWizard from './pages/customer/BookingWizard';
import MyTrips from './pages/customer/MyTrips';
import DriverRequests from './pages/driver/DriverRequests';
import DriverTrips from './pages/driver/DriverTrips';
import DriverVehicleServices from './pages/driver/DriverVehicleServices';
import VehicleSettings from './pages/driver/VehicleSettings';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<CustomerRouteGuard />}>
        <Route path="/customer" element={<DashboardLayout />}>
          <Route index element={<Navigate to="search" replace />} />
          <Route path="search" element={<BookingWizard />} />
          <Route path="trips" element={<MyTrips />} />
        </Route>
      </Route>

      <Route element={<DriverRouteGuard />}>
        <Route path="/driver" element={<DriverDashboardLayout />}>
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="requests" element={<DriverRequests />} />
          <Route path="vehicle-settings" element={<VehicleSettings />} />
          <Route path="vehicle-services" element={<DriverVehicleServices />} />
          <Route path="trips" element={<DriverTrips />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
