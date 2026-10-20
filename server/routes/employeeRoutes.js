const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_MANAGE_EMPLOYEES,
  CAN_VIEW_RESEARCH,
} = require('../config/roles');

/** Фаза 5b: список — все роли с доступом к research; мутации — admins */
router.post('/', authorize(CAN_MANAGE_EMPLOYEES), employeeController.createEmployee);
router.get('/', authorize(CAN_VIEW_RESEARCH), employeeController.getAllEmployees);
router.get('/:id', authorize(CAN_VIEW_RESEARCH), employeeController.getEmployeeById);
router.put('/:id', authorize(CAN_MANAGE_EMPLOYEES), employeeController.updateEmployee);
router.delete('/:id', authorize(CAN_MANAGE_EMPLOYEES), employeeController.deleteEmployee);

module.exports = router;
