export const API_BASE = 'http://localhost:3000/api';

/**
 * Относительные пути ресурсов (без хоста).
 * Для axios-инстанса с baseURL = API_BASE: http.get(API.researches) → /api/researches.
 * Пока экраны не переведены на http, эти пути никто не обязан использовать.
 */
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

/** @deprecated Абсолютные URL. Нужны текущим экранам, пока они не перейдут на http. */
export const API_INVENTORIES = `${API_BASE}/inventories`;
export const API_REAGENTS = `${API_BASE}/reagents`;
export const API_CHEM_MIXTURES = `${API_BASE}/chemMixtures`;
export const API_CHEM_EQUIPMENTS = `${API_BASE}/chemEquipments`;
export const API_STORAGES = `${API_BASE}/storages`;
export const API_STORAGE_UNITS = `${API_BASE}/storageUnits`;
export const API_EXPERIMENTS = `${API_BASE}/experiments`;
