const chemCompoundService = require('../services/chemCompoundService');

// Создание нового соединения
const createChemCompound = async (req, res) => {
  try {
    const newCompound = await chemCompoundService.createChemCompound(req.body);
    return res.status(201).json(newCompound);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех соединений
const getAllChemCompounds = async (req, res) => {
  try {
    const compounds = await chemCompoundService.getAllChemCompounds();
    return res.status(200).json(compounds);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение соединения по уникальному идентификатору
const getChemCompoundById = async (req, res) => {
  const { id } = req.params;
  try {
    const compound = await chemCompoundService.getChemCompoundById(id);
    return res.status(200).json(compound);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление соединения по уникальному идентификатору
const updateChemCompound = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCompound = await chemCompoundService.updateChemCompound(id, req.body);
    return res.status(200).json(updatedCompound);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление соединения по уникальному идентификатору
const deleteChemCompound = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await chemCompoundService.deleteChemCompound(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChemCompound,
  getAllChemCompounds,
  getChemCompoundById,
  updateChemCompound,
  deleteChemCompound
};
