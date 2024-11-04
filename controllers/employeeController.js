const employeeService = require('../services/employeeService'); // Путь к вашему сервису

// Создание нового сотрудника
const createEmployee = async (req, res) => {
  try {
    const newEmployee = await employeeService.createEmployee(req.body);
    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех сотрудников
const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение сотрудника по ID
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await employeeService.getEmployeeById(id);
    return res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление данных сотрудника по ID
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEmployee = await employeeService.updateEmployee(id, req.body);
    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление сотрудника по ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await employeeService.deleteEmployee(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
