const { Task, TaskFile ,User } = require('../models');

// Создание новой задачи
const createTask = async (data) => {
  try {
    const task = await Task.create(data);
    return task;
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error;
  }
};
const getTasksByResearch = async (researchId) => {
  try {
    const tasks = await Task.findAll({
      where: { research_id: researchId }
    });
    return tasks;
  } catch (error) {
    console.error("Ошибка при получении задач по research_id:", error);
    throw error;
  }
};

// Получение всех задач
const getAllTasks = async () => {
  try {
    return await Task.findAll({
      include: [
        { model: TaskFile, as: 'files' },
        { model: User, as: 'user' }
      ]
    });
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    throw error;
  }
};
// Получение задачи по ID
const getTaskById = async (id) => {
  try {
    const task = await Task.findByPk(id, {
      include: [{ model: TaskFile, as: 'files' }]
    });
    if (!task) {
      throw new Error(`Задача с id ${id} не найдена`);
    }
    return task;
  } catch (error) {
    console.error('Ошибка при получении задачи по id:', error);
    throw error;
  }
};

// Обновление задачи по ID
const updateTask = async (id, data) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error(`Задача с id ${id} не найдена`);
    }
    await task.update(data);
    return task;
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    throw error;
  }
};

// Удаление задачи по ID
const deleteTask = async (id) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error(`Задача с id ${id} не найдена`);
    }
    await task.destroy();
    return { message: `Задача с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    throw error;
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
