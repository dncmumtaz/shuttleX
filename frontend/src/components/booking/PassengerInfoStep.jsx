import { useTranslation } from 'react-i18next';

export default function PassengerInfoStep({
  contact,
  contactErrors,
  passengers,
  flight,
  returnTransfer,
  extraServices,
  availableExtras = [],
  specialNote,
  total,
  loading,
  onContactChange,
  onPassengersChange,
  onFlightChange,
  onReturnTransferChange,
  onToggleExtra,
  onSpecialNoteChange,
  onBack,
  onSubmit,
}) {
  const { t } = useTranslation();

  const handleContactChange = (e) => {
    onContactChange({ ...contact, [e.target.name]: e.target.value });
  };

  const addPassenger = () => {
    onPassengersChange([...passengers, { name: '' }]);
  };

  const updatePassenger = (index, value) => {
    const next = passengers.map((p, i) => (i === index ? { name: value } : p));
    onPassengersChange(next);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) return;
    onPassengersChange(passengers.filter((_, i) => i !== index));
  };

  return (
    <div className="booking-step-content">
      <section className="booking-form-section">
        <h4>{t('booking.contactInfo')}</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label booking-label">{t('booking.fullName')} *</label>
            <input
              name="fullName"
              className={`form-control booking-input ${contactErrors.fullName ? 'is-invalid' : ''}`}
              value={contact.fullName}
              onChange={handleContactChange}
              placeholder={t('booking.fullNamePlaceholder')}
            />
            {contactErrors.fullName && (
              <div className="invalid-feedback">{t('booking.requiredField')}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label booking-label">{t('booking.phone')} *</label>
            <input
              name="phone"
              className={`form-control booking-input ${contactErrors.phone ? 'is-invalid' : ''}`}
              value={contact.phone}
              onChange={handleContactChange}
              placeholder="+90 555 555 55 55"
            />
            {contactErrors.phone && (
              <div className="invalid-feedback">{t('booking.requiredField')}</div>
            )}
          </div>
          <div className="col-12">
            <label className="form-label booking-label">{t('booking.emailAddress')} *</label>
            <input
              name="email"
              type="email"
              className={`form-control booking-input ${contactErrors.email ? 'is-invalid' : ''}`}
              value={contact.email}
              onChange={handleContactChange}
              placeholder="ornek@email.com"
            />
            {contactErrors.email === 'required' && (
              <div className="invalid-feedback">{t('booking.requiredField')}</div>
            )}
            {contactErrors.email === 'invalid' && (
              <div className="invalid-feedback">{t('booking.invalidEmail')}</div>
            )}
          </div>
        </div>
      </section>

      <section className="booking-form-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{t('booking.passengerList')}</h4>
          <button type="button" className="btn btn-booking-outline btn-sm" onClick={addPassenger}>
            + {t('booking.addPassenger')}
          </button>
        </div>
        {passengers.map((passenger, index) => (
          <div key={index} className="d-flex gap-2 mb-2">
            <input
              className="form-control booking-input"
              value={passenger.name}
              onChange={(e) => updatePassenger(index, e.target.value)}
              placeholder={t('booking.passengerName')}
            />
            {passengers.length > 1 && (
              <button
                type="button"
                className="btn btn-booking-outline btn-sm"
                onClick={() => removePassenger(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </section>

      <section className="booking-form-section">
        <h4>{t('booking.flightInfo')}</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label booking-label">{t('booking.flightCode')}</label>
            <input
              className="form-control booking-input"
              value={flight.code}
              onChange={(e) => onFlightChange({ ...flight, code: e.target.value })}
              placeholder={t('booking.flightCodePlaceholder')}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label booking-label">{t('booking.landingTime')}</label>
            <input
              type="time"
              className="form-control booking-input"
              value={flight.landingTime}
              onChange={(e) => onFlightChange({ ...flight, landingTime: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="booking-form-section">
        <label className="booking-toggle">
          <input
            type="checkbox"
            checked={returnTransfer}
            onChange={(e) => onReturnTransferChange(e.target.checked)}
          />
          <span>✓ {t('booking.returnTransfer')}</span>
        </label>
      </section>

      {availableExtras.length > 0 && (
        <section className="booking-form-section">
          <h4>{t('booking.extraServices')}</h4>
          <div className="extra-services-grid">
            {availableExtras.map((service) => {
              const selected = extraServices.includes(service.id);
              return (
                <button
                  key={service.code}
                  type="button"
                  className={`extra-service-card ${selected ? 'selected' : ''}`}
                  onClick={() => onToggleExtra(service.id)}
                >
                  <span className="extra-service-icon">{service.icon}</span>
                  <strong>{t(`booking.${service.id}`)}</strong>
                  <small>
                    {service.price === 0 ? t('booking.free') : `${service.price} €`}
                  </small>
                  <span className="extra-service-add">{selected ? '✓' : '+'}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="booking-form-section">
        <label className="form-label booking-label">{t('booking.specialNote')}</label>
        <textarea
          rows={3}
          maxLength={500}
          className="form-control booking-input"
          value={specialNote}
          onChange={(e) => onSpecialNoteChange(e.target.value)}
          placeholder={t('booking.specialNotePlaceholder')}
        />
      </section>

      <div className="booking-form-footer">
        <button type="button" className="btn btn-booking-outline" onClick={onBack}>
          {t('booking.back')}
        </button>
        <div className="booking-form-footer-right">
          <div className="booking-footer-total">
            <span>{t('booking.totalAmount')}</span>
            <strong>{total} €</strong>
            <small>💵 {t('booking.cashPayment')}</small>
          </div>
          <button
            type="button"
            className="btn btn-booking-primary btn-lg"
            disabled={loading}
            onClick={onSubmit}
          >
            {loading ? t('booking.processing') : `${t('booking.completeReservation')} >`}
          </button>
        </div>
      </div>
    </div>
  );
}
