import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Единый HTTP-клиент к REST API (axios-инстанс).
 *
 * Пункт 8: setupApiClient удалён. Все экраны API ходят через этот инстанс.
 * index.js импортирует './config/http' один раз при старте приложения.
 *
 * Зачем отдельный инстанс, а не глобальный axios:
 *   - baseURL задан один раз — компоненты пишут только путь ресурса.
 *   - Interceptors (Bearer-токен, 401 → sign in) живут только здесь.
 *
 * Использование:
 *   import { http } from '../config/http';
 *   import { API } from '../config/api';
 *   const { data } = await http.get(API.researches);
 *   await http.post(API.tasks, body);
 *
 * Переведено (пункты 1–8): Auth, Cart, Projects/Experiments, Inventory,
 * Research/Tasks/Members, Storage, Equipment, AdminLogs, ResearchTeams.
 *
 * Проверить:
 *   1. Sign in → POST /api/users/login, затем GET /api/users/profile + Bearer
 *   2. F5 — сессия жива (profile с Bearer)
 *   3. /management/userlog → GET /api/logs (не /api/api/logs)
 *   4. /members-teams/research-teams → GET /api/research-teams/summary|graph
 */
export const http = axios.create({
  baseURL: API_BASE,
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
