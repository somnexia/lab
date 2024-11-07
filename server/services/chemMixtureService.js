const { ChemMixture } = require('../models');

// Создание новой химической смеси
const createChemMixture = async (data) => {
  try {
    const mixture = await ChemMixture.create(data);
    return mixture;
  } catch (error) {
    console.error('Ошибка при создании химической смеси:', error);
    throw error;
  }
};

// Получение всех записей химических смесей
const getAllChemMixtures = async () => {
  try {
    return await ChemMixture.findAll();
  } catch (error) {
    console.error('Ошибка при получении списка химических смесей:', error);
    throw error;
  }
};

// Получение химической смеси по уникальному идентификатору
const getChemMixtureById = async (id) => {
  try {
    const mixture = await ChemMixture.findByPk(id);
    if (!mixture) {
      throw new Error(`Химическая смесь с id ${id} не найдена`);
    }
    return mixture;
  } catch (error) {
    console.error('Ошибка при получении химической смеси по id:', error);
    throw error;
  }
};

// Обновление данных химической смеси по уникальному идентификатору
const updateChemMixture = async (id, data) => {
  try {
    const mixture = await ChemMixture.findByPk(id);
    if (!mixture) {
      throw new Error(`Химическая смесь с id ${id} не найдена`);
    }
    await mixture.update(data);
    return mixture;
  } catch (error) {
    console.error('Ошибка при обновлении химической смеси:', error);
    throw error;
  }
};

// Удаление химической смеси по уникальному идентификатору
const deleteChemMixture = async (id) => {
  try {
    const mixture = await ChemMixture.findByPk(id);
    if (!mixture) {
      throw new Error(`Химическая смесь с id ${id} не найдена`);
    }
    await mixture.destroy();
    return { message: `Химическая смесь с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении химической смеси:', error);
    throw error;
  }
};

module.exports = {
  createChemMixture,
  getAllChemMixtures,
  getChemMixtureById,
  updateChemMixture,
  deleteChemMixture
};
