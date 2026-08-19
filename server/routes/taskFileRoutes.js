const express = require('express');
const router = express.Router();
const taskFileController = require('../controllers/taskFileController');

// Загрузка файла для задачи
router.post('/upload', taskFileController.uploadTaskFile);

// Получение всех файлов, привязанных к задаче
router.get('/task/:taskId', taskFileController.getTaskFiles);

// ВАЖНО: более специфичный путь должен идти раньше /:id,
// иначе "/research/:researchId" попадёт в getTaskFileById как id="research".
router.get('/research/:researchId', taskFileController.getTaskFilesByResearch);

// Получение информации о конкретном файле
router.get('/:id', taskFileController.getTaskFileById);

// Удаление файла
router.delete('/:id', taskFileController.deleteTaskFile);

module.exports = router;
