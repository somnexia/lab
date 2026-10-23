/**
 * Владелец корзины = req.user.id.
 * Параметр :user_id в URL / body.user_id не доверяем (IDOR).
 */
'use strict';

function forbidden(message = 'Недостаточно прав для доступа к чужой корзине', code = 'FORBIDDEN') {
  const err = new Error(message);
  err.code = code;
  err.status = 403;
  return err;
}

/** Числовой id актора или null */
function actorUserId(user) {
  if (!user || user.id == null) return null;
  return Number(user.id);
}

/**
 * Разрешённый user_id для чтения/очистки корзины.
 * Если в URL/body передан другой id — 403 (не подменяем молча).
 *
 * @param {object} user — req.user
 * @param {string|number|null|undefined} requestedUserId — из params/body
 * @returns {number}
 */
function resolveOwnCartUserId(user, requestedUserId) {
  const actorId = actorUserId(user);
  if (actorId == null) {
    throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  }

  if (requestedUserId === undefined || requestedUserId === null || requestedUserId === '') {
    return actorId;
  }

  const requested = Number(requestedUserId);
  if (!Number.isFinite(requested) || requested !== actorId) {
    throw forbidden();
  }

  return actorId;
}

/**
 * Body для POST /carts: user_id всегда из актора.
 * Если клиент прислал чужой user_id — 403 (как у GET/clear).
 *
 * @param {object} user — req.user
 * @param {object} data — req.body
 * @returns {object} копия data с безопасным user_id
 */
function prepareCartCreatePayload(user, data = {}) {
  const user_id = resolveOwnCartUserId(user, data.user_id);
  return {
    ...data,
    user_id,
  };
}

/**
 * Строка корзины (Cart.id) принадлежит актору?
 * cartItem.user_id — владелец строки в БД.
 */
function assertOwnsCartItem(user, cartItem) {
  const actorId = actorUserId(user);
  if (actorId == null) {
    throw forbidden('Требуется авторизация', 'AUTH_REQUIRED');
  }
  if (!cartItem) {
    throw forbidden('Элемент корзины не найден', 'NOT_FOUND');
  }
  if (Number(cartItem.user_id) !== actorId) {
    throw forbidden('Недостаточно прав для доступа к чужой позиции корзины');
  }
}

/**
 * PUT /carts/item/:id — нельзя сменить владельца через body.user_id.
 */
function sanitizeCartItemUpdatePayload(data = {}) {
  const payload = { ...data };
  delete payload.user_id;
  delete payload.id;
  return payload;
}

module.exports = {
  actorUserId,
  resolveOwnCartUserId,
  prepareCartCreatePayload,
  assertOwnsCartItem,
  sanitizeCartItemUpdatePayload,
};
