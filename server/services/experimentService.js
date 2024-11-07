const { Experiment, Research, Laboratory } = require('../models');

// Создание нового эксперимента
const createExperiment = async (data) => {
  try {
    const experiment = await Experiment.create(data);
    return experiment;
  } catch (error) {
    console.error('Ошибка при создании эксперимента:', error);
    throw error;
  }
};

// Получение всех экспериментов
const getAllExperiments = async () => {
  try {
    return await Experiment.findAll({
      include: [
        { model: Research, as: 'research' },
        { model: Laboratory, as: 'laboratory' }
      ]
    });
  } catch (error) {
    console.error('Ошибка при получении списка экспериментов:', error);
    throw error;
  }
};

// Получение эксперимента по ID
const getExperimentById = async (id) => {
  try {
    const experiment = await Experiment.findByPk(id, {
      include: [
        { model: Research, as: 'research' },
        { model: Laboratory, as: 'laboratory' }
      ]
    });
    if (!experiment) {
      throw new Error(`Эксперимент с id ${id} не найден`);
    }
    return experiment;
  } catch (error) {
    console.error('Ошибка при получении эксперимента по id:', error);
    throw error;
  }
};

// Обновление эксперимента по ID
const updateExperiment = async (id, data) => {
  try {
    const experiment = await Experiment.findByPk(id);
    if (!experiment) {
      throw new Error(`Эксперимент с id ${id} не найден`);
    }
    await experiment.update(data);
    return experiment;
  } catch (error) {
    console.error('Ошибка при обновлении эксперимента:', error);
    throw error;
  }
};

// Удаление эксперимента по ID
const deleteExperiment = async (id) => {
  try {
    const experiment = await Experiment.findByPk(id);
    if (!experiment) {
      throw new Error(`Эксперимент с id ${id} не найден`);
    }
    await experiment.destroy();
    return { message: `Эксперимент с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении эксперимента:', error);
    throw error;
  }
};

module.exports = {
  createExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment
};
