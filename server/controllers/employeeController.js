const employeeService = require('../services/employeeService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error)) {
    return res.status(403).json({ error: error.message, code: error.code });
  }
  if (/не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  console.error(error);
  return res.status(fallbackStatus).json({ error: error.message });
}

const createEmployee = async (req, res) => {
  try {
    const newEmployee = await employeeService.createEmployee(req.body, req.user);
    return res.status(201).json(newEmployee);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees(req.user);
    return res.status(200).json(employees);
  } catch (error) {
    return sendError(res, error);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id, req.user);
    return res.status(200).json(employee);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeeService.updateEmployee(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedEmployee);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
