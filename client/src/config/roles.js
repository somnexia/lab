/**
 * Зеркало server/config/roles.js для UI.
 * Не заменяет API authorize: только скрывает пункты меню / кнопки.
 * Источник истины для безопасности — сервер.
 */
export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  LAB_ADMIN: 'lab_admin',
  RESEARCHER: 'researcher',
  STUDENT: 'student',
};

export const ROLE_LABELS = {
  [ROLES.SYSTEM_ADMIN]: 'Системный администратор',
  [ROLES.LAB_ADMIN]: 'Администратор лаборатории',
  [ROLES.RESEARCHER]: 'Исследователь',
  [ROLES.STUDENT]: 'Студент',
};

export const ALL_ROLES = Object.values(ROLES);

export const CAN_ACCESS_ADMIN_UI = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_VIEW_LOGS = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_MANAGE_USERS = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_MANAGE_EMPLOYEES = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_VIEW_OWN_PROFILE = ALL_ROLES;

export const CAN_MANAGE_LABORATORIES = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_VIEW_LABORATORIES = ALL_ROLES;

export const CAN_MANAGE_INVENTORY = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_MANAGE_STORAGE = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_MANAGE_EQUIPMENT = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_VIEW_CATALOG = ALL_ROLES;
export const CAN_MANAGE_CATALOG = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
export const CAN_VIEW_INVENTORY = ALL_ROLES;
export const CAN_VIEW_STORAGE = ALL_ROLES;
export const CAN_VIEW_EQUIPMENT = ALL_ROLES;

export const CAN_MANAGE_RESEARCH = [
  ROLES.SYSTEM_ADMIN,
  ROLES.LAB_ADMIN,
  ROLES.RESEARCHER,
];
export const CAN_VIEW_RESEARCH = ALL_ROLES;
export const CAN_VIEW_TASKS = ALL_ROLES;
export const CAN_USE_CART = ALL_ROLES;

export function getUserRole(user) {
  if (!user) return null;
  return user.role || null;
}

/** user — объект с .role или строка роли */
export function hasRole(user, allowedRoles) {
  const role = typeof user === 'string' ? user : getUserRole(user);
  if (!role) return false;
  const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return list.includes(role);
}

export function isSystemAdmin(user) {
  return getUserRole(user) === ROLES.SYSTEM_ADMIN;
}

export function isLabAdmin(user) {
  return getUserRole(user) === ROLES.LAB_ADMIN;
}

export function isResearcher(user) {
  return getUserRole(user) === ROLES.RESEARCHER;
}

export function isStudent(user) {
  return getUserRole(user) === ROLES.STUDENT;
}
