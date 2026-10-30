const { Task, TaskFile, User } = require('../models');
const {
  scopeTasksWhere,
  assertCanViewTask,
  assertCanEditTask,
  assertCanDeleteTask,
  prepareTaskCreatePayload,
  prepareTaskUpdatePayload,
  loadTaskOrThrow,
} = require('../utils/researchScope');

const createTask = async (data, user) => {
  try {
    const prepared = await prepareTaskCreatePayload(user, data);
    const taskData = {
      ...prepared,
      start_date: prepared.start_date || null,
      due_date: prepared.due_date || null,
    };
    return await Task.create(taskData);
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error;
  }
};

const getTasksByResearch = async (researchId, user) => {
  try {
    const where = await scopeTasksWhere(user, {
      research_id: Number(researchId),
    });
    return await Task.findAll({ where });
  } catch (error) {
    console.error('Ошибка при получении задач по research_id:', error);
    throw error;
  }
};

const getAllTasks = async (user) => {
  try {
    const where = await scopeTasksWhere(user, {});
    return await Task.findAll({
      where,
      include: [
        { model: TaskFile, as: 'files' },
        { model: User, as: 'user' },
      ],
    });
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    throw error;
  }
};

const getTaskById = async (id, user) => {
  try {
    const task = await Task.findByPk(id, {
      include: [{ model: TaskFile, as: 'files' }],
    });
    if (!task) {
      throw Object.assign(new Error(`Задача с id ${id} не найдена`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    await assertCanViewTask(user, task);
    return task;
  } catch (error) {
    console.error('Ошибка при получении задачи по id:', error);
    throw error;
  }
};

const updateTask = async (id, data, user) => {
  try {
    const task = await loadTaskOrThrow(id);
    await assertCanEditTask(user, task);
    const payload = await prepareTaskUpdatePayload(user, task, data);
    await task.update(payload);
    return task;
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    throw error;
  }
};

const deleteTask = async (id, user) => {
  try {
    const task = await loadTaskOrThrow(id);
    await assertCanDeleteTask(user, task);
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
