import { useTranslation } from 'react-i18next';

export default function VehiclePreviewCard({
  plateNumber,
  vehicleModel,
  capacity,
  imageSrc,
  imagePending = false,
}) {
  const { t } = useTranslation();
  const modelLabel = vehicleModel?.trim() || t('vehicleSettings.previewNoModel');
  const plateLabel = plateNumber?.trim() || t('vehicleSettings.previewNoPlate');
  const parsedCapacity = Math.max(1, Number(capacity) || 1);
  const maxCap = Math.min(parsedCapacity, 8);

  return (
    <div className="vehicle-customer-preview">
      <div className="vehicle-customer-preview-media">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={t('vehicleSettings.previewAlt')}
            className="vehicle-customer-preview-photo"
          />
        ) : (
          <div className="vehicle-customer-preview-placeholder">
            <span aria-hidden="true">🚐</span>
            <small>{t('vehicleSettings.previewNoPhoto')}</small>
          </div>
        )}
        {imagePending && (
          <span className="badge text-bg-warning vehicle-customer-preview-badge">
            {t('vehicleSettings.previewPending')}
          </span>
        )}
      </div>

      <div className="vehicle-customer-preview-body">
        <p className="vehicle-customer-preview-label">{t('vehicleSettings.customerPreviewLabel')}</p>
        <h4 className="vehicle-customer-preview-title">{modelLabel} VIP</h4>

        <div className="vehicle-customer-preview-meta">
          <span>🔢 {plateLabel}</span>
          <span>👤 {t('booking.capacity', { min: 1, max: maxCap })}</span>
          <span>🧳 {t('booking.luggage', { count: Math.max(2, Math.floor(parsedCapacity / 2)) })}</span>
        </div>

        <p className="vehicle-customer-preview-hint mb-0">{t('vehicleSettings.customerPreviewHint')}</p>
      </div>
    </div>
  );
}
