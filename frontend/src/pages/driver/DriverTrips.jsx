import { useCallback, useEffect, useState } from 'react';
import { getMyTrips } from '../../api/tripApi';
import TripCard from '../../components/customer/TripCard';

export default function DriverTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTrips = useCallback(async () => {
    setError(null);
    try {
      const data = await getMyTrips();
      setTrips(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Seferler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="h5 mb-1">Seferlerim</h3>
        <p className="text-muted mb-0">Onayladığınız aktif ve geçmiş seferler</p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          Yükleniyor...
        </div>
      ) : trips.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center text-muted">
            Onaylanmış sefer bulunmuyor.
          </div>
        </div>
      ) : (
        trips.map((trip) => <TripCard key={trip.travelRequestId} trip={trip} />)
      )}
    </div>
  );
}
