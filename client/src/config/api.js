/**
 * Центральный конфиг API-адресов.
 *
 * Миграция (пункты 1–6):
 *   До миграции каждый компонент сам собирал полный URL:
 *     axios.get('http://localhost:3000/api/researches')
 *
 *   После миграции компонент импортирует http-клиент и относительный путь:
 *     import { http } from '../config/http';
 *     import { API } from '../config/api';
 *     http.get(API.researches)            →  GET http://localhost:3000/api/researches
 *
 *   http.js знает baseURL (API_BASE), компонент знает только ресурс (/researches).
 *   Смена хоста/порта — одно место (API_BASE), не 30 файлов.
 *
 * Проверить:
 *   Открыть DevTools → Network. Все запросы должны уходить на
 *   http://localhost:3000/api/..., а не на другой origin или двойной /api/api/...
 */
export const API_BASE = 'http://localhost:3000/api';
export const API = {
  inventories: '/inventories',
  reagents: '/reagents',
  chemMixtures: '/chemMixtures',
  chemEquipments: '/chemEquipments',
  chemElements: '/chemElements',
  storages: '/storages',
  storageUnits: '/storageUnits',
  inventoryStorageUnit: '/inventoryStorageUnit',
  experiments: '/experiments',
  researches: '/researches',
  tasks: '/tasks',
  taskFiles: '/taskFiles',
  researchEmployees: '/researchEmployees',
  researchTeams: '/research-teams',
  employees: '/employees',
  users: '/users',
  carts: '/carts',
  orders: '/orders',
  logs: '/logs',
};

/**
 * @deprecated Абсолютные URL — временная обратная совместимость.
 * Экраны, ещё не переведённые на http-клиент (пункты 4–5), импортируют
 * эти константы. По мере миграции каждая строка ниже будет удалена.
 * НЕ использовать в новом коде — только API.xxx + http.
 */
export const API_INVENTORIES = `${API_BASE}/inventories`;
export const API_REAGENTS = `${API_BASE}/reagents`;
export const API_CHEM_MIXTURES = `${API_BASE}/chemMixtures`;
export const API_CHEM_EQUIPMENTS = `${API_BASE}/chemEquipments`;
export const API_STORAGES = `${API_BASE}/storages`;
export const API_STORAGE_UNITS = `${API_BASE}/storageUnits`;
export const API_EXPERIMENTS = `${API_BASE}/experiments`;
