/**
 * Владелец заказа = Employee, привязанный к req.user (user.employee_id).
 * В таблице orders нет user_id — есть employee_id.
 *
 * Admin (CAN_ACCESS_ADMIN_UI) может читать/менять любой заказ по id
 * (список всех — отдельный GET / с тем же правом).
 */
'use strict';

const { hasRole, CAN_ACCESS_ADMIN_UI } = require('../config/roles');

function forbidden(message = 'Недостаточно прав для доступа к чужому заказу', code = 'FORBIDDEN') {
  const err = new Error(message);
  err.code = code;
  err.status = 403;
  return err;
}

function actorEmployeeId(user) {
  if (!user || user.employee_id === undefined || user.employee_id === null) {
    return null;
  }
  return Number(user.employee_id);
}

function isOrderAdmin(user) {
  return hasRole(user, CAN_ACCESS_ADMIN_UI);
}

/**
 * employee_id для создания заказа — только из req.user.
 * Чужой employee_id в body → 403.
 * Нет employee_id у актора → 403 LAB_REQUIRED.
 */
function resolveOwnOrderEmployeeId(user, requestedEmployeeId) {
  const actorEmp = actorEmployeeId(user);
  if (actorEmp == null) {
    throw forbidden(
      'Учётная запись не привязана к сотруднику — нельзя оформить заказ',
      'LAB_REQUIRED'
    );
  }

  if (
    requestedEmployeeId === undefined ||
    requestedEmployeeId === null ||
    requestedEmployeeId === ''
  ) {
    return actorEmp;
  }

  const requested = Number(requestedEmployeeId);
  if (!Number.isFinite(requested) || requested !== actorEmp) {
    throw forbidden('Нельзя создать заказ от имени другого сотрудника');
  }

  return actorEmp;
}

function prepareOrderCreatePayload(user, data = {}) {
  const employee_id = resolveOwnOrderEmployeeId(user, data.employee_id);
  return {
    ...data,
    employee_id,
  };
}

/**
 * Просмотр/правка заказа по id.
 * Свой (employee_id) или admin UI.
 */
function assertCanAccessOrder(user, order) {
  if (!user) {
    throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  }
  if (!order) {
    const err = new Error('Заказ не найден');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }
  if (isOrderAdmin(user)) {
    return;
  }
  const actorEmp = actorEmployeeId(user);
  if (actorEmp == null || Number(order.employee_id) !== actorEmp) {
    throw forbidden();
  }
}

/** PUT — нельзя сменить владельца/id через body */
function sanitizeOrderUpdatePayload(data = {}) {
  const payload = { ...data };
  delete payload.employee_id;
  delete payload.id;
  return payload;
}

module.exports = {
  actorEmployeeId,
  isOrderAdmin,
  resolveOwnOrderEmployeeId,
  prepareOrderCreatePayload,
  assertCanAccessOrder,
  sanitizeOrderUpdatePayload,
};
