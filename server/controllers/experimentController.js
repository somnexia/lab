const experimentService = require('../services/experimentService'); // Путь к вашему сервису

// Создание нового эксперимента
const createExperiment = async (req, res) => {
  try {
    const newExperiment = await experimentService.createExperiment(req.body);
    return res.status(201).json(newExperiment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех экспериментов
const getAllExperiments = async (req, res) => {
  try {
    const experiments = await experimentService.getAllExperiments();
    return res.status(200).json(experiments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение эксперимента по ID
const getExperimentById = async (req, res) => {
  const { id } = req.params;
  try {
    const experiment = await experimentService.getExperimentById(id);
    return res.status(200).json(experiment);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление эксперимента по ID
const updateExperiment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedExperiment = await experimentService.updateExperiment(id, req.body);
    return res.status(200).json(updatedExperiment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление эксперимента по ID
const deleteExperiment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await experimentService.deleteExperiment(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment
};
