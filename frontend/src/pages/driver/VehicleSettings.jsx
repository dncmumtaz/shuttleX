import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVehicle, updateVehicle } from '../../api/driverApi';
import { extractApiErrorMessage } from '../../api/axiosInstance';
import VehiclePreviewCard from '../../components/driver/VehiclePreviewCard';
import '../../styles/vehicle-settings.css';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

import { resolveVehicleImageUrl } from '../../utils/vehicleImageUtils';

function validateImageFile(file, t) {
  if (!file) return null;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return t('vehicleSettings.invalidType');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return t('vehicleSettings.fileTooLarge');
  }

  return null;
}

export default function VehicleSettings() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    plateNumber: '',
    vehicleModel: '',
    capacity: 1,
  });
  const [savedImageUrl, setSavedImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileError, setFileError] = useState(null);

  const clearPreview = useCallback(() => {
    setPreviewUrl((current) => {
      if (current?.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }, []);

  const loadVehicle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicle();
      setForm({
        plateNumber: data.plateNumber || '',
        vehicleModel: data.vehicleModel || '',
        capacity: data.capacity || 1,
      });
      setSavedImageUrl(data.vehicleImageUrl || null);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('vehicleSettings.loadError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(null);
  };

  const applySelectedFile = (file) => {
    const validationError = validateImageFile(file, t);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    clearPreview();
    setPreviewUrl(URL.createObjectURL(file));
    setSuccess(null);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      applySelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      applySelectedFile(file);
    }
  };

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null);
    clearPreview();
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await updateVehicle({
        plateNumber: form.plateNumber.trim(),
        vehicleModel: form.vehicleModel.trim(),
        capacity: Number(form.capacity),
        image: selectedFile,
      });

      setSavedImageUrl(data.vehicleImageUrl || null);
      setSelectedFile(null);
      clearPreview();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSuccess(t('vehicleSettings.saveSuccess'));
      await loadVehicle();
    } catch (err) {
      setError(extractApiErrorMessage(err, t('vehicleSettings.saveError')));
    } finally {
      setSaving(false);
    }
  };

  const displayImageSrc = previewUrl || resolveVehicleImageUrl(savedImageUrl);

  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        <span className="spinner-border spinner-border-sm me-2" role="status" />
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="vehicle-settings-page">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h3 className="h4 mb-1">{t('vehicleSettings.title')}</h3>
          <p className="text-muted mb-0">{t('vehicleSettings.subtitle')}</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h5 className="mb-1">{t('vehicleSettings.customerPreviewTitle')}</h5>
            <p className="text-muted small mb-0">{t('vehicleSettings.customerPreviewSubtitle')}</p>
          </div>
        </div>

        <VehiclePreviewCard
          plateNumber={form.plateNumber}
          vehicleModel={form.vehicleModel}
          capacity={form.capacity}
          imageSrc={displayImageSrc}
          imagePending={Boolean(selectedFile)}
        />
      </section>

      <form onSubmit={handleSubmit} className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-3">{t('vehicleSettings.detailsTitle')}</h5>

              <div className="mb-3">
                <label htmlFor="plateNumber" className="form-label">
                  {t('vehicleSettings.plateLabel')}
                </label>
                <input
                  id="plateNumber"
                  type="text"
                  className="form-control"
                  maxLength={20}
                  required
                  value={form.plateNumber}
                  onChange={(e) => handleFieldChange('plateNumber', e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="vehicleModel" className="form-label">
                  {t('vehicleSettings.modelLabel')}
                </label>
                <input
                  id="vehicleModel"
                  type="text"
                  className="form-control"
                  maxLength={255}
                  required
                  value={form.vehicleModel}
                  onChange={(e) => handleFieldChange('vehicleModel', e.target.value)}
                />
              </div>

              <div className="mb-0">
                <label htmlFor="capacity" className="form-label">
                  {t('vehicleSettings.capacityLabel')}
                </label>
                <input
                  id="capacity"
                  type="number"
                  min={1}
                  className="form-control"
                  required
                  value={form.capacity}
                  onChange={(e) => handleFieldChange('capacity', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="mb-3">{t('vehicleSettings.photoTitle')}</h5>

              <div
                className={`vehicle-dropzone ${dragActive ? 'is-dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={t('vehicleSettings.dropzoneLabel')}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="d-none"
                  onChange={handleFileInputChange}
                />

                {displayImageSrc ? (
                  <div className="vehicle-preview-wrap">
                    <img src={displayImageSrc} alt={t('vehicleSettings.previewAlt')} className="vehicle-preview-image" />
                    {selectedFile && (
                      <span className="badge text-bg-warning vehicle-preview-badge">
                        {t('vehicleSettings.previewPending')}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="vehicle-dropzone-empty text-center">
                    <div className="vehicle-dropzone-icon">📷</div>
                    <strong>{t('vehicleSettings.dropzoneTitle')}</strong>
                    <p className="text-muted small mb-0">{t('vehicleSettings.dropzoneHint')}</p>
                  </div>
                )}
              </div>

              <p className="text-muted small mt-3 mb-2">{t('vehicleSettings.fileRules')}</p>

              {fileError && <div className="alert alert-warning py-2 small mb-2">{fileError}</div>}

              {selectedFile && (
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                  <small className="text-muted text-truncate me-2">{selectedFile.name}</small>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleRemoveSelectedImage}>
                    {t('vehicleSettings.removePhoto')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? t('vehicleSettings.saving') : t('vehicleSettings.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
