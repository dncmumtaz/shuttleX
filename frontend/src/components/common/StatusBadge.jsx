import { useTranslation } from 'react-i18next';
import { STATUS_CONFIG } from '../../utils/tripUtils';

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status] || { className: 'text-bg-light text-dark border' };
  const label = config.labelKey ? t(config.labelKey) : status;

  return <span className={`badge ${config.className}`}>{label}</span>;
}
