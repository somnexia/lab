const experimentService = require('../services/experimentService');
const CatalogReferenceError = require('../errors/CatalogReferenceError');

const sendExperimentError = (error, res) => {
  if (error instanceof experimentService.ExperimentValidationError) {
    return res.status(error.statusCode || 400).json({
      error: error.message,
      details: error.details,
    });
  }

  if (error instanceof CatalogReferenceError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  }

  if (error.message?.includes('не найден') || error.message?.includes('not found')) {
    return res.status(404).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: error.message || 'Internal server error' });
};

const createExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.createExperiment(req.body);
    return res.status(201).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const getAllExperiments = async (req, res) => {
  try {
    const { research_id: researchId } = req.query;
    const experiments = await experimentService.getExperiments({ researchId });
    return res.status(200).json(experiments);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const getExperimentById = async (req, res) => {
  try {
    const experiment = await experimentService.getExperimentDetail(req.params.id);
    return res.status(200).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const updateExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.updateExperiment(req.params.id, req.body);
    return res.status(200).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const deleteExperiment = async (req, res) => {
  try {
    const result = await experimentService.deleteExperiment(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const replaceExperimentInputs = async (req, res) => {
  try {
    const experiment = await experimentService.replaceExperimentInputs(
      req.params.id,
      req.body.inputs
    );
    return res.status(200).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const replaceExperimentOutputs = async (req, res) => {
  try {
    const experiment = await experimentService.replaceExperimentOutputs(
      req.params.id,
      req.body.outputs
    );
    return res.status(200).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const checkExperimentStock = async (req, res) => {
  try {
    const stockCheck = await experimentService.checkExperimentStock(req.params.id);
    return res.status(200).json(stockCheck);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const runExperiment = async (req, res) => {
  try {
    const result = await experimentService.runExperiment(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

const completeExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.completeExperiment(req.params.id);
    return res.status(200).json(experiment);
  } catch (error) {
    return sendExperimentError(error, res);
  }
};

module.exports = {
  createExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
  replaceExperimentInputs,
  replaceExperimentOutputs,
  checkExperimentStock,
  runExperiment,
  completeExperiment,
};
