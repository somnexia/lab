// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_TASKS,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * Фаза 6b: authorize на tasks.
 * Чтение — все (CAN_VIEW_TASKS).
 * Create/update — все аутентифицированные с CAN_VIEW_TASKS (student Cˢ — «свои»
 * проверяется позже в сервисе); delete — CAN_MANAGE_RESEARCH (строже).
 *
 * Матрица: student Cˢ R Uˢ; delete обычно admin/researcher.
 */
router.post('/', authorize(CAN_VIEW_TASKS), taskController.createTask);
router.get('/', authorize(CAN_VIEW_TASKS), taskController.getAllTasks);
router.get('/research', authorize(CAN_VIEW_TASKS), taskController.getTasksByResearch);
router.get('/:id', authorize(CAN_VIEW_TASKS), taskController.getTaskById);
router.put('/:id', authorize(CAN_VIEW_TASKS), taskController.updateTask);
router.delete('/:id', authorize(CAN_MANAGE_RESEARCH), taskController.deleteTask);

module.exports = router;
