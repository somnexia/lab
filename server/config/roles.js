/**
 * Фаза 1 (auth/roles): константы ролей LIMS.
 *
 * Пока без CAN_* — массивы прав появятся в фазе 2 (server/config/roles.js расширим).
 * Источник контракта: docs/README.md, docs/02-users-and-roles.md.
 *
 * Tenant (laboratory_id) в JWT — фаза 3; здесь только коды ролей для БД и регистрации.
 *
 * Адаптация из lab-equipment-booking-saas/roles.js:
 *   - 4 роли вместо 6 (без equipment_manager, technician)
 *   - без booking CAN_* и organizations
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

/** Роль при публичной регистрации (POST /api/users) */
const DEFAULT_REGISTER_ROLE = ROLES.STUDENT;

module.exports = {
  ROLES,
  ROLE_VALUES,
  ROLE_LABELS,
  DEFAULT_REGISTER_ROLE,
};
