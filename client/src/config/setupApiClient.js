import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Глобальные interceptors: Bearer-токен на API-запросы и выход при 401.
 * Вызывается один раз из index.js до рендера приложения.
 */
export function setupApiClient() {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    const url = config.url || '';

    if (token && (url.startsWith(API_BASE) || url.startsWith('/api/'))) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = error.config?.url || '';
      const isLoginAttempt = url.includes('/users/login');
      const isRegisterAttempt =
        error.config?.method === 'post' &&
        /\/api\/users\/?(\?|$)/.test(url) &&
        !isLoginAttempt;

      if (status === 401 && !isLoginAttempt && !isRegisterAttempt) {
        localStorage.removeItem('authToken');

        if (authRedirectEnabled) {
          const onAuthPage = window.location.pathname.startsWith('/management/sign');
          if (!onAuthPage) {
            const redirect = encodeURIComponent(
              `${window.location.pathname}${window.location.search}`
            );
            window.location.assign(`/management/signin?redirect=${redirect}`);
          }
        }
      }

      return Promise.reject(error);
    }
  );
}
