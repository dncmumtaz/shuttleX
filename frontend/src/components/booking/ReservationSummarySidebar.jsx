import { useTranslation } from 'react-i18next';
import { formatBookingDate } from '../../utils/bookingUtils';

export default function ReservationSummarySidebar({
  search,
  selectedDriver,
  total,
  showSelectedVehicle = false,
}) {
  const { t } = useTranslation();
  const passengerLabel = t('booking.passengerCountLabel', { count: search.passengerCount });

  return (
    <aside className="booking-sidebar">
      <div className="booking-sidebar-card">
        <h3 className="booking-sidebar-title">
          {showSelectedVehicle ? t('booking.selectedVehicle') : t('booking.summaryTitle')}
        </h3>

        {showSelectedVehicle && selectedDriver && (
          <div className="booking-sidebar-vehicle mb-3">
            <div className="booking-vehicle-thumb">
              <span>🚐</span>
            </div>
            <strong>
              {selectedDriver.vehicleModel} VIP
            </strong>
            <small className="text-muted d-block">
              {selectedDriver.driverFirstName} {selectedDriver.driverLastName}
            </small>
          </div>
        )}

        <div className="booking-route">
          <div className="booking-route-item">
            <span className="booking-route-dot" />
            <div>
              <small>{t('booking.from')}</small>
              <p>{search.origin || '—'}</p>
            </div>
          </div>
          <div className="booking-route-line" />
          <div className="booking-route-item">
            <span className="booking-route-dot destination" />
            <div>
              <small>{t('booking.to')}</small>
              <p>{search.destination || '—'}</p>
            </div>
          </div>
        </div>

        <div className="booking-sidebar-meta">
          <div>
            <span>📅</span>
            <div>
              <small>{t('booking.date')}</small>
              <strong>{formatBookingDate(search.departureDateTime)}</strong>
            </div>
          </div>
          <div>
            <span>👥</span>
            <div>
              <small>{t('booking.passengers')}</small>
              <strong>{passengerLabel}</strong>
            </div>
          </div>
        </div>

        {total != null && (
          <div className="booking-sidebar-total">
            <span>{t('booking.totalAmount')}</span>
            <strong>{total} €</strong>
          </div>
        )}

        <div className="booking-sidebar-help">
          <strong>{t('booking.needHelp')}</strong>
          <p>{t('booking.helpText')}</p>
        </div>
      </div>
    </aside>
  );
}
