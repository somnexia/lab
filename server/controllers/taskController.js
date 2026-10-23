const taskService = require('../services/taskService');
const logService = require('../services/logService');
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

const createTask = async (req, res) => {
  const { research_id, title, start_date } = req.body;

  if (!research_id || !title || !start_date) {
    return res.status(400).json({
      error: 'research_id, title и start_date обязательны',
    });
  }

  try {
    const task = await taskService.createTask(req.body, req.user);
    await logService.safeRecordAuditLog({
      action: logService.LOG_ACTIONS.TASK_CREATED,
      userId: req.user?.id != null ? Number(req.user.id) : null,
      resourceType: 'Task',
      resourceId: task.id,
      description: { title: task.title, research_id: task.research_id },
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta({}, req),
    });
    return res.status(201).json(task);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTasksByResearch = async (req, res) => {
  const { researchId } = req.query;
  if (!researchId) {
    return res.status(400).json({ error: 'Не указан researchId' });
  }

  try {
    const tasks = await taskService.getTasksByResearch(researchId, req.user);
    return res.json(tasks);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.user);
    return res.status(200).json(tasks);
  } catch (error) {
    return sendError(res, error);
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user);
    return res.status(200).json(task);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    return res.status(200).json(task);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const message = await taskService.deleteTask(req.params.id, req.user);
    return res.status(200).json(message);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByResearch,
};
