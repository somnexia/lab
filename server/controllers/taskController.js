const taskService = require('../services/taskService');
const logService = require('../services/logService');

// Создание новой задачи
const createTask = async (req, res) => {
  const { research_id, title, start_date } = req.body;

  if (!research_id || !title || !start_date) {
    return res.status(400).json({
      error: "research_id, title и start_date обязательны"
    });
  }

  try {
    const task = await taskService.createTask(req.body);
    await logService.safeRecordAuditLog({
      action: logService.LOG_ACTIONS.TASK_CREATED,
      userId: req.body.user_id != null ? Number(req.body.user_id) : null,
      resourceType: 'Task',
      resourceId: task.id,
      description: { title: task.title, research_id: task.research_id },
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta({}, req),
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
};

// Получение всех задач


const getTasksByResearch = async (req, res) => {
  const { researchId } = req.query; // Получаем researchId из запроса
  if (!researchId) {
    return res.status(400).json({ error: "Не указан researchId" });
  }

  try {
    const tasks = await taskService.getTasksByResearch(researchId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении задач исследования" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение задачи по ID
const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskService.getTaskById(id);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Обновление задачи по ID
const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await taskService.updateTask(id, req.body);
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Удаление задачи по ID
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await taskService.deleteTask(id, req.body);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByResearch
};
