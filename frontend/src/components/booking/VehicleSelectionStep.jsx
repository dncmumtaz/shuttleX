import { useTranslation } from 'react-i18next';
import VehicleCard from './VehicleCard';

export default function VehicleSelectionStep({
  search,
  drivers,
  loading,
  onSelectDriver,
  onBack,
}) {
  const { t } = useTranslation();

  return (
    <div className="booking-step-content">
      <div className="booking-search-panel">
        <div className="booking-search-header mb-4">
          <h3 className="booking-search-title">{t('booking.stepVehicle')}</h3>
          <p className="booking-search-subtitle mb-0">{t('booking.vehicleSubtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-4 text-muted">
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            {t('booking.searching')}
          </div>
        ) : drivers.length === 0 ? (
          <div className="booking-alert mb-0">{t('booking.noVehicles')}</div>
        ) : (
          <div className="booking-vehicles-list">
            {drivers.map((driver) => (
              <VehicleCard
                key={driver.driverProfileId}
                driver={driver}
                passengerCount={search.passengerCount}
                onSelect={onSelectDriver}
              />
            ))}
          </div>
        )}

        <button type="button" className="btn btn-booking-outline mt-3" onClick={onBack}>
          {t('booking.back')}
        </button>
      </div>
    </div>
  );
}
