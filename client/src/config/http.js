import axios from 'axios';
import { API_BASE } from './api';

let authRedirectEnabled = true;

export function setAuthRedirectEnabled(enabled) {
  authRedirectEnabled = enabled;
}

/**
 * Единый HTTP-клиент к REST API (axios-инстанс).
 *
 * Зачем отдельный инстанс, а не глобальный axios:
 *   - baseURL задан один раз — компоненты пишут только путь ресурса.
 *   - Interceptors (токен, 401) живут только на этом инстансе,
 *     не конфликтуя со старым setupApiClient во время миграции.
 *   - После полного перехода setupApiClient удаляется (пункт 5).
 *
 * Использование в компоненте:
 *   import { http } from '../config/http';
 *   const { data } = await http.get('/researches');        // GET
 *   await http.post('/tasks', body);                       // POST
 *   await http.put(`/inventories/${id}`, body);            // PUT
 *   await http.delete(`/carts/item/${lineId}`);            // DELETE
 *
 * Сейчас переведены: Auth, SignUp, Cart.
 * Остальные экраны пока ходят через глобальный axios + setupApiClient.
 *
 * Проверить:
 *   1. Войти (Sign In) — запрос POST /api/users/login уходит с Bearer после получения токена.
 *   2. Обновить страницу — GET /api/users/profile с Bearer, сессия жива.
 *   3. Открыть корзину — запросы /api/carts/... с Bearer.
 *   4. Ввести неверный пароль — ошибка на форме, без бесконечного редиректа.
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
