const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController'); // Путь к вашему контроллеру

// Создание нового исследования
router.post('/', researchController.createResearch);
// Создание нового исследования с участниками
router.post('/with-participants', researchController.createResearchWithParticipants);

// Получение всех исследований
router.get('/', researchController.getAllResearches);

router.get('/ongoing/count', researchController.getOngoingResearchCount);

// Получение исследования по ID
router.get('/:id', researchController.getResearchById);

// Обновление исследования по ID
router.put('/:id', researchController.updateResearch);

// Удаление исследования по ID
router.delete('/:id', researchController.deleteResearch);

router.post('/:researchId/participants', researchController.addParticipantsToResearch);

module.exports = router;
