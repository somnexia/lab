const { ChemCompound } = require('../models');

// Создание нового соединения
const createChemCompound = async (data) => {
  try {
    const compound = await ChemCompound.create(data);
    return compound;
  } catch (error) {
    console.error('Ошибка при создании соединения:', error);
    throw error;
  }
};

// Получение всех соединений
const getAllChemCompounds = async () => {
  try {
    return await ChemCompound.findAll();
  } catch (error) {
    console.error('Ошибка при получении соединений:', error);
    throw error;
  }
};

// Получение соединения по уникальному идентификатору
const getChemCompoundById = async (id) => {
  try {
    const compound = await ChemCompound.findByPk(id);
    if (!compound) {
      throw new Error(`Соединение с id ${id} не найдено`);
    }
    return compound;
  } catch (error) {
    console.error('Ошибка при получении соединения по id:', error);
    throw error;
  }
};

// Обновление соединения по уникальному идентификатору
const updateChemCompound = async (id, data) => {
  try {
    const compound = await ChemCompound.findByPk(id);
    if (!compound) {
      throw new Error(`Соединение с id ${id} не найдено`);
    }
    await compound.update(data);
    return compound;
  } catch (error) {
    console.error('Ошибка при обновлении соединения:', error);
    throw error;
  }
};

// Удаление соединения по уникальному идентификатору
const deleteChemCompound = async (id) => {
  try {
    const compound = await ChemCompound.findByPk(id);
    if (!compound) {
      throw new Error(`Соединение с id ${id} не найдено`);
    }
    await compound.destroy();
    return { message: `Соединение с id ${id} удалено` };
  } catch (error) {
    console.error('Ошибка при удалении соединения:', error);
    throw error;
  }
};

module.exports = {
  createChemCompound,
  getAllChemCompounds,
  getChemCompoundById,
  updateChemCompound,
  deleteChemCompound
};
