import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { getHomeRouteByRole } from '../../utils/authUtils';

export default function Register() {
  const { t } = useTranslation();
  const { register, loading, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'CUSTOMER',
    plateNumber: '',
    vehicleModel: '',
    capacity: 14,
  });

  if (isAuthenticated && user?.role) {
    return <Navigate to={getHomeRouteByRole(user.role)} replace />;
  }

  const handleChange = (e) => {
    clearError();
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        role: form.role,
      };

      if (form.role === 'DRIVER') {
        payload.plateNumber = form.plateNumber;
        payload.vehicleModel = form.vehicleModel;
        payload.capacity = form.capacity;
      }

      const registeredUser = await register(payload);
      navigate(getHomeRouteByRole(registeredUser.role), { replace: true });
    } catch {
      // error AuthContext'te
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 py-4 position-relative">
      <div className="auth-language-bar">
        <LanguageSwitcher />
      </div>

      <div className="card auth-card shadow-sm border-0" style={{ maxWidth: 520 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">ShuttleX</h1>
            <p className="text-muted mb-0">Yeni hesap oluşturun</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Ad</label>
                <input name="firstName" className="form-control" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Soyad</label>
                <input name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">{t('common.email')}</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">{t('common.password')}</label>
                <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} minLength={6} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Telefon</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Rol</label>
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="CUSTOMER">Müşteri</option>
                  <option value="DRIVER">Şoför</option>
                </select>
              </div>

              {form.role === 'DRIVER' && (
                <>
                  <div className="col-md-4">
                    <label className="form-label">Plaka</label>
                    <input name="plateNumber" className="form-control" value={form.plateNumber} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Araç Modeli</label>
                    <input name="vehicleModel" className="form-control" value={form.vehicleModel} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Kapasite</label>
                    <input name="capacity" type="number" min={1} className="form-control" value={form.capacity} onChange={handleChange} required />
                  </div>
                </>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? '...' : t('common.register')}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Zaten hesabınız var mı? <Link to="/login">{t('common.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
