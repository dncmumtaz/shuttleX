import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectDriver } from '../../api/travelRequestApi';
import { extractApiErrorMessage } from '../../api/axiosInstance';

function DriverCard({ driver, passengerCount, onSelect, selecting, disabled, selectLabel, t }) {
  const availableSeats = driver.capacity - passengerCount;

  return (
    <div className="col-md-6 col-xl-4">
      <div className="card driver-card h-100 border-0 shadow-sm">
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <h5 className="card-title h6 mb-1">
                {driver.driverFirstName} {driver.driverLastName}
              </h5>
              <span className="badge text-bg-success-subtle text-success border border-success-subtle">
                {t('trips.driverSelection.activeDriver')}
              </span>
            </div>
            <div className="driver-avatar rounded-circle bg-primary-subtle text-primary fw-bold">
              {driver.driverFirstName?.charAt(0)}
              {driver.driverLastName?.charAt(0)}
            </div>
          </div>

          <ul className="list-unstyled driver-info mb-4 flex-grow-1">
            <li className="mb-2">
              <span className="text-muted small d-block">{t('trips.driverSelection.vehicleModel')}</span>
              <strong>{driver.vehicleModel}</strong>
            </li>
            <li className="mb-2">
              <span className="text-muted small d-block">{t('trips.driverSelection.plate')}</span>
              <strong>{driver.plateNumber}</strong>
            </li>
            <li>
              <span className="text-muted small d-block">{t('trips.driverSelection.remainingCapacity')}</span>
              <strong className="text-primary">
                {availableSeats >= 0 ? availableSeats : 0} / {driver.capacity}
              </strong>
              <small className="text-muted d-block mt-1">
                {t('trips.driverSelection.suitableForPassengers', { count: passengerCount })}
              </small>
            </li>
          </ul>

          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => onSelect(driver.driverProfileId)}
            disabled={disabled || selecting}
          >
            {selecting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                {t('trips.driverSelection.sending')}
              </>
            ) : (
              selectLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DriverList({ drivers, travelRequestId, passengerCount, onSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectingId, setSelectingId] = useState(null);
  const [error, setError] = useState(null);

  const handleSelect = async (driverProfileId) => {
    if (!travelRequestId) {
      setError(t('trips.driverSelection.invalidRequest'));
      return;
    }

    setSelectingId(driverProfileId);
    setError(null);

    try {
      await selectDriver(travelRequestId, driverProfileId);
      if (onSuccess) {
        onSuccess();
        return;
      }
      navigate('/customer/trips', {
        replace: true,
        state: { message: t('trips.driverSelectedSuccess') },
      });
    } catch (err) {
      setError(extractApiErrorMessage(err, t('trips.driverSelection.selectError')));
    } finally {
      setSelectingId(null);
    }
  };

  if (!drivers?.length) {
    return <div className="alert alert-warning mb-0">{t('trips.driverSelection.noDrivers')}</div>;
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      <p className="text-muted mb-3">{t('trips.driverSelection.foundDrivers', { count: drivers.length })}</p>

      <div className="row g-3">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.driverProfileId}
            driver={driver}
            passengerCount={passengerCount}
            onSelect={handleSelect}
            selecting={selectingId === driver.driverProfileId}
            disabled={Boolean(selectingId && selectingId !== driver.driverProfileId)}
            selectLabel={t('common.selectDriver')}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
