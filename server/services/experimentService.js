const { sequelize } = require('../models');
const {
  Experiment,
  ExperimentInput,
  ExperimentOutput,
  Research,
  Laboratory,
} = require('../models');
const CatalogReferenceError = require('../errors/CatalogReferenceError');
const {
  assertCatalogReference,
  isInventoryItemType,
  isReagentItemType,
  resolveCatalogDisplayName,
} = require('./catalogReferenceService');

class ExperimentValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ExperimentValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

const mapInputRow = (row, catalog = null) => ({
  id: row.id,
  experimentId: row.experiment_id,
  inputRole: row.input_role,
  itemType: row.item_type,
  referenceId: row.reference_id,
  inventoryId: row.inventory_id,
  quantity: row.quantity != null ? Number(row.quantity) : null,
  unitMeasure: row.unit_measure,
  notes: row.notes,
  sortOrder: row.sort_order,
  catalogName: catalog ? resolveCatalogDisplayName(row.item_type, catalog) : null,
});

const mapOutputRow = (row, catalog = null) => ({
  id: row.id,
  experimentId: row.experiment_id,
  itemType: row.item_type,
  referenceId: row.reference_id,
  resultItemName: row.result_item_name,
  quantity: row.quantity != null ? Number(row.quantity) : null,
  unitMeasure: row.unit_measure,
  notes: row.notes,
  sortOrder: row.sort_order,
  catalogName: catalog ? resolveCatalogDisplayName(row.item_type, catalog) : null,
});

const enrichInputs = async (rows) => {
  return Promise.all(
    rows.map(async (row) => {
      const catalog = await assertCatalogReference(row.item_type, row.reference_id);
      return mapInputRow(row, catalog);
    })
  );
};

const enrichOutputs = async (rows) => {
  return Promise.all(
    rows.map(async (row) => {
      let catalog = null;
      if (row.reference_id) {
        catalog = await assertCatalogReference(row.item_type, row.reference_id);
      }
      return mapOutputRow(row, catalog);
    })
  );
};

const getExperimentOrThrow = async (id) => {
  const experiment = await Experiment.findByPk(id);
  if (!experiment) {
    const error = new ExperimentValidationError(`Experiment with id ${id} not found`, { id });
    error.statusCode = 404;
    throw error;
  }
  return experiment;
};

const normalizeInputPayload = (raw, index) => {
  const inputRole = raw.inputRole || raw.input_role || 'reagent';
  const itemType = raw.itemType || raw.item_type;
  const referenceId = raw.referenceId ?? raw.reference_id;

  if (!['reagent', 'equipment'].includes(inputRole)) {
    throw new ExperimentValidationError(`Input at index ${index}: invalid input_role`, { index });
  }

  if (!isInventoryItemType(itemType)) {
    throw new ExperimentValidationError(`Input at index ${index}: invalid item_type`, { index });
  }

  if (inputRole === 'reagent' && !isReagentItemType(itemType)) {
    throw new ExperimentValidationError(
      `Input at index ${index}: reagent inputs must be element, compound, or mixture`,
      { index }
    );
  }

  if (inputRole === 'equipment' && itemType !== 'equipment') {
    throw new ExperimentValidationError(
      `Input at index ${index}: equipment inputs must use item_type equipment`,
      { index }
    );
  }

  return {
    input_role: inputRole,
    item_type: itemType,
    reference_id: Number(referenceId),
    inventory_id: raw.inventoryId ?? raw.inventory_id ?? null,
    quantity: raw.quantity ?? null,
    unit_measure: raw.unitMeasure || raw.unit_measure || null,
    notes: raw.notes || null,
    sort_order: raw.sortOrder ?? raw.sort_order ?? index,
  };
};

const getExperiments = async ({ researchId } = {}) => {
  const where = {};
  if (researchId != null && researchId !== '') {
    where.research_id = Number(researchId);
  }

  return Experiment.findAll({
    where,
    include: [
      { model: Research, as: 'research', attributes: ['id', 'title', 'status'] },
      { model: Laboratory, as: 'laboratory', attributes: ['id', 'lab_name'], required: false },
    ],
    order: [['start_date', 'DESC'], ['id', 'DESC']],
  });
};

