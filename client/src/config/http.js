import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Единый HTTP-клиент к REST API (axios-инстанс).
 *
 * Пункты 1–8: Auth, Cart, Projects/Experiments, Inventory, Research/Tasks,
 * Storage, Equipment, AdminLogs, ResearchTeams → http + API.*.
 * setupApiClient удалён; index.js: import './config/http'.
 *
 * Пункт 9 — закрытие миграции:
 *   Grep (автомат):  npm run check:api
 *     — нет живого localhost:3000 вне API_BASE
 *     — import axios только здесь
 *     — нет axios.* / fetch(API) в UI
 *     — нет setupApiClient и *-copy.js
 *
 *   Smoke (ручной обход, DevTools → Network):
 *     1. /management/signin → POST /api/users/login, GET /api/users/profile + Bearer
 *     2. / (dashboard) → страница открывается без 401-цикла
 *     3. /projects/research-list → GET /api/researches; открыть research → tasks/files/members
 *     4. /projects/task-list → GET /api/tasks
 *     5. /inventory/overview или /inventory/lots → GET /api/inventories...
 *     6. /storage-locations/warehouses → GET /api/storages
 *     7. /lab-equipment → GET /api/chemEquipments/...
 *     8. experiment detail → GET /api/experiments/:id
 *     9. /customer/cart → GET /api/carts/...
 *    10. /management/userlog → GET /api/logs (не /api/api/logs)
 *    11. /members-teams/research-teams → GET /api/research-teams/...
 *
 * Критерий успеха: все запросы на один хост из API_BASE, с Bearer где нужна авторизация,
 * без дублирующих /api/api и без редиректов на signin при валидной сессии.
 *
 * Использование:
 *   import { http } from '../config/http';
 *   import { API } from '../config/api';
 *   const { data } = await http.get(API.researches);
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
