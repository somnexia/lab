const express = require('express');
const router = express.Router();
const chemElementController = require('../controllers/chemElementController'); // Путь к вашему контроллеру

// Создать элемент
router.post('/', chemElementController.createChemElement);

// Получить все элементы
router.get('/', chemElementController.getAllChemElements);

// Получить элемент по ID
router.get('/:id', chemElementController.getChemElementById);

// Обновить элемент
router.put('/:id', chemElementController.updateChemElement);

// Удалить элемент
router.delete('/:id', chemElementController.deleteChemElement);

module.exports = router;
