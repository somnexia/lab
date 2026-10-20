/**
 * Фаза 5a/5b — tenant-scope по лаборатории.
 *
 * 5a: laboratories (field: id)
 * 5b: chemstorages, storageUnits (через storage), employees (lab_id),
 *     experiments (laboratory_id), inventory (storage_id → chemstorage),
 *     research-teams / researches (через employee.lab_id), logs (users своей lab)
 *
 * system_admin → skipLabScope → без фильтра.
 */
'use strict';

const { Op } = require('sequelize');
const {
  skipLabScope,
  isSystemAdmin,
  getUserRole,
  ROLES,
} = require('../config/roles');

function resolveActorLabId(user) {
  if (!user) return null;
  if (skipLabScope(user)) return null;
  if (user.laboratory_id === undefined || user.laboratory_id === null) {
    return null;
  }
  return Number(user.laboratory_id);
}

/**
 * @param {object|null} user
 * @param {object} [where={}]
 * @param {{ field?: string }} [options] field: 'id' | 'laboratory_id' | 'lab_id'
 */
function scopeByLab(user, where = {}, options = {}) {
  const field = options.field || 'id';
  const next = { ...where };

  if (skipLabScope(user)) {
    return next;
  }

  const labId = resolveActorLabId(user);
  if (labId == null) {
    next[field] = -1;
    return next;
  }

  next[field] = labId;
  return next;
}

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

  if (requestedLabId != null && Number(requestedLabId) !== actorLab) {
    const err = new Error('Нельзя создать запись в чужой лаборатории');
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }

  return actorLab;
}

/**
 * ID складов (chemstorages) своей lab.
 * @returns {Promise<number[]|null>} null = все (system_admin); [] = ничего
 */
async function listChemStorageIdsForUser(user) {
  if (skipLabScope(user)) return null;

  const { ChemStorage } = require('../models');
  const labId = resolveActorLabId(user);
  if (labId == null) return [];

  const rows = await ChemStorage.findAll({
    where: { laboratory_id: labId },
    attributes: ['id'],
  });
  return rows.map((r) => r.id);
}

/**
 * where.storage_id IN (...) для inventory / storageUnits.
 * system_admin → where без изменений.
 */
async function scopeByStorageIds(user, where = {}, field = 'storage_id') {
  const next = { ...where };
  const ids = await listChemStorageIdsForUser(user);
  if (ids === null) return next;
  next[field] = { [Op.in]: ids.length ? ids : [-1] };
  return next;
}

/** HTTP-хелпер для контроллеров */
function isScopeForbidden(error) {
  return error && (error.code === 'FORBIDDEN' || error.code === 'LAB_REQUIRED');
}

module.exports = {
  skipLabScope,
  resolveActorLabId,
  scopeByLab,
  assertLabAccess,
  enforceLabOnCreate,
  listChemStorageIdsForUser,
  scopeByStorageIds,
  isScopeForbidden,
  isSystemAdmin,
  getUserRole,
  ROLES,
};
