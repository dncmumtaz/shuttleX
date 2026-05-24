import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith('/customer/search');

  const navItems = [
    { to: '/customer/search', label: t('booking.newReservation'), icon: '🚐' },
    { to: '/customer/trips', label: t('common.myTrips'), icon: '🚌' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`dashboard-root d-flex min-vh-100 ${isBookingPage ? 'dashboard-root--booking' : ''}`}>
      <aside className="dashboard-sidebar bg-dark text-white d-flex flex-column">
        <div className="sidebar-brand px-4 py-4 border-bottom border-secondary">
          <h1 className="h4 mb-0 fw-bold">ShuttleX</h1>
          <small className="text-secondary">{t('nav.customerPanel')}</small>
        </div>

        <nav className="nav flex-column px-3 py-3 gap-1 flex-grow-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link sidebar-link rounded px-3 py-2 ${isActive ? 'active' : ''}`
              }
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-top border-secondary">
          <small className="text-secondary d-block mb-1">{t('common.session')}</small>
          <div className="fw-semibold">
            {user?.firstName} {user?.lastName}
          </div>
          <small className="text-secondary">{user?.email}</small>
        </div>
      </aside>

      <div className="dashboard-main flex-grow-1 d-flex flex-column">
        {!isBookingPage && (
          <header className="dashboard-header bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div>
              <h2 className="h5 mb-0">{t('common.welcome', { name: user?.firstName })}</h2>
              <small className="text-muted">{t('nav.customerSubtitle')}</small>
            </div>
            <div className="dashboard-header-actions">
              <LanguageSwitcher />
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                {t('common.logout')}
              </button>
            </div>
          </header>
        )}

        <main className={`dashboard-content flex-grow-1 ${isBookingPage ? 'dashboard-content--booking' : 'p-4'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
