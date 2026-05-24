import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { getHomeRouteByRole } from '../../utils/authUtils';

export default function Login() {
  const { t } = useTranslation();
  const { login, loading, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  if (isAuthenticated && user?.role) {
    return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  }

  const handleChange = (e) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await login(form.email, form.password);
      const defaultRoute = getHomeRouteByRole(loggedInUser.role);
      const redirectTo = location.state?.from?.pathname || defaultRoute;
      navigate(redirectTo, { replace: true });
    } catch {
      // error AuthContext'te tutulur
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 position-relative">
      <div className="auth-language-bar">
        <LanguageSwitcher />
      </div>

      <div className="card auth-card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">ShuttleX</h1>
            <p className="text-muted mb-0">{t('common.signInToAccount')}</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                {t('common.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@shuttlex.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                {t('common.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? t('common.loggingIn') : t('common.login')}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            {t('common.noAccount')}{' '}
            <Link to="/register">{t('common.signUpLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
