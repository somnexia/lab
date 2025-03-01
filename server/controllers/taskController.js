const taskService = require('../services/taskService');

// Создание новой задачи
const createTask = async (req, res) => {
  if (Object.values(req.body).some(value => value === null || value === undefined || value === '')) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  try {
    const task = await taskService.createTask(req.body);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех задач
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
    const message = await taskService.deleteTask(id ,req.body);
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
  deleteTask
};
