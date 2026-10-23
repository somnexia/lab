import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

/** Отключить редирект на signin при 401 (тесты / особые экраны). */
export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Единый HTTP-клиент к REST API (axios-инстанс).
 *
 * Interceptors:
 *   request  — Authorization: Bearer из localStorage
 *   response — только 401 → очистка токена + signin
 *
 * 403 намеренно НЕ редиректит глобально: на Dashboard/корзине/KPI часто
 * бывают «частичные» отказы по роли — страница должна остаться, а карточку
 * показать «—». Секретные URL закрывает RequirePerm (soft / denied UI).
 *
 * Использование:
 *   import { http } from '../config/http';
 *   import { API } from '../config/api';
 *   const { data } = await http.get(API.researches);
 */
export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const method = (error.config?.method || '').toLowerCase();
    const isLoginAttempt = url.includes('/users/login');
    const isRegisterAttempt =
      method === 'post' && /\/users\/?(\?|$)/.test(url) && !isLoginAttempt;

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
