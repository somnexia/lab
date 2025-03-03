const researchEmployeeService = require('../services/researchEmployeeService'); // Подключаем сервис

// Создание новой записи ResearchEmployee
const createResearchEmployee = async (req, res) => {
  try {
    const newResearchEmployee = await researchEmployeeService.createResearchEmployee(req.body);
    return res.status(201).json(newResearchEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех записей ResearchEmployee
const getAllResearchEmployees = async (req, res) => {
  try {
    const researchEmployees = await researchEmployeeService.getAllResearchEmployees();
    return res.status(200).json(researchEmployees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение записи ResearchEmployee по ID
const getResearchEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const researchEmployee = await researchEmployeeService.getResearchEmployeeById(id);
    return res.status(200).json(researchEmployee);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление записи ResearchEmployee по ID
const updateResearchEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedResearchEmployee = await researchEmployeeService.updateResearchEmployee(id, req.body);
    return res.status(200).json(updatedResearchEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление записи ResearchEmployee по ID
const deleteResearchEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await researchEmployeeService.deleteResearchEmployee(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createResearchEmployee,
  getAllResearchEmployees,
  getResearchEmployeeById,
  updateResearchEmployee,
  deleteResearchEmployee
};
