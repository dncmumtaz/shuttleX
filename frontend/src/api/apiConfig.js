const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export const API_V1_BASE = configuredApiBase || '/api/v1';

export const API_AUTH_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/v1$/, '')
  : '/api';

export function getBackendPublicOrigin() {
  if (!configuredApiBase) {
    return '';
  }

  return configuredApiBase.replace(/\/api\/v1$/, '');
}
