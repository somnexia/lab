const laboratoryService = require('../services/laboratoryService'); // Путь к вашему сервису

// Создание новой лаборатории
const createLaboratory = async (req, res) => {
  try {
    const newLaboratory = await laboratoryService.createLaboratory(req.body);
    return res.status(201).json(newLaboratory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех лабораторий
const getAllLaboratories = async (req, res) => {
  try {
    const laboratories = await laboratoryService.getAllLaboratories();
    return res.status(200).json(laboratories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение лаборатории по уникальному идентификатору
const getLaboratoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const laboratory = await laboratoryService.getLaboratoryById(id);
    return res.status(200).json(laboratory);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление данных лаборатории по уникальному идентификатору
const updateLaboratory = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedLaboratory = await laboratoryService.updateLaboratory(id, req.body);
    return res.status(200).json(updatedLaboratory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление лаборатории по уникальному идентификатору
const deleteLaboratory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await laboratoryService.deleteLaboratory(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLaboratory,
  getAllLaboratories,
  getLaboratoryById,
  updateLaboratory,
  deleteLaboratory
};
