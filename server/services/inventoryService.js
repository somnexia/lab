const { Inventory } = require('../models');

// Создание новой записи Inventory
const createInventoryItem = async (data) => {
  try {
    const inventoryItem = await Inventory.create(data);
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при создании записи Inventory:', error);
    throw error;
  }
};

// Получение всех записей Inventory
const getAllInventoryItems = async () => {
  try {
    return await Inventory.findAll();
  } catch (error) {
    console.error('Ошибка при получении записей Inventory:', error);
    throw error;
  }
};

// Получение записи Inventory по ID
const getInventoryItemById = async (id) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при получении записи Inventory по id:', error);
    throw error;
  }
};

// Обновление записи Inventory по ID
const updateInventoryItem = async (id, data) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await inventoryItem.update(data);
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при обновлении записи Inventory:', error);
    throw error;
  }
};

// Удаление записи Inventory по ID
const deleteInventoryItem = async (id) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await inventoryItem.destroy();
    return { message: `Запись Inventory с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении записи Inventory:', error);
    throw error;
  }
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
};
