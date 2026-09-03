/**
 * Центр прав LIMS (фаза 2).
 *
 * «Массивы под LIMS» = списки ролей, которым разрешена операция.
 * Пример: CAN_MANAGE_INVENTORY = [system_admin, lab_admin]
 *   → researcher/student сюда не входят (им только чтение — CAN_VIEW_INVENTORY).
 *
 * Это НЕ booking-проект: нет CAN_MANAGE_BOOKINGS / equipment_manager / technician.
 * Tenant (своя vs все лаборатории) массивы не кодируют — это фильтр в сервисе (фаза 5).
 *
 * Как пользоваться (фаза 4+):
 *   authorize(CAN_VIEW_LOGS)
 *   if (!hasRole(req.user, CAN_MANAGE_USERS)) throw forbidden
 *
 * Контракт: docs/README.md, docs/04-crud-matrix.md.
 */
'use strict';

const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  LAB_ADMIN: 'lab_admin',
  RESEARCHER: 'researcher',
  STUDENT: 'student',
};

const ROLE_VALUES = Object.values(ROLES);

const ROLE_LABELS = {
  [ROLES.SYSTEM_ADMIN]: 'Системный администратор',
  [ROLES.LAB_ADMIN]: 'Администратор лаборатории',
  [ROLES.RESEARCHER]: 'Исследователь',
  [ROLES.STUDENT]: 'Студент',
};

/** Публичная регистрация POST /api/users всегда ставит эту роль */
const DEFAULT_REGISTER_ROLE = ROLES.STUDENT;

const ALL_ROLES = ROLE_VALUES;

// ---------------------------------------------------------------------------
// Admin UI и аудит
// ---------------------------------------------------------------------------

/** Пункты вроде /management/userlog, админ-разделы Aside */
const CAN_ACCESS_ADMIN_UI = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

/**
 * Журнал логов. lab_admin — только события своей lab (фильтр в сервисе, фаза 5).
 * Минимум v1: можно сузить массив до [SYSTEM_ADMIN], не меняя роуты.
 */
const CAN_VIEW_LOGS = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

// ---------------------------------------------------------------------------
// Пользователи и сотрудники
// ---------------------------------------------------------------------------

/** CRUD чужих учёток (не свой профиль). lab_admin — только своя lab, не выдаёт system_admin */
const CAN_MANAGE_USERS = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

const CAN_MANAGE_EMPLOYEES = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

/** Все аутентифицированные: GET своего профиля */
const CAN_VIEW_OWN_PROFILE = ALL_ROLES;

// ---------------------------------------------------------------------------
// Лаборатории (tenant-корень)
// ---------------------------------------------------------------------------

/**
 * C/D лабораторий — фактически system_admin (проверка в сервисе).
 * lab_admin в списке, чтобы ходить в UPDATE своей записи; create/delete ему запретит сервис.
 */
const CAN_MANAGE_LABORATORIES = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

const CAN_CREATE_LABORATORIES = [ROLES.SYSTEM_ADMIN];
const CAN_DELETE_LABORATORIES = [ROLES.SYSTEM_ADMIN];

const CAN_VIEW_LABORATORIES = ALL_ROLES;

// ---------------------------------------------------------------------------
// Склад, инвентарь, оборудование (mutating = admin-роли)
// ---------------------------------------------------------------------------

const CAN_MANAGE_INVENTORY = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
const CAN_MANAGE_STORAGE = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];
const CAN_MANAGE_EQUIPMENT = [ROLES.SYSTEM_ADMIN, ROLES.LAB_ADMIN];

const CAN_VIEW_INVENTORY = ALL_ROLES;
const CAN_VIEW_STORAGE = ALL_ROLES;
const CAN_VIEW_EQUIPMENT = ALL_ROLES;

// ---------------------------------------------------------------------------
// Исследования, задачи, эксперименты
// ---------------------------------------------------------------------------

/** Создавать/менять researches/tasks/experiments. student — не здесь; «свои задачи» — в сервисе */
const CAN_MANAGE_RESEARCH = [
  ROLES.SYSTEM_ADMIN,
  ROLES.LAB_ADMIN,
  ROLES.RESEARCHER,
];

const CAN_VIEW_RESEARCH = ALL_ROLES;
const CAN_VIEW_TASKS = ALL_ROLES;

/** Корзина/заказы: роль не режет; «только свои» — user_id в сервисе */
const CAN_USE_CART = ALL_ROLES;

// ---------------------------------------------------------------------------
// Хелперы — один стиль проверок в сервисах и (позже) authorize
// ---------------------------------------------------------------------------

function getUserRole(user) {
  if (!user) return null;
  return user.role || null;
}

/** user — объект с .role (req.user после фазы 3) или строка роли */
function hasRole(user, allowedRoles) {
  const role = typeof user === 'string' ? user : getUserRole(user);
  if (!role) return false;
  const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return list.includes(role);
}

function isSystemAdmin(user) {
  return getUserRole(user) === ROLES.SYSTEM_ADMIN;
}

function isLabAdmin(user) {
  return getUserRole(user) === ROLES.LAB_ADMIN;
}

/** Пропуск tenant-фильтра: только system_admin видит все лаборатории */
function skipLabScope(user) {
  return isSystemAdmin(user);
}

function can(user, canList) {
  return hasRole(user, canList);
}

module.exports = {
  ROLES,
  ROLE_VALUES,
  ROLE_LABELS,
  DEFAULT_REGISTER_ROLE,
  ALL_ROLES,
  CAN_ACCESS_ADMIN_UI,
  CAN_VIEW_LOGS,
  CAN_MANAGE_USERS,
  CAN_MANAGE_EMPLOYEES,
  CAN_VIEW_OWN_PROFILE,
  CAN_MANAGE_LABORATORIES,
  CAN_CREATE_LABORATORIES,
  CAN_DELETE_LABORATORIES,
  CAN_VIEW_LABORATORIES,
  CAN_MANAGE_INVENTORY,
  CAN_MANAGE_STORAGE,
  CAN_MANAGE_EQUIPMENT,
  CAN_VIEW_INVENTORY,
  CAN_VIEW_STORAGE,
  CAN_VIEW_EQUIPMENT,
  CAN_MANAGE_RESEARCH,
  CAN_VIEW_RESEARCH,
  CAN_VIEW_TASKS,
  CAN_USE_CART,
  getUserRole,
  hasRole,
  isSystemAdmin,
  isLabAdmin,
  skipLabScope,
  can,
};
