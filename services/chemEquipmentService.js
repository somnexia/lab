const { ChemEquipment } = require('../models');

// Создание нового оборудования
const createChemEquipment = async (data) => {
  try {
    const equipment = await ChemEquipment.create(data);
    return equipment;
  } catch (error) {
    console.error('Ошибка при создании оборудования:', error);
    throw error;
  }
};

// Получение всех единиц оборудования
const getAllChemEquipments = async () => {
  try {
    return await ChemEquipment.findAll();
  } catch (error) {
    console.error('Ошибка при получении оборудования:', error);
    throw error;
  }
};

// Получение оборудования по уникальному идентификатору
const getChemEquipmentById = async (id) => {
  try {
    const equipment = await ChemEquipment.findByPk(id);
    if (!equipment) {
      throw new Error(`Оборудование с id ${id} не найдено`);
    }
    return equipment;
  } catch (error) {
    console.error('Ошибка при получении оборудования по id:', error);
    throw error;
  }
};

// Обновление информации об оборудовании по уникальному идентификатору
const updateChemEquipment = async (id, data) => {
  try {
    const equipment = await ChemEquipment.findByPk(id);
    if (!equipment) {
      throw new Error(`Оборудование с id ${id} не найдено`);
    }
    await equipment.update(data);
    return equipment;
  } catch (error) {
    console.error('Ошибка при обновлении информации об оборудовании:', error);
    throw error;
  }
};

// Удаление оборудования по уникальному идентификатору
const deleteChemEquipment = async (id) => {
  try {
    const equipment = await ChemEquipment.findByPk(id);
    if (!equipment) {
      throw new Error(`Оборудование с id ${id} не найдено`);
    }
    await equipment.destroy();
    return { message: `Оборудование с id ${id} удалено` };
  } catch (error) {
    console.error('Ошибка при удалении оборудования:', error);
    throw error;
  }
};

module.exports = {
  createChemEquipment,
  getAllChemEquipments,
  getChemEquipmentById,
  updateChemEquipment,
  deleteChemEquipment
};
