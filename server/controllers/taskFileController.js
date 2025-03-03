const taskFileService = require('../services/taskFileService');

// Загрузка файла для задачи
const uploadTaskFile = async (req, res) => {
  const { task_id, file_path, file_type, file_size, uploaded_by } = req.body;

  if (!task_id || !file_path || !file_type || !file_size || !uploaded_by) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  try {
    const taskFile = await taskFileService.uploadTaskFile(task_id, file_path, file_type, file_size, uploaded_by);
    return res.status(201).json(taskFile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех файлов, привязанных к задаче
const getTaskFiles = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ error: "Не указан taskId" });
  }

  try {
    const files = await taskFileService.getTaskFiles(taskId);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getTaskFilesByResearch = async (req, res) => {
  const { researchId } = req.params;

  if (!researchId) {
    return res.status(400).json({ error: "Не указан researchId" });
  }

  try {
    const files = await taskFileService.getTaskFilesByResearch(researchId);
    if (!files.length) {
      return res.status(404).json({ message: "Файлы не найдены" });
    }
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Получение информации о файле по ID
const getTaskFileById = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await taskFileService.getTaskFileById(id);
    return res.status(200).json(file);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Удаление файла
const deleteTaskFile = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await taskFileService.deleteTaskFile(id);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

module.exports = {
  uploadTaskFile,
  getTaskFiles,
  getTaskFileById,
  deleteTaskFile,
  getTaskFilesByResearch
};
