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
 * authorize на tasks (роль).
 * «Свои» записи — в taskService / researchScope:
 *   student — только task.user_id === req.user.id
 *   researcher / lab_admin — research своей lab/команды
 * Create: владелец задачи (user_id) должен быть в researchemployees
 * этого research (через users.employee_id).
 * Delete — CAN_MANAGE_RESEARCH + тот же scope в сервисе.
 */
router.post('/', authorize(CAN_VIEW_TASKS), taskController.createTask);
router.get('/', authorize(CAN_VIEW_TASKS), taskController.getAllTasks);
router.get('/research', authorize(CAN_VIEW_TASKS), taskController.getTasksByResearch);
router.get('/:id', authorize(CAN_VIEW_TASKS), taskController.getTaskById);
router.put('/:id', authorize(CAN_VIEW_TASKS), taskController.updateTask);
router.delete('/:id', authorize(CAN_MANAGE_RESEARCH), taskController.deleteTask);

module.exports = router;
