const { ResearchEmployee, Research, Employee } = require('../models');
const { scopeMembershipsWhere } = require('../utils/researchScope');

/** Ошибка «уже в команде» → HTTP 409 Conflict */
function membershipConflictError(researchId, employeeId) {
  return Object.assign(
    new Error(
      `Сотрудник ${employeeId} уже состоит в команде исследования ${researchId}`
    ),
    { code: 'CONFLICT', status: 409 }
  );
}

/** Sequelize / MySQL: нарушение unique (research_id, employee_id) */
function isUniqueMembershipError(error) {
  if (!error) return false;
  if (error.name === 'SequelizeUniqueConstraintError') return true;
  const parentCode = error.parent?.code || error.original?.code;
  return parentCode === 'ER_DUP_ENTRY';
}

/**
 * Создаёт membership. Повтор той же пары (research, employee) → 409,
 * а не сырая ошибка БД. Проверка findOne + ловля unique на гонке.
 */
const createResearchEmployee = async (data = {}) => {
  try {
    const research_id = Number(data.research_id ?? data.researchId);
    const employee_id = Number(data.employee_id ?? data.employeeId);

    if (!Number.isFinite(research_id) || !Number.isFinite(employee_id)) {
      throw Object.assign(
        new Error('research_id и employee_id обязательны'),
        { code: 'VALIDATION', status: 400 }
      );
    }

    const existing = await ResearchEmployee.findOne({
      where: { research_id, employee_id },
    });
    if (existing) {
      throw membershipConflictError(research_id, employee_id);
    }

    try {
      return await ResearchEmployee.create({
        ...data,
        research_id,
        employee_id,
      });
    } catch (error) {
      if (isUniqueMembershipError(error)) {
        throw membershipConflictError(research_id, employee_id);
      }
      throw error;
    }
  } catch (error) {
    console.error('Ошибка при создании записи ResearchEmployee:', error);
    throw error;
  }
};
const membershipInclude = [
  { model: Research, as: 'research' },
  {
    model: Employee,
    as: 'employee',
    include: [{ association: 'laboratory', required: false }],
  },
];

/**
 * Список memberships с фильтром lab/team по req.user.
 */
const getAllResearchEmployees = async (filters = {}, user) => {
  try {
    const where = {};
    if (filters.researchId != null) {
      where.research_id = Number(filters.researchId);
    }
    if (filters.employeeId != null) {
      where.employee_id = Number(filters.employeeId);
    }

    const scoped = await scopeMembershipsWhere(user, where);

    return await ResearchEmployee.findAll({
      where: scoped,
      include: membershipInclude,
      order: [['id', 'ASC']],
    });
  } catch (error) {
    console.error('Ошибка при получении записей ResearchEmployee:', error);
    throw error;
  }
};

const getByResearchId = async (researchId, user) => {
  return getAllResearchEmployees({ researchId }, user);
};

const getByEmployeeId = async (employeeId, user) => {
  return getAllResearchEmployees({ employeeId }, user);
};
// Получение записи ResearchEmployee по ID
const getResearchEmployeeById = async (id) => {
  try {
    const researchEmployee = await ResearchEmployee.findByPk(id, {
      include: [
        { model: Research, as: 'research' },
        { model: Employee, as: 'employee' }
      ]
    });
    if (!researchEmployee) {
      throw new Error(`Запись ResearchEmployee с id ${id} не найдена`);
    }
    return researchEmployee;
  } catch (error) {
    console.error('Ошибка при получении записи ResearchEmployee по id:', error);
    throw error;
  }
};
/**
 * Обновляет membership. Смена research_id / employee_id на уже
 * существующую пару → 409.
 */
const updateResearchEmployee = async (id, data = {}) => {
  try {
    const researchEmployee = await ResearchEmployee.findByPk(id);
    if (!researchEmployee) {
      throw Object.assign(
        new Error(`Запись ResearchEmployee с id ${id} не найдена`),
        { code: 'NOT_FOUND', status: 404 }
      );
    }

    const nextResearchId = Number(
      data.research_id ?? data.researchId ?? researchEmployee.research_id
    );
    const nextEmployeeId = Number(
      data.employee_id ?? data.employeeId ?? researchEmployee.employee_id
    );

    const pairChanged =
      Number(nextResearchId) !== Number(researchEmployee.research_id) ||
      Number(nextEmployeeId) !== Number(researchEmployee.employee_id);

    if (pairChanged && Number.isFinite(nextResearchId) && Number.isFinite(nextEmployeeId)) {
      const clash = await ResearchEmployee.findOne({
        where: {
          research_id: nextResearchId,
          employee_id: nextEmployeeId,
        },
      });
      if (clash && Number(clash.id) !== Number(researchEmployee.id)) {
        throw membershipConflictError(nextResearchId, nextEmployeeId);
      }
    }

    const payload = { ...data };
    if (data.research_id !== undefined || data.researchId !== undefined) {
      payload.research_id = nextResearchId;
      delete payload.researchId;
    }
    if (data.employee_id !== undefined || data.employeeId !== undefined) {
      payload.employee_id = nextEmployeeId;
      delete payload.employeeId;
    }

    try {
      await researchEmployee.update(payload);
    } catch (error) {
      if (isUniqueMembershipError(error)) {
        throw membershipConflictError(nextResearchId, nextEmployeeId);
      }
      throw error;
    }
    return researchEmployee;
  } catch (error) {
    console.error('Ошибка при обновлении записи ResearchEmployee:', error);
    throw error;
  }
};
// Удаление записи ResearchEmployee по ID
const deleteResearchEmployee = async (id) => {
  try {
    const researchEmployee = await ResearchEmployee.findByPk(id);
    if (!researchEmployee) {
      throw new Error(`Запись ResearchEmployee с id ${id} не найдена`);
    }
    await researchEmployee.destroy();
    return { message: `Запись ResearchEmployee с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении записи ResearchEmployee:', error);
    throw error;
  }
};
module.exports = {
  createResearchEmployee,
  getAllResearchEmployees,
  getByResearchId,
  getByEmployeeId,
  getResearchEmployeeById,
  updateResearchEmployee,
  deleteResearchEmployee,
  membershipConflictError,
  isUniqueMembershipError,
};
