const chemMixtureService = require('../services/chemMixtureService');

// Создание новой химической смеси
const createChemMixture = async (req, res) => {
  try {
    const newMixture = await chemMixtureService.createChemMixture(req.body);
    return res.status(201).json(newMixture);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех записей химических смесей
const getAllChemMixtures = async (req, res) => {
  try {
    const mixtures = await chemMixtureService.getAllChemMixtures();
    return res.status(200).json(mixtures);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение химической смеси по уникальному идентификатору
const getChemMixtureById = async (req, res) => {
  const { id } = req.params;
  try {
    const mixture = await chemMixtureService.getChemMixtureById(id);
    return res.status(200).json(mixture);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление данных химической смеси по уникальному идентификатору
const updateChemMixture = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMixture = await chemMixtureService.updateChemMixture(id, req.body);
    return res.status(200).json(updatedMixture);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление химической смеси по уникальному идентификатору
const deleteChemMixture = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await chemMixtureService.deleteChemMixture(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChemMixture,
  getAllChemMixtures,
  getChemMixtureById,
  updateChemMixture,
  deleteChemMixture
};
