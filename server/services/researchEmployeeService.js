const { ResearchEmployee, Research, Employee } = require('../models');
// Создание новой записи ResearchEmployee
const createResearchEmployee = async (data) => {
  try {
    const researchEmployee = await ResearchEmployee.create(data);
    return researchEmployee;
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

// Получение записей ResearchEmployee (опционально researchId, employeeId)
const getAllResearchEmployees = async (filters = {}) => {
  try {
    const where = {};
    if (filters.researchId != null) {
      where.research_id = Number(filters.researchId);
    }
    if (filters.employeeId != null) {
      where.employee_id = Number(filters.employeeId);
    }

    return await ResearchEmployee.findAll({
      where,
      include: membershipInclude,
      order: [['id', 'ASC']],
    });
  } catch (error) {
    console.error('Ошибка при получении записей ResearchEmployee:', error);
    throw error;
  }
};

const getByResearchId = async (researchId) => {
  return getAllResearchEmployees({ researchId });
};

const getByEmployeeId = async (employeeId) => {
  return getAllResearchEmployees({ employeeId });
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
// Обновление записи ResearchEmployee по ID
const updateResearchEmployee = async (id, data) => {
  try {
    const researchEmployee = await ResearchEmployee.findByPk(id);
    if (!researchEmployee) {
      throw new Error(`Запись ResearchEmployee с id ${id} не найдена`);
    }
    await researchEmployee.update(data);
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
};
