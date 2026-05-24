import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BASE_FARE, calculateTotal } from '../../utils/bookingUtils';
import { resolveVehicleDisplayServices } from '../../utils/vehicleServiceCatalog';
import { resolveVehicleImageUrl } from '../../utils/vehicleImageUtils';

export default function VehicleCard({ driver, passengerCount, onSelect, extraServices, returnTransfer }) {
  const { t } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);
  const allServices = resolveVehicleDisplayServices(driver.services || []);
  const imageUrl = resolveVehicleImageUrl(driver.vehicleImageUrl);
  const total = calculateTotal({
    extraServices: extraServices || [],
    returnTransfer: returnTransfer || false,
    driverServices: driver.services || [],
  }) || BASE_FARE;
  const minCap = 1;
  const maxCap = Math.min(driver.capacity, 8);

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-image">
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            alt={driver.vehicleModel}
            className="vehicle-card-photo"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="vehicle-card-emoji">🚐</span>
        )}
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-header">
          <h4>{driver.vehicleModel} VIP</h4>
          <div className="vehicle-card-badges">
            <span>👤 {t('booking.capacity', { min: minCap, max: maxCap })}</span>
            <span>🧳 {t('booking.luggage', { count: Math.max(2, Math.floor(driver.capacity / 2)) })}</span>
          </div>
        </div>

        {allServices.length > 0 && (
          <div className="vehicle-card-services">
            <h6>{t('booking.vehicleServicesTitle')}</h6>
            <ul className="vehicle-services-list">
              {allServices.map((service) => (
                <li key={service.code} className="vehicle-service-item">
                  <span className="vehicle-service-icon">{service.icon}</span>
                  <span className="vehicle-service-name">{t(`booking.${service.id}`)}</span>
                  <span className="vehicle-service-price">
                    {service.price === 0 ? t('booking.free') : `${service.price} €`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="vehicle-card-footer">
          <div>
            <small>{t('booking.totalAmount')}</small>
            <strong className="vehicle-price">{total} €</strong>
          </div>
          <button type="button" className="btn btn-booking-select" onClick={() => onSelect(driver)}>
            {t('booking.select')} &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
