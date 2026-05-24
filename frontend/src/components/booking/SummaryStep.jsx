import { useTranslation } from 'react-i18next';
import { formatBookingDate } from '../../utils/bookingUtils';
import { resolveBookingExtras } from '../../utils/vehicleServiceCatalog';

export default function SummaryStep({ confirmation, onPrint }) {
  const { t } = useTranslation();

  if (!confirmation) return null;

  const {
    reservationNo,
    bookingStatus,
    search,
    selectedDriver,
    contact,
    flight,
    returnTransfer,
    extraServices,
    total,
    createdAt,
  } = confirmation;

  const isConfirmed = bookingStatus === 'CONFIRMED';
  const driverExtras = resolveBookingExtras(selectedDriver?.services || []);
  const selectedExtras = driverExtras.filter((s) => extraServices.includes(s.id));
  const passengerLabel = t('booking.passengerCountLabel', { count: search.passengerCount });
  const driverName = `${selectedDriver.driverFirstName || ''} ${selectedDriver.driverLastName || ''}`.trim();

  return (
    <div className="booking-step-content">
      <div className="booking-summary-toolbar">
        <div className={isConfirmed ? 'booking-confirmed-badge' : 'booking-pending-badge'}>
          {isConfirmed ? `✓ ${t('booking.confirmed')}` : `⏳ ${t('booking.awaitingDriverApproval')}`}
        </div>
        <button type="button" className="btn btn-booking-primary" onClick={onPrint}>
          🖨 {t('booking.printPdf')}
        </button>
      </div>

      {!isConfirmed && (
        <p className="booking-pending-note">{t('booking.awaitingDriverApprovalHint')}</p>
      )}

      <div className="booking-confirmation-card" id="booking-confirmation-print">
        <div className="booking-confirmation-header">
          <div>
            <span className="booking-logo">ShuttleX</span>
            <h2>{t('booking.confirmationTitle')}</h2>
          </div>
          <div className="booking-confirmation-meta">
            <div>
              <small>{t('booking.date').toUpperCase()}</small>
              <strong>{formatBookingDate(createdAt || search.departureDateTime).split(' ')[0]}</strong>
            </div>
            <div>
              <small>{t('booking.reservationNo')}</small>
              <strong>#{reservationNo}</strong>
            </div>
          </div>
        </div>

        <section className="booking-confirmation-section">
          <h5>{t('booking.transferDetails')}</h5>
          <div className="booking-details-grid">
            <div><small>{t('booking.from')}</small><p>{search.origin}</p></div>
            <div><small>{t('booking.to')}</small><p>{search.destination}</p></div>
            <div><small>{t('booking.dateTime')}</small><p>{formatBookingDate(search.departureDateTime)}</p></div>
            <div><small>{t('booking.vehicleType')}</small><p>{selectedDriver.vehicleModel} VIP</p></div>
            <div><small>{t('booking.passengerCount')}</small><p>{passengerLabel}</p></div>
            <div>
              <small>{t('booking.returnTransferLabel')}</small>
              <p>{returnTransfer ? t('booking.yes') : t('booking.no')}</p>
            </div>
            <div>
              <small>{t('booking.statusLabel')}</small>
              <p>{isConfirmed ? t('booking.statusConfirmed') : t('booking.statusPendingDriver')}</p>
            </div>
            {driverName && (
              <div>
                <small>{t('booking.selectedDriverLabel')}</small>
                <p>{driverName}</p>
              </div>
            )}
          </div>
        </section>

        <section className="booking-confirmation-section">
          <h5>{t('booking.extraServicesSection')}</h5>
          {selectedExtras.length === 0 ? (
            <p className="text-muted mb-0">{t('booking.noExtraServices')}</p>
          ) : (
            <table className="booking-confirmation-table">
              <thead>
                <tr>
                  <th>{t('booking.service')}</th>
                  <th>{t('booking.quantity')}</th>
                </tr>
              </thead>
              <tbody>
                {selectedExtras.map((s) => (
                  <tr key={s.code}>
                    <td>{t(`booking.${s.id}`)}</td>
                    <td>1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="booking-confirmation-section">
          <h5>{t('booking.passengerInfo')}</h5>
          <div className="booking-details-grid cols-3">
            <div><small>{t('booking.mainPassenger')}</small><p>{contact.fullName}</p></div>
            <div><small>{t('booking.phoneLabel')}</small><p>{contact.phone}</p></div>
            <div><small>{t('booking.emailLabel')}</small><p>{contact.email}</p></div>
          </div>
          {(flight.code || flight.landingTime) && (
            <p className="mt-2 mb-0 text-muted small">
              {t('booking.flightCode')}: {flight.code || '—'} | {t('booking.landingTime')}: {flight.landingTime || '—'}
            </p>
          )}
        </section>

        <div className="booking-confirmation-footer">
          <div>
            <small>{t('booking.footerRights', { year: new Date().getFullYear() })}</small>
            <small className="d-block">{t('booking.footerGenerated')}</small>
          </div>
          <div className="booking-confirmation-price">
            <strong>{total.toFixed(2)} EUR</strong>
            <span>{t('booking.totalAmount')}</span>
            <small>💵 {t('booking.cashPayment')}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
