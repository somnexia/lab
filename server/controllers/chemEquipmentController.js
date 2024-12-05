const chemEquipmentService = require('../services/chemEquipmentService');

// Создание нового оборудования
const createChemEquipment = async (req, res) => {
  try {
    const newEquipment = await chemEquipmentService.createChemEquipment(req.body);
    return res.status(201).json(newEquipment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех единиц оборудования
const getAllChemEquipments = async (req, res) => {
  try {
    const equipments = await chemEquipmentService.getAllChemEquipments();
    return res.status(200).json(equipments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение оборудования по уникальному идентификатору
const getChemEquipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const equipment = await chemEquipmentService.getChemEquipmentById(id);
    return res.status(200).json(equipment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

const getChemEquipmentByCategory = async (req, res) => {
  const { category } = req.query; // Категория передается как query параметр
  try {
    if (!category) {
      return res.status(400).json({ error: "Параметр 'category' обязателен" });
    }
    const equipments = await chemEquipmentService.getChemEquipmentByCategory(category);
    return res.status(200).json(equipments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Обновление информации об оборудовании по уникальному идентификатору
const updateChemEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEquipment = await chemEquipmentService.updateChemEquipment(id, req.body);
    return res.status(200).json(updatedEquipment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление оборудования по уникальному идентификатору
const deleteChemEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await chemEquipmentService.deleteChemEquipment(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};



const getGroupsByCategory = async (req, res) => {
  const { category } = req.query;
    try {
        

        if (!category) {
            return res.status(400).json({ message: "Категория не указана." });
        }

        // Вызов сервиса для получения групп
        const groups = await chemEquipmentService.getGroupsByCategory(category);

        res.status(200).json(groups); // Возвращаем массив групп
    } catch (error) {
        console.error("Ошибка в getGroupsByCategory контроллере:", error);
        res.status(500).json({ message: "Ошибка сервера при получении групп." });
    }
};

const getChemEquipmentByCategoryAndGroup = async (req, res) => {
  const { category, group } = req.query;

  try {
    // Проверяем, что категория передана
    if (!category) {
      return res.status(400).json({ message: "Категория обязательна" });
    }

    // Получаем оборудование по категории и группе
    const equipment = await chemEquipmentService.getChemEquipmentByCategoryAndGroup(category, group);
    
    // Возвращаем результаты
    return res.json(equipment);
  } catch (error) {
    console.error("Ошибка при получении оборудования по категории и группе:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
const getLocationsForEquipment = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID оборудования обязателен" });
    }

    const equipmentWithLocation = await chemEquipmentService.getLocationsForEquipment(id);

    return res.status(200).json(equipmentWithLocation);
  } catch (error) {
    console.error('Ошибка при получении расположения оборудования:', error);
    return res.status(500).json({ message: error.message });
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
  getLocationsForEquipment
};
