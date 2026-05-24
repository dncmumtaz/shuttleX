import { useTranslation } from 'react-i18next';
import LocationInput from '../common/LocationInput';
import { getMinDateTimeLocal, validateSearchForm } from '../../utils/tripUtils';

export default function SearchTripStep({ search, errors, loading, onSearchChange, onSearch }) {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSearchChange({
      ...search,
      [name]: name === 'passengerCount' ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(validateSearchForm(search));
  };

  return (
    <div className="booking-step-content">
      <div className="booking-search-panel">
        <div className="booking-search-header mb-4">
          <h3 className="booking-search-title">{t('booking.searchTitle')}</h3>
          <p className="booking-search-subtitle mb-0">{t('booking.searchSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <LocationInput
                id="origin"
                label={t('common.origin')}
                name="origin"
                value={search.origin}
                onChange={handleChange}
                error={errors.origin}
                placeholder={t('booking.originPlaceholder')}
              />
            </div>
            <div className="col-md-6">
              <LocationInput
                id="destination"
                label={t('common.destination')}
                name="destination"
                value={search.destination}
                onChange={handleChange}
                error={errors.destination}
                placeholder={t('booking.destinationPlaceholder')}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="departureDateTime" className="form-label booking-label fw-semibold">
                {t('common.date')}
              </label>
              <input
                id="departureDateTime"
                name="departureDateTime"
                type="datetime-local"
                className={`form-control booking-input ${errors.departureDateTime ? 'is-invalid' : ''}`}
                value={search.departureDateTime}
                onChange={handleChange}
                min={getMinDateTimeLocal()}
              />
              {errors.departureDateTime && (
                <div className="invalid-feedback">{errors.departureDateTime}</div>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="passengerCount" className="form-label booking-label fw-semibold">
                {t('common.passengerCount')}
              </label>
              <input
                id="passengerCount"
                name="passengerCount"
                type="number"
                min={1}
                max={50}
                className={`form-control booking-input ${errors.passengerCount ? 'is-invalid' : ''}`}
                value={search.passengerCount}
                onChange={handleChange}
              />
              {errors.passengerCount && (
                <div className="invalid-feedback">{errors.passengerCount}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="notes" className="form-label booking-label fw-semibold">
                {t('booking.notesOptional')}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                maxLength={500}
                className="form-control booking-input"
                value={search.notes}
                onChange={handleChange}
                placeholder={t('booking.notesPlaceholder')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-booking-primary px-4 mt-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                {t('booking.searching')}
              </>
            ) : (
              t('booking.findDriver')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
