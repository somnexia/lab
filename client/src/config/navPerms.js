/**
 * navPerms — флаги UI из user.role.
 *
 * Использование:
 *   const { perms } = useContext(AuthContext);
 *   if (perms.showUserLog) …
 *
 * Это не замена API: меню можно скрыть, URL — защитить RequirePerm,
 * данные — только через authorize на сервере.
 */
import {
  ROLE_LABELS,
  ROLES,
  hasRole,
  getUserRole,
  CAN_ACCESS_ADMIN_UI,
  CAN_VIEW_LOGS,
  CAN_MANAGE_USERS,
  CAN_MANAGE_EMPLOYEES,
  CAN_MANAGE_INVENTORY,
  CAN_MANAGE_STORAGE,
  CAN_MANAGE_EQUIPMENT,
  CAN_MANAGE_CATALOG,
  CAN_MANAGE_RESEARCH,
  CAN_VIEW_RESEARCH,
  CAN_VIEW_TASKS,
  CAN_VIEW_INVENTORY,
  CAN_VIEW_STORAGE,
  CAN_VIEW_EQUIPMENT,
  CAN_VIEW_CATALOG,
  CAN_USE_CART,
} from './roles';

const EMPTY = Object.freeze({
  role: null,
  roleLabel: null,
  laboratoryId: null,
  isAuthenticated: false,

  canAccessAdminUi: false,
  canViewLogs: false,
  canManageUsers: false,
  canManageEmployees: false,
  canManageInventory: false,
  canManageStorage: false,
  canManageEquipment: false,
  canManageCatalog: false,
  canManageResearch: false,
  canViewResearch: false,
  canViewTasks: false,
  canViewInventory: false,
  canViewStorage: false,
  canViewEquipment: false,
  canViewCatalog: false,
  canUseCart: false,

  /** Aside / Header convenience */
  showUserLog: false,
  showCreateResearch: false,
  showCreateTask: false,
  showRegisterLot: false,
  showAuthLinks: true,
  showSignOut: false,
});

/**
 * @param {object|null} user — ответ login/profile (role, roleLabel, laboratory_id)
 * @returns {typeof EMPTY}
 */
export function buildNavPerms(user) {
  if (!user) {
    return EMPTY;
  }

  const role = getUserRole(user);
  const roleLabel =
    user.roleLabel || ROLE_LABELS[role] || role || null;

  const laboratoryId =
    user.laboratory_id === undefined || user.laboratory_id === null
      ? null
      : Number(user.laboratory_id);

  return {
    role,
    roleLabel,
    laboratoryId,
    isAuthenticated: true,

    canAccessAdminUi: hasRole(user, CAN_ACCESS_ADMIN_UI),
    canViewLogs: hasRole(user, CAN_VIEW_LOGS),
    canManageUsers: hasRole(user, CAN_MANAGE_USERS),
    canManageEmployees: hasRole(user, CAN_MANAGE_EMPLOYEES),
    canManageInventory: hasRole(user, CAN_MANAGE_INVENTORY),
    canManageStorage: hasRole(user, CAN_MANAGE_STORAGE),
    canManageEquipment: hasRole(user, CAN_MANAGE_EQUIPMENT),
    canManageCatalog: hasRole(user, CAN_MANAGE_CATALOG),
    canManageResearch: hasRole(user, CAN_MANAGE_RESEARCH),
    canViewResearch: hasRole(user, CAN_VIEW_RESEARCH),
    canViewTasks: hasRole(user, CAN_VIEW_TASKS),
    canViewInventory: hasRole(user, CAN_VIEW_INVENTORY),
    canViewStorage: hasRole(user, CAN_VIEW_STORAGE),
    canViewEquipment: hasRole(user, CAN_VIEW_EQUIPMENT),
    canViewCatalog: hasRole(user, CAN_VIEW_CATALOG),
    canUseCart: hasRole(user, CAN_USE_CART),

    showUserLog: hasRole(user, CAN_VIEW_LOGS),
    showCreateResearch: hasRole(user, CAN_MANAGE_RESEARCH),
    // student может создавать «свои» задачи (матрица Cˢ) — пункт меню видим всем
    showCreateTask: hasRole(user, CAN_VIEW_TASKS),
    showRegisterLot: hasRole(user, CAN_MANAGE_INVENTORY),
    showAuthLinks: false,
    showSignOut: true,
  };
}

export function emptyNavPerms() {
  return EMPTY;
}

/** Для отладки / бейджей */
export function roleBadgeClass(role) {
  switch (role) {
    case ROLES.SYSTEM_ADMIN:
      return 'lab-role-badge lab-role-badge--system';
    case ROLES.LAB_ADMIN:
      return 'lab-role-badge lab-role-badge--lab';
    case ROLES.RESEARCHER:
      return 'lab-role-badge lab-role-badge--researcher';
    case ROLES.STUDENT:
      return 'lab-role-badge lab-role-badge--student';
    default:
      return 'lab-role-badge';
  }
}

export default buildNavPerms;
