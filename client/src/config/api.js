/**
 * Центральный конфиг API-адресов.
 *
 * Миграция (пункты 1–9):
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
 *   Пункт 5: Inventory / reagents / lots / mixtures; абсолютные API_* удалены.
 *   Пункт 8: AdminLogs + ResearchTeams на http; setupApiClient удалён;
 *            index.js импортирует только ./config/http.
 *   Пункт 9: npm run check:api (grep) + smoke-чеклист в config/http.js.
 *
 * Единственное место с хостом API — API_BASE ниже.
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
