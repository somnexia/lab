const { Employee, User, Laboratory } = require('../models');

// Создание нового сотрудника
const createEmployee = async (data) => {
  try {
    const employee = await Employee.create(data);
    return employee;
  } catch (error) {
    console.error('Ошибка при создании сотрудника:', error);
    throw error;
  }
};

// Получение всех сотрудников с возможностью включения лаборатории
const getAllEmployees = async () => {
  try {
    return await Employee.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Laboratory, as: 'laboratory' }
      ]
      
    });
  } catch (error) {
    console.error('Ошибка при получении списка сотрудников:', error);
    throw error;
  }
};

// Получение сотрудника по уникальному идентификатору
const getEmployeeById = async (id) => {
  try {
    const employee = await Employee.findByPk(id, {
      include: { association: 'laboratory' }
    });
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    return employee;
  } catch (error) {
    console.error('Ошибка при получении сотрудника по id:', error);
    throw error;
  }
};

// Обновление данных сотрудника по уникальному идентификатору
const updateEmployee = async (id, data) => {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    await employee.update(data);
    return employee;
  } catch (error) {
    console.error('Ошибка при обновлении сотрудника:', error);
    throw error;
  }
};

// Удаление сотрудника по уникальному идентификатору
const deleteEmployee = async (id) => {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    await employee.destroy();
    return { message: `Сотрудник с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении сотрудника:', error);
    throw error;
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
