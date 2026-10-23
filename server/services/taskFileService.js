const { TaskFile, User, Task } = require('../models');
const {
  assertCanViewTask,
  assertCanEditTask,
  loadTaskOrThrow,
  scopeTasksWhere,
  assertCanViewResearch,
  loadResearchOrThrow,
} = require('../utils/researchScope');

const uploadTaskFile = async (taskId, filePath, fileType, fileSize, userId, user) => {
  try {
    const task = await loadTaskOrThrow(taskId);
    await assertCanEditTask(user, task);

    return await TaskFile.create({
      task_id: taskId,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      uploaded_by: userId != null ? Number(userId) : Number(user.id),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw error;
  }
};

const getTaskFiles = async (taskId, user) => {
  try {
    const task = await loadTaskOrThrow(taskId);
    await assertCanViewTask(user, task);

    return await TaskFile.findAll({
      where: { task_id: taskId },
      include: [{ model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }],
      order: [['updatedAt', 'DESC']],
    });
  } catch (error) {
    console.error('Ошибка при получении файлов задачи:', error);
    throw error;
  }
};

const getTaskFilesByResearch = async (researchId, user) => {
  try {
    const research = await loadResearchOrThrow(researchId);
    await assertCanViewResearch(user, research);

    const where = await scopeTasksWhere(user, {
      research_id: Number(researchId),
    });

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: TaskFile,
          as: 'files',
          include: [
            {
              model: User,
              as: 'uploader',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!tasks.length) return [];
    return tasks.flatMap((task) => task.files || []);
  } catch (error) {
    console.error('Ошибка при получении файлов исследования:', error);
    throw error;
  }
};

const getTaskFileById = async (fileId, user) => {
  try {
    const file = await TaskFile.findByPk(fileId, {
      include: [{ model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }],
    });
    if (!file) {
      throw Object.assign(new Error(`Файл с id ${fileId} не найден`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    const task = await loadTaskOrThrow(file.task_id);
    await assertCanViewTask(user, task);
    return file;
  } catch (error) {
    console.error('Ошибка при получении файла по ID:', error);
    throw error;
  }
};

const deleteTaskFile = async (fileId, user) => {
  try {
    const file = await TaskFile.findByPk(fileId);
    if (!file) {
      throw Object.assign(new Error(`Файл с id ${fileId} не найден`), {
        code: 'NOT_FOUND',
        status: 404,
      });
    }
    const task = await loadTaskOrThrow(file.task_id);
    await assertCanEditTask(user, task);
    await file.destroy();
    return { message: `Файл с id ${fileId} удален` };
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    throw error;
  }
};

module.exports = {
  uploadTaskFile,
  getTaskFiles,
  getTaskFileById,
  deleteTaskFile,
  getTaskFilesByResearch,
};
