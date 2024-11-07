const researchService = require('../services/researchService'); // Путь к вашему сервису

// Создание нового исследования
const createResearch = async (req, res) => {
  try {
    const newResearch = await researchService.createResearch(req.body);
    return res.status(201).json(newResearch);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех исследований
const getAllResearches = async (req, res) => {
  try {
    const researches = await researchService.getAllResearches();
    return res.status(200).json(researches);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение исследования по ID
const getResearchById = async (req, res) => {
  const { id } = req.params;
  try {
    const research = await researchService.getResearchById(id);
    return res.status(200).json(research);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление исследования по ID
const updateResearch = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedResearch = await researchService.updateResearch(id, req.body);
    return res.status(200).json(updatedResearch);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление исследования по ID
const deleteResearch = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await researchService.deleteResearch(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createResearch,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch
};
