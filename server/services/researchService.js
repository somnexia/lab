const { Research, ResearchEmployee, Employee } = require('../models');
// Создание нового исследования
const createResearch = async (data) => {
  try {
    const research = await Research.create(data);
    return research;
  } catch (error) {
    console.error('Ошибка при создании исследования:', error);
    throw error;
  }
};
// Получение всех исследований
const getAllResearches = async () => {
  try {
    return await Research.findAll();
  } catch (error) {
    console.error('Ошибка при получении списка исследований:', error);
    throw error;
  }
};
// Получение исследования по ID
const getResearchById = async (id) => {
  try {
    const research = await Research.findByPk(id);
    if (!research) {
      throw new Error(`Исследование с id ${id} не найдено`);
    }
    return research;
  } catch (error) {
    console.error('Ошибка при получении исследования по id:', error);
    throw error;
  }
};
// Обновление исследования по ID
const updateResearch = async (id, data) => {
  try {
    const research = await Research.findByPk(id);
    if (!research) {
      throw new Error(`Исследование с id ${id} не найдено`);
    }
    await research.update(data);
    return research;
  } catch (error) {
    console.error('Ошибка при обновлении исследования:', error);
    throw error;
  }
};
// Удаление исследования по ID
const deleteResearch = async (id) => {
  try {
    const research = await Research.findByPk(id);
    if (!research) {
      throw new Error(`Исследование с id ${id} не найдено`);
    }
    await research.destroy();
    return { message: `Исследование с id ${id} удалено` };
  } catch (error) {
    console.error('Ошибка при удалении исследования:', error);
    throw error;
  }
};
const createResearchWithParticipants = async (data, employeeIds) => {
  try {
    const research = await Research.create(data); // создаём исследование

    if (employeeIds && employeeIds.length > 0) {
      const participants = employeeIds.map(employeeId => ({
        research_id: research.id,
        employee_id: employeeId
      }));
      await ResearchEmployee.bulkCreate(participants); // добавляем участников
    }

    return research;
  } catch (error) {
    console.error('Ошибка при создании исследования с участниками:', error);
    throw error;
  }
};
const addResearchParticipants = async (researchId, employeeIds) => {
  try {
    const research = await Research.findByPk(researchId);  // Проверяем, существует ли исследование
    if (!research) throw new Error('Research not found');
    // Добавляем сотрудников в таблицу researchEmployee
    const participants = employeeIds.map(employeeId => ({
      research_id: researchId,
      employee_id: employeeId
    }));
    await ResearchEmployee.bulkCreate(participants); // Используем bulkCreate для добавления нескольких записей
    return { message: 'Participants added successfully' };
  } catch (error) {
    console.error('Error adding participants:', error);
    throw new Error('Error adding participants');
  }
};
const getOngoingResearchCount = async () => {
  try {
    const count = await Research.count({
      where: { status: 'Ongoing' }
    });
    return count;
  } catch (error) {
    console.error('Ошибка при подсчете ongoing-исследований:', error);
    throw error;
  }
};
module.exports = {
  createResearch,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch,
  createResearchWithParticipants,
  addResearchParticipants,
  getOngoingResearchCount,
};
