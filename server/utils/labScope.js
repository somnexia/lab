/**
 * Фаза 5a — tenant-scope по лаборатории.
 *
 * Зачем: JWT уже несёт laboratory_id (фаза 3), authorize режет роли (фаза 4).
 * Здесь режем ДАННЫЕ: lab_admin/researcher/student видят только свою lab;
 * system_admin — все (skipLabScope).
 *
 * Фаза 5a: утилита + домен laboratories.
 * Фаза 5b: storages, experiments, inventory, research, logs…
 *
 * Контракт: docs/README.md (вариант B, laboratory_id).
 */
'use strict';

const {
  skipLabScope,
  isSystemAdmin,
  getUserRole,
  ROLES,
} = require('../config/roles');

/**
 * Достаёт laboratory_id актёра из req.user / JWT-подобнойго объекта.
 * system_admin → null (нет «своей» lab, видит все).
 */
function resolveActorLabId(user) {
  if (!user) return null;
  if (skipLabScope(user)) return null;
  if (user.laboratory_id === undefined || user.laboratory_id === null) {
    return null;
  }
  return Number(user.laboratory_id);
}

/**
 * Добавляет фильтр Sequelize where по tenant.
 *
 * @param {object|null} user — req.user после authenticate
 * @param {object} [where={}] — уже собранный where
 * @param {object} [options]
 * @param {string} [options.field='id'] — для Laboratory таблица фильтруется по id;
 *   для ChemStorage будет field: 'laboratory_id' (фаза 5b)
 * @returns {object} where для Model.findAll({ where })
 *
 * Пример:
 *   Laboratory.findAll({ where: scopeByLab(req.user, {}, { field: 'id' }) })
 *   ChemStorage.findAll({ where: scopeByLab(req.user, {}, { field: 'laboratory_id' }) })
 */
function scopeByLab(user, where = {}, options = {}) {
  const field = options.field || 'id';
  const next = { ...where };

  if (skipLabScope(user)) {
    return next; // system_admin — без фильтра
  }

  const labId = resolveActorLabId(user);
  if (labId == null) {
    // Нет lab в токене (student без employee и т.п.) — пустая выборка, не «все»
    next[field] = -1;
    return next;
  }

  next[field] = labId;
  return next;
}

/**
 * Проверка доступа к одной записи с известным laboratory id.
 * @throws Error с code FORBIDDEN | LAB_REQUIRED
 */
function assertLabAccess(user, resourceLabId, action = 'access') {
  if (skipLabScope(user)) return;

  const actorLab = resolveActorLabId(user);
  if (actorLab == null) {
    const err = new Error('Учётная запись не привязана к лаборатории');
    err.code = 'LAB_REQUIRED';
    err.status = 403;
    throw err;
  }

  const resourceLab =
    resourceLabId === undefined || resourceLabId === null
      ? null
      : Number(resourceLabId);

  if (resourceLab == null || resourceLab !== actorLab) {
    const err = new Error(
      `Недостаточно прав для ${action}: чужая лаборатория`
    );
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }
}

/**
 * Для create: запретить подставить чужой laboratory_id в body.
 * Возвращает labId, который нужно записать (или null для system_admin без принуждения).
 */
function enforceLabOnCreate(user, requestedLabId) {
  if (skipLabScope(user)) {
    return requestedLabId == null ? null : Number(requestedLabId);
  }

  const actorLab = resolveActorLabId(user);
  if (actorLab == null) {
    const err = new Error('Учётная запись не привязана к лаборатории');
    err.code = 'LAB_REQUIRED';
    err.status = 403;
    throw err;
  }

  if (
    requestedLabId != null &&
    Number(requestedLabId) !== actorLab
  ) {
    const err = new Error('Нельзя создать запись в чужой лаборатории');
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }

  return actorLab;
}

module.exports = {
  skipLabScope,
  resolveActorLabId,
  scopeByLab,
  assertLabAccess,
  enforceLabOnCreate,
  isSystemAdmin,
  getUserRole,
  ROLES,
};
