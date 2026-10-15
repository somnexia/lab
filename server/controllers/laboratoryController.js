const laboratoryService = require('../services/laboratoryService');

function sendServiceError(res, error) {
  const status = error.status || (error.code === 'FORBIDDEN' || error.code === 'LAB_REQUIRED' ? 403 : 500);
  if (status === 404 || (error.message && /не найдена/i.test(error.message) && status === 500)) {
    // findByPk not found без status — 404
  }
  const code = error.code;
  if (code === 'FORBIDDEN' || code === 'LAB_REQUIRED') {
    return res.status(403).json({ error: error.message, code });
  }
  if (/не найдена/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  console.error(error);
  return res.status(status >= 400 && status < 600 ? status : 500).json({
    error: error.message,
    code: error.code,
  });
}

/**
 * Фаза 5a: во все вызовы сервиса передаём req.user (из authenticate).
 */
const createLaboratory = async (req, res) => {
  try {
    const newLaboratory = await laboratoryService.createLaboratory(req.body, req.user);
    return res.status(201).json(newLaboratory);
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const getAllLaboratories = async (req, res) => {
  try {
    const laboratories = await laboratoryService.getAllLaboratories(req.user);
    return res.status(200).json(laboratories);
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const getLaboratoryById = async (req, res) => {
  try {
    const laboratory = await laboratoryService.getLaboratoryById(req.params.id, req.user);
    return res.status(200).json(laboratory);
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const updateLaboratory = async (req, res) => {
  try {
    const updatedLaboratory = await laboratoryService.updateLaboratory(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedLaboratory);
  } catch (error) {
    return sendServiceError(res, error);
  }
};

const deleteLaboratory = async (req, res) => {
  try {
    const result = await laboratoryService.deleteLaboratory(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return sendServiceError(res, error);
  }
};

module.exports = {
  createLaboratory,
  getAllLaboratories,
  getLaboratoryById,
  updateLaboratory,
  deleteLaboratory,
};
