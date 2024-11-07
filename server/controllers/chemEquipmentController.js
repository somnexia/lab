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

module.exports = {
  createChemEquipment,
  getAllChemEquipments,
  getChemEquipmentById,
  updateChemEquipment,
  deleteChemEquipment
};
