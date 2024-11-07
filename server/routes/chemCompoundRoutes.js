const express = require('express');
const router = express.Router();
const chemCompoundController = require('../controllers/chemCompoundController'); // Путь к вашему контроллеру

// Создание нового соединения
router.post('/', chemCompoundController.createChemCompound);

// Получение всех соединений
router.get('/', chemCompoundController.getAllChemCompounds);

// Получение соединения по уникальному идентификатору
router.get('/:id', chemCompoundController.getChemCompoundById);

// Обновление соединения по уникальному идентификатору
router.put('/:id', chemCompoundController.updateChemCompound);

// Удаление соединения по уникальному идентификатору
router.delete('/:id', chemCompoundController.deleteChemCompound);

module.exports = router;
