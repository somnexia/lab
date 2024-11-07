const { Laboratory } = require('../models');

// Создание новой лаборатории
const createLaboratory = async (data) => {
  try {
    const laboratory = await Laboratory.create(data);
    return laboratory;
  } catch (error) {
    console.error('Ошибка при создании лаборатории:', error);
    throw error;
  }
};

// Получение всех лабораторий
const getAllLaboratories = async () => {
  try {
    return await Laboratory.findAll();
  } catch (error) {
    console.error('Ошибка при получении списка лабораторий:', error);
    throw error;
  }
};

// Получение лаборатории по уникальному идентификатору
const getLaboratoryById = async (id) => {
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
    }
    return laboratory;
  } catch (error) {
    console.error('Ошибка при получении лаборатории по id:', error);
    throw error;
  }
};

// Обновление данных лаборатории по уникальному идентификатору
const updateLaboratory = async (id, data) => {
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
    }
    await laboratory.update(data);
    return laboratory;
  } catch (error) {
    console.error('Ошибка при обновлении лаборатории:', error);
    throw error;
  }
};

// Удаление лаборатории по уникальному идентификатору
const deleteLaboratory = async (id) => {
  try {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) {
      throw new Error(`Лаборатория с id ${id} не найдена`);
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
  deleteLaboratory
};
