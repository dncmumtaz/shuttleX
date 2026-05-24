import { useCallback, useEffect, useState } from 'react';
import { getPendingRequests, respondToBooking } from '../../api/driverApi';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/tripUtils';

function RequestCard({ request, onRespond, respondingId }) {
  const isResponding = respondingId === request.bookingId;

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h5 className="h6 mb-2">
              {request.origin} → {request.destination}
            </h5>
            <StatusBadge status={request.travelRequestStatus} />
          </div>
          <small className="text-muted">Booking #{request.bookingId}</small>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <span className="text-muted small d-block">Kalkış</span>
            <strong>{formatDateTime(request.departureDateTime)}</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small d-block">Yolcu</span>
            <strong>{request.passengerCount} kişi</strong>
          </div>
          <div className="col-md-4">
            <span className="text-muted small d-block">Müşteri</span>
            <strong>
              {request.customerFirstName} {request.customerLastName}
            </strong>
          </div>
        </div>

        {request.notes && (
          <p className="text-muted small mb-3">
            <strong>Not:</strong> {request.notes}
          </p>
        )}

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-success btn-sm"
            disabled={Boolean(respondingId)}
            onClick={() => onRespond(request.bookingId, 'ACCEPT')}
          >
            {isResponding ? 'İşleniyor...' : 'Onayla'}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            disabled={Boolean(respondingId)}
            onClick={() => onRespond(request.bookingId, 'REJECT')}
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [respondingId, setRespondingId] = useState(null);

  const loadRequests = useCallback(async () => {
    setError(null);
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Talepler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 10000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const handleRespond = async (bookingId, action) => {
    setRespondingId(bookingId);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await respondToBooking(bookingId, action);
      setSuccessMessage(result.message);
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Yanıt gönderilemedi.');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <h3 className="h5 mb-1">Bekleyen Talepler</h3>
          <p className="text-muted mb-0">Size yönlendirilmiş ön eşleşme istekleri</p>
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            setLoading(true);
            loadRequests().finally(() => setLoading(false));
          }}
          disabled={loading}
        >
          Yenile
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success py-2">{successMessage}</div>
      )}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          Yükleniyor...
        </div>
      ) : requests.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <p className="text-muted mb-2">Bekleyen talep bulunmuyor.</p>
            <p className="small text-muted mb-0">
              Müşteri bir yolculuk oluşturup sizi şoför olarak seçtiğinde talepler burada
              görünür. Liste otomatik olarak yenilenir; isterseniz Yenile butonunu kullanın.
            </p>
          </div>
        </div>
      ) : (
        requests.map((request) => (
          <RequestCard
            key={request.bookingId}
            request={request}
            onRespond={handleRespond}
            respondingId={respondingId}
          />
        ))
      )}
    </div>
  );
}
