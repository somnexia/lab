const { ChemElement } = require('../models');

// Создать элемент
const createChemElement = async (data) => {
  try {
    return await ChemElement.create(data);
  } catch (error) {
    console.error("Ошибка при создании элемента:", error);
    throw error;
  }
};

// Получить все элементы
const getAllChemElements = async () => {
  try {
    return await ChemElement.findAll();
  } catch (error) {
    console.error("Ошибка при получении всех элементов:", error);
    throw error;
  }
};

// Получить элемент по ID
const getChemElementById = async (id) => {
  try {
    return await ChemElement.findByPk(id);
  } catch (error) {
    console.error("Ошибка при получении элемента по ID:", error);
    throw error;
  }
};



// Обновить элемент
const updateChemElement = async (id, data) => {
  try {
    const element = await ChemElement.findByPk(id);
    if (!element) {
      throw new Error(`Элемент с ID ${id} не найден`);
    }
    await element.update(data);
    return element;
  } catch (error) {
    console.error("Ошибка при обновлении элемента:", error);
    throw error;
  }
};

// Удалить элемент
const deleteChemElement = async (id) => {
  try {
    const element = await ChemElement.findByPk(id);
    if (!element) {
      throw new Error(`Элемент с ID ${id} не найден`);
    }
    await element.destroy();
    return { message: `Элемент с ID ${id} удален` };
  } catch (error) {
    console.error("Ошибка при удалении элемента:", error);
    throw error;
  }
};

module.exports = {
  createChemElement,
  getAllChemElements,
  getChemElementById,
  updateChemElement,
  deleteChemElement
};
