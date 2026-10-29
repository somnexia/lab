const researchService = require('../services/researchService');
const logService = require('../services/logService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (
    isScopeForbidden(error) ||
    error.code === 'FORBIDDEN' ||
    error.code === 'LAB_REQUIRED'
  ) {
    return res.status(403).json({
      error: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  if (error.code === 'CONFLICT' || error.status === 409) {
    return res.status(409).json({
      error: error.message,
      code: 'CONFLICT',
    });
  }
  if (error.code === 'VALIDATION' || error.status === 400) {
    return res.status(400).json({
      error: error.message,
      code: 'VALIDATION',
    });
  }
  console.error(error);
  return res.status(error.status || fallbackStatus).json({ error: error.message });
}

const createResearch = async (req, res) => {
  try {
    if (Object.values(req.body).some((value) => value === null || value === undefined || value === '')) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    const newResearch = await researchService.createResearch(req.body, req.user);
    await logService.safeRecordAuditLog({
      action: logService.LOG_ACTIONS.RESEARCH_CREATED,
      userId: req.user?.id ?? null,
      resourceType: 'Research',
      resourceId: newResearch.id,
      description: { title: newResearch.title, type: newResearch.type },
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta({}, req),
    });
    return res.status(201).json(newResearch);
  } catch (error) {
    return sendError(res, error);
  }
};

const createResearchWithParticipants = async (req, res) => {
  try {
    const { researchData, employeeIds } = req.body;

    if (!researchData || typeof researchData !== 'object' || !employeeIds || !Array.isArray(employeeIds)) {
      return res.status(400).json({
        error: 'Некорректные данные. Ожидались researchData и employeeIds.',
      });
    }

    if (Object.values(researchData).some((value) => value === null || value === undefined || value === '')) {
      return res.status(400).json({ error: 'Все поля исследования обязательны' });
    }

    const newResearch = await researchService.createResearchWithParticipants(
      researchData,
      employeeIds,
      req.user
    );
    return res.status(201).json(newResearch);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllResearches = async (req, res) => {
  try {
    const includeParticipants =
      req.query.includeParticipants === 'true' || req.query.include === 'participants';
    const researches = await researchService.getAllResearches(
      { includeParticipants },
      req.user
    );
    return res.status(200).json(researches);
  } catch (error) {
    return sendError(res, error);
  }
};

const getResearchById = async (req, res) => {
  try {
    const includeParticipants =
      req.query.includeParticipants === 'true' || req.query.include === 'participants';
    const research = await researchService.getResearchById(
      req.params.id,
      { includeParticipants },
      req.user
    );
    return res.status(200).json(research);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateResearch = async (req, res) => {
  try {
    const updatedResearch = await researchService.updateResearch(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedResearch);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteResearch = async (req, res) => {
  try {
    const result = await researchService.deleteResearch(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

const addParticipantsToResearch = async (req, res) => {
  try {
    const { researchId, employeeIds } = req.body;
    const response = await researchService.addResearchParticipants(
      researchId,
      employeeIds,
      req.user
    );
    return res.status(200).json(response);
  } catch (error) {
    return sendError(res, error);
  }
};

const getOngoingResearchCount = async (req, res) => {
  try {
    const count = await researchService.getOngoingResearchCount(req.user);
    return res.status(200).json({ count });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createResearch,
  createResearchWithParticipants,
  getAllResearches,
  getResearchById,
  updateResearch,
  deleteResearch,
  addParticipantsToResearch,
  getOngoingResearchCount,
};
