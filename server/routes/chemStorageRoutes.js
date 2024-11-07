const express = require('express');
const router = express.Router();
const chemStorageController = require('../controllers/chemStorageController'); // Путь к вашему контроллеру

// Создание новой записи в хранилище
router.post('/', chemStorageController.createStorage);

// Получение всех хранилищ
router.get('/', chemStorageController.getAllStorages);

// Получение хранилища по ID
router.get('/:id', chemStorageController.getStorageById);

// Обновление данных хранилища по ID
router.put('/:id', chemStorageController.updateStorage);

// Удаление хранилища по ID
router.delete('/:id', chemStorageController.deleteStorage);

module.exports = router;
