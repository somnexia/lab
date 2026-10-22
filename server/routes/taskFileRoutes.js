const express = require('express');
const router = express.Router();
const taskFileController = require('../controllers/taskFileController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_TASKS,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * Фаза 6b: файлы задач.
 * Upload/read — CAN_VIEW_TASKS; delete — CAN_MANAGE_RESEARCH (или владелец позже).
 */
router.post('/upload', authorize(CAN_VIEW_TASKS), taskFileController.uploadTaskFile);

router.get('/task/:taskId', authorize(CAN_VIEW_TASKS), taskFileController.getTaskFiles);

// Более специфичный путь раньше /:id
router.get(
  '/research/:researchId',
  authorize(CAN_VIEW_TASKS),
  taskFileController.getTaskFilesByResearch
);

router.get('/:id', authorize(CAN_VIEW_TASKS), taskFileController.getTaskFileById);

router.delete('/:id', authorize(CAN_MANAGE_RESEARCH), taskFileController.deleteTaskFile);

module.exports = router;
