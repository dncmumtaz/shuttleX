import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMyTrips } from '../../api/tripApi';
import { extractApiErrorMessage } from '../../api/axiosInstance';
import TripCard from '../../components/customer/TripCard';

export default function MyTrips() {
  const { t } = useTranslation();
  const location = useLocation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  const loadTrips = useCallback(async () => {
    setError(null);
    try {
      const data = await getMyTrips();
      setTrips(data);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('trips.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div className="my-trips">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="h5 mb-1">{t('common.myTrips')}</h3>
          <p className="text-muted mb-0">{t('trips.subtitle')}</p>
        </div>
        <Link to="/customer/search" className="btn btn-primary btn-sm">
          {t('trips.newRequest')}
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success py-2" role="alert">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          {t('trips.loading')}
        </div>
      ) : trips.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <p className="text-muted mb-3">{t('trips.empty')}</p>
            <Link to="/customer/search" className="btn btn-primary">
              {t('trips.createFirst')}
            </Link>
          </div>
        </div>
      ) : (
        trips.map((trip) => <TripCard key={trip.travelRequestId} trip={trip} />)
      )}
    </div>
  );
}
