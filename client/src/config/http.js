import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Единый HTTP-клиент к REST API (axios-инстанс).
 *
 * API-миграция: Auth, Cart, Projects, Inventory, Research, Storage, Equipment,
 * AdminLogs, ResearchTeams → http + API.*.
 *
 * Фаза 4 (роли): withCredentials — браузер шлёт cookie `token` вместе с Bearer.
 * Сервер: authenticate читает Cookie || Bearer; authorize(CAN_*) на части роутов.
 *
 * Smoke (Network):
 *   login → Set-Cookie: token=… + JSON.token
 *   GET /api/logs от student → 403; от system_admin → 200
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
