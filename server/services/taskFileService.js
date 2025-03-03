const { TaskFile, User, Task } = require('../models');

// Загрузка файла для задачи
const uploadTaskFile = async (taskId, filePath, fileType, fileSize, userId) => {
  try {
    const taskFile = await TaskFile.create({
      task_id: taskId,
      file_path: filePath,
      file_type: fileType,
      file_size: fileSize,
      uploaded_by: userId,
      updatedAt: new Date()
    });
    return taskFile;
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    throw error;
  }
};

// Получение всех файлов, привязанных к задаче
const getTaskFiles = async (taskId) => {
  try {
    return await TaskFile.findAll({
      where: { task_id: taskId },
      include: [{ model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }],
      order: [['updatedAt', 'DESC']]
    });
  } catch (error) {
    console.error('Ошибка при получении файлов задачи:', error);
    throw error;
  }
};
const getTaskFilesByResearch = async (researchId) => {
  try {
    // Получаем все задачи, связанные с данным исследованием
    const tasks = await Task.findAll({
      where: { research_id: researchId },
      include: [
        {
          model: TaskFile, 
          as: 'files',
          include: [
            {
              model: User,
              as: 'uploader', // Должно совпадать с ассоциацией в модели
              attributes: ['id', 'name'], // Получаем только нужные поля
            },
          ],

        }]
    });

    if (!tasks.length) {
      return [];
    }

    // Собираем все файлы из найденных задач
    const files = tasks.flatMap(task => task.files);
    // console.log("files",files);
    return files;
  
  } catch (error) {
    console.error('Ошибка при получении файлов исследования:', error);
    throw error;
  }
};

// Получение информации о файле по его ID
const getTaskFileById = async (fileId) => {
  try {
    const file = await TaskFile.findByPk(fileId, {
      include: [{ model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }]
    });
    if (!file) {
      throw new Error(`Файл с id ${fileId} не найден`);
    }
    return file;
  } catch (error) {
    console.error('Ошибка при получении файла по ID:', error);
    throw error;
  }
};

// Удаление файла
const deleteTaskFile = async (fileId) => {
  try {
    const file = await TaskFile.findByPk(fileId);
    if (!file) {
      throw new Error(`Файл с id ${fileId} не найден`);
    }
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
  getTaskFilesByResearch
};
