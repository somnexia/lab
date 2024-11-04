const { Research } = require('../models');

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

module.exports = {
  createResearch,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch
};
