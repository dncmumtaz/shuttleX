import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatusBadge from '../common/StatusBadge';
import TripChat from './TripChat';
import { canChat, formatDateTime } from '../../utils/tripUtils';

export default function TripCard({ trip }) {
  const { t, i18n } = useTranslation();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="card trip-card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
            <div>
              <h5 className="h6 mb-2">
                {trip.origin} → {trip.destination}
              </h5>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <StatusBadge status={trip.travelRequestStatus} />
                {trip.active && (
                  <span className="badge text-bg-warning text-dark">{t('trips.active')}</span>
                )}
              </div>
            </div>
            <small className="text-muted">
              {t('trips.requestNo', { id: trip.travelRequestId })}
            </small>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-6 col-md-3">
              <span className="text-muted small d-block">{t('trips.departure')}</span>
              <strong>{formatDateTime(trip.departureDateTime, i18n.language)}</strong>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted small d-block">{t('trips.passenger')}</span>
              <strong>{t('booking.passengerCountLabel', { count: trip.passengerCount })}</strong>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted small d-block">{t('trips.driver')}</span>
              <strong>
                {trip.counterpartFirstName
                  ? `${trip.counterpartFirstName} ${trip.counterpartLastName}`
                  : '—'}
              </strong>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted small d-block">{t('trips.createdAt')}</span>
              <strong>{formatDateTime(trip.createdAt, i18n.language)}</strong>
            </div>
          </div>

          {trip.notes && (
            <p className="text-muted small mb-3">
              <strong>{t('trips.notes')}:</strong> {trip.notes}
            </p>
          )}

          {canChat(trip) && (
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setChatOpen(true)}
              >
                {t('trips.message')}
              </button>
            </div>
          )}
        </div>
      </div>

      {chatOpen && <TripChat trip={trip} onClose={() => setChatOpen(false)} />}
    </>
  );
}
