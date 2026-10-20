const { Employee, User, Laboratory } = require('../models');
const {
  scopeByLab,
  assertLabAccess,
  enforceLabOnCreate,
} = require('../utils/labScope');

/** Фаза 5b: employees.lab_id */

const createEmployee = async (data, user) => {
  try {
    const lab_id = enforceLabOnCreate(user, data.lab_id ?? data.laboratory_id);
    return await Employee.create({ ...data, lab_id });
  } catch (error) {
    console.error('Ошибка при создании сотрудника:', error);
    throw error;
  }
};

const getAllEmployees = async (user) => {
  try {
    return await Employee.findAll({
      where: scopeByLab(user, {}, { field: 'lab_id' }),
      include: [
        { model: User, as: 'user' },
        { model: Laboratory, as: 'laboratory' },
      ],
    });
  } catch (error) {
    console.error('Ошибка при получении списка сотрудников:', error);
    throw error;
  }
};

const getEmployeeById = async (id, user) => {
  try {
    const employee = await Employee.findByPk(id, {
      include: { association: 'laboratory' },
    });
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    assertLabAccess(user, employee.lab_id, 'просмотра сотрудника');
    return employee;
  } catch (error) {
    console.error('Ошибка при получении сотрудника по id:', error);
    throw error;
  }
};

const updateEmployee = async (id, data, user) => {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    assertLabAccess(user, employee.lab_id, 'изменения сотрудника');
    if (data.lab_id != null || data.laboratory_id != null) {
      data.lab_id = enforceLabOnCreate(user, data.lab_id ?? data.laboratory_id);
    }
    await employee.update(data);
    return employee;
  } catch (error) {
    console.error('Ошибка при обновлении сотрудника:', error);
    throw error;
  }
};

const deleteEmployee = async (id, user) => {
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw new Error(`Сотрудник с id ${id} не найден`);
    }
    assertLabAccess(user, employee.lab_id, 'удаления сотрудника');
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
  deleteEmployee,
};
