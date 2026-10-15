const { Laboratory } = require('../models');
const {
  scopeByLab,
  assertLabAccess,
  skipLabScope,
} = require('../utils/labScope');
const {
  CAN_CREATE_LABORATORIES,
  CAN_DELETE_LABORATORIES,
  hasRole,
} = require('../config/roles');

/**
 * Фаза 5a: laboratories режутся по tenant.
 * Таблица laboratories — корень tenant, поэтому scopeByLab(..., { field: 'id' }).
 */

function forbidden(message) {
  const err = new Error(message);
  err.code = 'FORBIDDEN';
  err.status = 403;
  return err;
}

const createLaboratory = async (data, user) => {
  // Только system_admin (дубль authorize на роуте)
  if (!hasRole(user, CAN_CREATE_LABORATORIES)) {
    throw forbidden('Создавать лаборатории может только system_admin');
  }
  try {
    return await Laboratory.create(data);
  } catch (error) {
    console.error('Ошибка при создании лаборатории:', error);
    throw error;
  }
};

/**
 * Список лабораторий с учётом tenant.
 * system_admin → все; остальные → только id === user.laboratory_id
 */
const getAllLaboratories = async (user) => {
  try {
    return await Laboratory.findAll({
      where: scopeByLab(user, {}, { field: 'id' }),
    });
  } catch (error) {
    console.error('Ошибка при получении списка лабораторий:', error);
    throw error;
  }
};

const getLaboratoryById = async (id, user) => {
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
    }
    // Для Laboratory resourceLabId = сама запись.id
    assertLabAccess(user, laboratory.id, 'просмотра лаборатории');
    return laboratory;
  } catch (error) {
    console.error('Ошибка при получении лаборатории по id:', error);
    throw error;
  }
};

const updateLaboratory = async (id, data, user) => {
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
    }
    // lab_admin — только свою; system_admin — любую
    assertLabAccess(user, laboratory.id, 'изменения лаборатории');
    await laboratory.update(data);
    return laboratory;
  } catch (error) {
    console.error('Ошибка при обновлении лаборатории:', error);
    throw error;
  }
};

const deleteLaboratory = async (id, user) => {
  if (!hasRole(user, CAN_DELETE_LABORATORIES)) {
    throw forbidden('Удалять лаборатории может только system_admin');
  }
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
    }
    // system_admin уже прошёл hasRole; assert не обязателен, но оставляем явность
    if (!skipLabScope(user)) {
      assertLabAccess(user, laboratory.id, 'удаления лаборатории');
    }
    await laboratory.destroy();
    return { message: `Лаборатория с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении лаборатории:', error);
    throw error;
  }
};

module.exports = {
  createLaboratory,
  getAllLaboratories,
  getLaboratoryById,
  updateLaboratory,
  deleteLaboratory,
};
