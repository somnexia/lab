const { ChemEquipment } = require('../models');
const { Sequelize } = require("sequelize");

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

const getChemEquipmentByCategory = async (category) => {
  try {
    return await ChemEquipment.findAll({ where: { category } });
  } catch (error) {
    console.error('Ошибка при получении оборудования по категории:', error);
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

const getGroupsByCategory = async (category) => {
  try {
      // Проверяем, передана ли категория
      if (!category) {
          throw new Error("Категория не указана.");
      }

      // Получаем уникальные значения групп для указанной категории
      const groups = await ChemEquipment.findAll({
          attributes: [
              [Sequelize.fn("DISTINCT", Sequelize.col("group")), "group"],
          ],
          where: { category },
      });

      return groups.map((g) => g.group); // Преобразуем результат в массив строк
  } catch (error) {
      console.error("Ошибка в getGroupsByCategory:", error);
      throw new Error("Ошибка сервера при получении групп."); // Пробрасываем ошибку для обработки в контроллере
  }
};

const getChemEquipmentByCategoryAndGroup = async (category, group) => {
  try {
    // Формируем условия поиска: фильтруем по категории и группе
    const whereConditions = { category };

    // Если передана группа, добавляем её в фильтр
    if (group) {
      whereConditions.group = group;
    }

    // Выполняем запрос с фильтрацией по категории и группе
    const equipment = await ChemEquipment.findAll({ where: whereConditions });
    return equipment;
  } catch (error) {
    console.error('Ошибка при получении оборудования по категории и группе:', error);
    throw error;
  }
};



module.exports = {
  createChemEquipment,
  getAllChemEquipments,
  getChemEquipmentById,
  getChemEquipmentByCategory,
  updateChemEquipment,
  deleteChemEquipment,
  getGroupsByCategory,
  getChemEquipmentByCategoryAndGroup,
};