const getExperimentDetail = async (id) => {
  const experiment = await Experiment.findByPk(id, {
    include: [
      { model: Research, as: 'research' },
      { model: Laboratory, as: 'laboratory', required: false },
      {
        model: ExperimentInput,
        as: 'inputs',
        separate: true,
        order: [['sort_order', 'ASC'], ['id', 'ASC']],
      },
      {
        model: ExperimentOutput,
        as: 'outputs',
        separate: true,
        order: [['sort_order', 'ASC'], ['id', 'ASC']],
      },
    ],
  });

  if (!experiment) {
    const error = new ExperimentValidationError(`Experiment with id ${id} not found`, { id });
    error.statusCode = 404;
    throw error;
  }

  const plain = experiment.toJSON();
  plain.inputs = await enrichInputs(experiment.inputs || []);
  plain.outputs = await enrichOutputs(experiment.outputs || []);
  return plain;
};

const createExperiment = async (data) => {
  if (!data.research_id) {
    throw new ExperimentValidationError('research_id is required');
  }

  const research = await Research.findByPk(data.research_id);
  if (!research) {
    throw new ExperimentValidationError(`Research with id ${data.research_id} not found`);
  }

  return Experiment.create(data);
};

const updateExperiment = async (id, data) => {
  const experiment = await getExperimentOrThrow(id);
  await experiment.update(data);
  return getExperimentDetail(id);
};

const deleteExperiment = async (id) => {
  const experiment = await getExperimentOrThrow(id);
  await experiment.destroy();
  return { message: `Experiment with id ${id} deleted` };
};

const replaceExperimentInputs = async (experimentId, incoming = []) => {
  await getExperimentOrThrow(experimentId);

  if (!Array.isArray(incoming)) {
    throw new ExperimentValidationError('inputs must be an array');
  }

  const normalized = incoming.map((row, index) => normalizeInputPayload(row, index));

  for (const row of normalized) {
    await assertCatalogReference(row.item_type, row.reference_id);
  }

  const transaction = await sequelize.transaction();

  try {
    await ExperimentInput.destroy({ where: { experiment_id: experimentId }, transaction });

    if (normalized.length) {
      await ExperimentInput.bulkCreate(
        normalized.map((row) => ({ ...row, experiment_id: experimentId })),
        { transaction }
      );
    }

    await transaction.commit();
    return getExperimentDetail(experimentId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const replaceExperimentOutputs = async (experimentId, incoming = []) => {
  await getExperimentOrThrow(experimentId);

  if (!Array.isArray(incoming)) {
    throw new ExperimentValidationError('outputs must be an array');
  }

  const normalized = incoming.map((row, index) => {
    const itemType = row.itemType || row.item_type;
    const referenceId = row.referenceId ?? row.reference_id ?? null;
    const resultItemName = row.resultItemName || row.result_item_name;

    if (!isInventoryItemType(itemType)) {
      throw new ExperimentValidationError(`Output at index ${index}: invalid item_type`, { index });
    }

    if (!resultItemName?.trim()) {
      throw new ExperimentValidationError(`Output at index ${index}: result_item_name is required`, { index });
    }

    return {
      item_type: itemType,
      reference_id: referenceId != null ? Number(referenceId) : null,
      result_item_name: resultItemName.trim(),
      quantity: row.quantity ?? null,
      unit_measure: row.unitMeasure || row.unit_measure || null,
      notes: row.notes || null,
      sort_order: row.sortOrder ?? row.sort_order ?? index,
    };
  });

  for (const row of normalized) {
    if (row.reference_id) {
      await assertCatalogReference(row.item_type, row.reference_id);
    }
  }

  const transaction = await sequelize.transaction();

  try {
    await ExperimentOutput.destroy({ where: { experiment_id: experimentId }, transaction });

    if (normalized.length) {
      await ExperimentOutput.bulkCreate(
        normalized.map((row) => ({ ...row, experiment_id: experimentId })),
        { transaction }
      );
    }

    await transaction.commit();
    return getExperimentDetail(experimentId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  ExperimentValidationError,
  getExperiments,
  getExperimentDetail,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  replaceExperimentInputs,
  replaceExperimentOutputs,
};
