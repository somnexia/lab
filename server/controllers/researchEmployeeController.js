const researchEmployeeService = require('../services/researchEmployeeService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  if (error.code === 'CONFLICT' || error.status === 409) {
    return res.status(409).json({
      error: error.message,
      code: 'CONFLICT',
    });
  }
  if (error.code === 'VALIDATION' || error.status === 400) {
    return res.status(400).json({
      error: error.message,
      code: 'VALIDATION',
    });
  }
  console.error(error);
  return res.status(error.status || fallbackStatus).json({ error: error.message });
}

const createResearchEmployee = async (req, res) => {
  try {
    const newResearchEmployee = await researchEmployeeService.createResearchEmployee(
      req.body,
      req.user
    );
    return res.status(201).json(newResearchEmployee);
  } catch (error) {
    return sendError(res, error);
  }
};

/** Список участников: только researches своей lab/команды */
const getAllResearchEmployees = async (req, res) => {
  try {
    const { researchId, employeeId } = req.query;
    const researchEmployees = await researchEmployeeService.getAllResearchEmployees(
      { researchId, employeeId },
      req.user
    );
    return res.status(200).json(researchEmployees);
  } catch (error) {
    return sendError(res, error);
  }
};

const getResearchEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const researchEmployee = await researchEmployeeService.getResearchEmployeeById(
      id,
      req.user
    );
    return res.status(200).json(researchEmployee);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateResearchEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedResearchEmployee = await researchEmployeeService.updateResearchEmployee(
      id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedResearchEmployee);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteResearchEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await researchEmployeeService.deleteResearchEmployee(
      id,
      req.user
    );
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createResearchEmployee,
  getAllResearchEmployees,
  getResearchEmployeeById,
  updateResearchEmployee,
  deleteResearchEmployee,
};
