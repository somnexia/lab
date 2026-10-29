const { ResearchEmployee, Research, Employee } = require('../models');
const { scopeMembershipsWhere } = require('../utils/researchScope');

function validationError(message) {
  return Object.assign(new Error(message), {
    code: 'VALIDATION',
    status: 400,
  });
}

function notFoundError(message) {
  return Object.assign(new Error(message), {
    code: 'NOT_FOUND',
    status: 404,
  });
}

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

/** NOT NULL / SequelizeValidation — колонка обязательна */
function isNotNullMembershipError(error) {
  if (!error) return false;
  if (error.name === 'SequelizeValidationError') {
    return (error.errors || []).some(
      (e) =>
        e.path === 'research_id' ||
        e.path === 'employee_id' ||
        e.type === 'notNull Violation'
    );
  }
  const parentCode = error.parent?.code || error.original?.code;
  return parentCode === 'ER_BAD_NULL_ERROR';
}

/**
 * Положительное целое id. null / '' / мусор → 400.
 * Нужно: membership без research или employee в БД запрещён.
 */
function requireMembershipId(value, fieldName) {
  if (value === undefined || value === null || value === '') {
    throw validationError(`${fieldName} обязателен`);
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw validationError(
      `${fieldName} должен быть положительным целым числом`
    );
  }
  return n;
}

/** Проверяет, что research и employee реально существуют */
async function assertResearchAndEmployeeExist(researchId, employeeId) {
  const research = await Research.findByPk(researchId);
  if (!research) {
    throw notFoundError(`Исследование с id ${researchId} не найдено`);
  }
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw notFoundError(`Сотрудник с id ${employeeId} не найден`);
  }
}

/**
 * Создаёт membership. Оба id обязательны; повтор пары → 409.
 * Проверка findOne + ловля unique на гонке.
 */
const createResearchEmployee = async (data = {}) => {
  try {
    const research_id = requireMembershipId(
      data.research_id ?? data.researchId,
      'research_id'
    );
    const employee_id = requireMembershipId(
      data.employee_id ?? data.employeeId,
      'employee_id'
    );

    await assertResearchAndEmployeeExist(research_id, employee_id);

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
      if (isNotNullMembershipError(error)) {
        throw validationError('research_id и employee_id обязательны');
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
 * Обновляет membership. Нельзя обнулить research_id / employee_id.
 * Смена на уже занятую пару → 409.
 */
const updateResearchEmployee = async (id, data = {}) => {
  try {
    const researchEmployee = await ResearchEmployee.findByPk(id);
    if (!researchEmployee) {
      throw notFoundError(`Запись ResearchEmployee с id ${id} не найдена`);
    }

    const touchesResearch =
      data.research_id !== undefined || data.researchId !== undefined;
    const touchesEmployee =
      data.employee_id !== undefined || data.employeeId !== undefined;

    const nextResearchId = touchesResearch
      ? requireMembershipId(data.research_id ?? data.researchId, 'research_id')
      : Number(researchEmployee.research_id);
    const nextEmployeeId = touchesEmployee
      ? requireMembershipId(data.employee_id ?? data.employeeId, 'employee_id')
      : Number(researchEmployee.employee_id);

    const pairChanged =
      nextResearchId !== Number(researchEmployee.research_id) ||
      nextEmployeeId !== Number(researchEmployee.employee_id);

    if (pairChanged) {
      await assertResearchAndEmployeeExist(nextResearchId, nextEmployeeId);
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
    if (touchesResearch) {
      payload.research_id = nextResearchId;
      delete payload.researchId;
    }
    if (touchesEmployee) {
      payload.employee_id = nextEmployeeId;
      delete payload.employeeId;
    }

    try {
      await researchEmployee.update(payload);
    } catch (error) {
      if (isUniqueMembershipError(error)) {
        throw membershipConflictError(nextResearchId, nextEmployeeId);
      }
      if (isNotNullMembershipError(error)) {
        throw validationError('research_id и employee_id обязательны');
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
  isNotNullMembershipError,
  requireMembershipId,
  validationError,
};
