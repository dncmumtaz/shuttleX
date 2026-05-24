import { getBackendPublicOrigin } from '../api/apiConfig';

export function resolveVehicleImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }

  const normalized = url.startsWith('/') ? url : `/${url}`;
  const backendOrigin = getBackendPublicOrigin();

  if (backendOrigin) {
    return `${backendOrigin}${normalized}`;
  }

  return normalized;
}
