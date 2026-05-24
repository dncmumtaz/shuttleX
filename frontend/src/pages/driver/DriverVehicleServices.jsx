import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVehicleServices, updateVehicleServices } from '../../api/driverApi';
import { extractApiErrorMessage } from '../../api/axiosInstance';
import {
  SERVICE_CATEGORIES,
  buildCatalogItems,
} from '../../utils/vehicleServiceCatalog';

const CATEGORY_LABELS = {
  FEATURE: 'driverServices.categoryFeature',
  AMENITY: 'driverServices.categoryAmenity',
  EXTRA: 'driverServices.categoryExtra',
};

function ServiceToggleCard({ item, enabled, price, onToggle, onPriceChange }) {
  const { t } = useTranslation();
  const isExtra = item.category === 'EXTRA';

  return (
    <div className={`card border-0 shadow-sm h-100 ${enabled ? 'border border-success' : ''}`}>
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="fs-4">{item.icon}</span>
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(item.code, e.target.checked)}
            />
          </div>
        </div>
        <strong className="mb-1">{t(`booking.${item.id}`)}</strong>
        {isExtra ? (
          <div className="mt-auto">
            <label className="form-label small text-muted mb-1">{t('driverServices.priceLabel')}</label>
            <div className="input-group input-group-sm">
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={price}
                disabled={!enabled}
                onChange={(e) => onPriceChange(item.code, e.target.value)}
              />
              <span className="input-group-text">€</span>
            </div>
          </div>
        ) : (
          <small className="text-muted mt-auto">{t('booking.free')}</small>
        )}
      </div>
    </div>
  );
}

export default function DriverVehicleServices() {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState([]);
  const [selection, setSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicleServices();
      const catalogItems = buildCatalogItems(data.catalog || []);
      const nextSelection = {};

      catalogItems.forEach((item) => {
        nextSelection[item.code] = {
          enabled: false,
          price: item.defaultPrice,
        };
      });

      (data.enabledServices || []).forEach((service) => {
        nextSelection[service.code] = {
          enabled: true,
          price: Number(service.price) || 0,
        };
      });

      setCatalog(catalogItems);
      setSelection(nextSelection);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('driverServices.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const groupedCatalog = useMemo(() => {
    return SERVICE_CATEGORIES.map((category) => ({
      category,
      items: catalog.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [catalog]);

  const handleToggle = (code, enabled) => {
    setSelection((prev) => {
      const catalogItem = catalog.find((item) => item.code === code);
      return {
        ...prev,
        [code]: {
          enabled,
          price: prev[code]?.price ?? catalogItem?.defaultPrice ?? 0,
        },
      };
    });
    setSuccess(null);
  };

  const handlePriceChange = (code, value) => {
    const parsed = Math.max(0, Number(value) || 0);
    setSelection((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        price: parsed,
      },
    }));
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const services = Object.entries(selection)
        .filter(([, value]) => value.enabled)
        .map(([code, value]) => ({
          serviceCode: code,
          price: value.price,
        }));

      await updateVehicleServices(services);
      setSuccess(t('driverServices.saveSuccess'));
      await loadServices();
    } catch (err) {
      setError(extractApiErrorMessage(err, t('driverServices.saveError')));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        <span className="spinner-border spinner-border-sm me-2" role="status" />
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h3 className="h4 mb-1">{t('driverServices.title')}</h3>
          <p className="text-muted mb-0">{t('driverServices.subtitle')}</p>
        </div>
        <button type="button" className="btn btn-dark" disabled={saving} onClick={handleSave}>
          {saving ? t('driverServices.saving') : t('driverServices.save')}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {groupedCatalog.map((group) => (
        <section key={group.category} className="mb-4">
          <h5 className="mb-3">{t(CATEGORY_LABELS[group.category])}</h5>
          <div className="row g-3">
            {group.items.map((item) => (
              <div key={item.code} className="col-md-4 col-lg-3">
                <ServiceToggleCard
                  item={item}
                  enabled={Boolean(selection[item.code]?.enabled)}
                  price={selection[item.code]?.price ?? item.defaultPrice}
                  onToggle={handleToggle}
                  onPriceChange={handlePriceChange}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
