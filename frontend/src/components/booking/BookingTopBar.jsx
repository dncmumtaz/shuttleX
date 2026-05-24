import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import BookingStepper from './BookingStepper';

export default function BookingTopBar({ currentStep }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="booking-topbar">
      <div className="booking-topbar-row">
        <div className="booking-topbar-info">
          <h2 className="booking-topbar-title">
            {t('common.welcome', { name: user?.firstName })}
          </h2>
          <p className="booking-topbar-subtitle">{t('booking.pageSubtitle')}</p>
        </div>
        <div className="booking-topbar-actions">
          <LanguageSwitcher variant="dark" />
          <button type="button" className="btn btn-booking-logout btn-sm" onClick={handleLogout}>
            {t('common.logout')}
          </button>
        </div>
      </div>
      <BookingStepper currentStep={currentStep} />
    </header>
  );
}
