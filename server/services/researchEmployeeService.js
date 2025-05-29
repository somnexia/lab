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
// Получение всех записей ResearchEmployee
const getAllResearchEmployees = async () => {
  try {
    return await ResearchEmployee.findAll({
      include: [
        { model: Research, as: 'research' },
        { model: Employee, as: 'employee' }
      ]
    });
  } catch (error) {
    console.error('Ошибка при получении записей ResearchEmployee:', error);
    throw error;
  }
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
  getResearchEmployeeById,
  updateResearchEmployee,
  deleteResearchEmployee
};
