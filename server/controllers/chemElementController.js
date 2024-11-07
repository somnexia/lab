const chemElementService = require('../services/chemElementService');

// Создать элемент
const createChemElement = async (req, res) => {
  try {
    const newElement = await chemElementService.createChemElement(req.body);
    return res.status(201).json(newElement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получить все элементы
const getAllChemElements = async (req, res) => {
  try {
    const elements = await chemElementService.getAllChemElements();
    return res.status(200).json(elements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получить элемент по ID
const getChemElementById = async (req, res) => {
  const { id } = req.params;
  try {
    const element = await chemElementService.getChemElementById(id);
    if (!element) {
      return res.status(404).json({ error: `Элемент с ID ${id} не найден` });
    }
    return res.status(200).json(element);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Обновить элемент
const updateChemElement = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedElement = await chemElementService.updateChemElement(id, req.body);
    return res.status(200).json(updatedElement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удалить элемент
const deleteChemElement = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await chemElementService.deleteChemElement(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChemElement,
  getAllChemElements,
  getChemElementById,
  updateChemElement,
  deleteChemElement
};
