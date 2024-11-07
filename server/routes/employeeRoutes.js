const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController'); // Путь к вашему контроллеру

// Создание нового сотрудника
router.post('/', employeeController.createEmployee);

// Получение всех сотрудников
router.get('/', employeeController.getAllEmployees);

// Получение сотрудника по ID
router.get('/:id', employeeController.getEmployeeById);

// Обновление данных сотрудника по ID
router.put('/:id', employeeController.updateEmployee);

// Удаление сотрудника по ID
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
