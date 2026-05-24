import axios from 'axios';
import { getActiveLanguage } from '../i18n';
import { API_AUTH_BASE, API_V1_BASE } from './apiConfig';

const TOKEN_KEY = 'shuttlex_token';
const USER_KEY = 'shuttlex_user';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const axiosInstance = axios.create({
  baseURL: API_V1_BASE,
  headers: defaultHeaders,
});

export const authAxios = axios.create({
  baseURL: API_AUTH_BASE,
  headers: defaultHeaders,
});

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function extractApiErrorMessage(error, fallback = 'Bir hata oluştu.') {
  const data = error?.response?.data;
  if (data?.validationErrors) {
    return Object.values(data.validationErrors).join(', ');
  }
  if (data?.message) {
    return data.message;
  }
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    return 'Oturumunuz geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.';
  }
  return fallback;
}

function handleAuthError(error) {
  const status = error?.response?.status;
  const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));

  if ((status === 401 || status === 403) && hadToken) {
    clearSession();
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login';
    }
  }
}

function attachInterceptors(client) {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Accept-Language'] = getActiveLanguage();

      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      handleAuthError(error);
      return Promise.reject(error);
    }
  );
}

attachInterceptors(axiosInstance);
attachInterceptors(authAxios);

export { TOKEN_KEY };
export default axiosInstance;
