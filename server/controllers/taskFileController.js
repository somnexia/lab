const taskFileService = require('../services/taskFileService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  console.error(error);
  return res.status(fallbackStatus).json({ error: error.message });
}

const uploadTaskFile = async (req, res) => {
  const { task_id, file_path, file_type, file_size, uploaded_by } = req.body;

  if (!task_id || !file_path || !file_type || !file_size) {
    return res.status(400).json({ error: 'task_id, file_path, file_type и file_size обязательны' });
  }

  try {
    const taskFile = await taskFileService.uploadTaskFile(
      task_id,
      file_path,
      file_type,
      file_size,
      uploaded_by ?? req.user?.id,
      req.user
    );
    return res.status(201).json(taskFile);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTaskFiles = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).json({ error: 'Не указан taskId' });
  }

  try {
    const files = await taskFileService.getTaskFiles(taskId, req.user);
    return res.status(200).json(files);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTaskFilesByResearch = async (req, res) => {
  const { researchId } = req.params;
  if (!researchId) {
    return res.status(400).json({ error: 'Не указан researchId' });
  }

  try {
    const files = await taskFileService.getTaskFilesByResearch(researchId, req.user);
    return res.status(200).json(files);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTaskFileById = async (req, res) => {
  try {
    const file = await taskFileService.getTaskFileById(req.params.id, req.user);
    return res.status(200).json(file);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteTaskFile = async (req, res) => {
  try {
    const message = await taskFileService.deleteTaskFile(req.params.id, req.user);
    return res.status(200).json(message);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  uploadTaskFile,
  getTaskFiles,
  getTaskFileById,
  deleteTaskFile,
  getTaskFilesByResearch,
};
