const express = require('express');
const router = express.Router();
const chemMixtureController = require('../controllers/chemMixtureController'); // Путь к вашему контроллеру

// Создание новой химической смеси
router.post('/', chemMixtureController.createChemMixture);

// Получение всех записей химических смесей
router.get('/', chemMixtureController.getAllChemMixtures);

// Получение химической смеси по уникальному идентификатору
router.get('/:id', chemMixtureController.getChemMixtureById);

// Обновление данных химической смеси по уникальному идентификатору
router.put('/:id', chemMixtureController.updateChemMixture);

// Удаление химической смеси по уникальному идентификатору
router.delete('/:id', chemMixtureController.deleteChemMixture);

module.exports = router;
