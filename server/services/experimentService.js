const { sequelize } = require('../models');
const {
  Experiment,
  ExperimentInput,
  ExperimentOutput,
  Research,
  Laboratory,
  Inventory,
} = require('../models');
const CatalogReferenceError = require('../errors/CatalogReferenceError');
const {
  assertCatalogReference,
  isInventoryItemType,
  isReagentItemType,
  resolveCatalogDisplayName,
} = require('./catalogReferenceService');

const EXPERIMENT_STATUSES = Object.freeze(['Completed', 'Ongoing', 'Pending']);

const UPDATABLE_EXPERIMENT_FIELDS = Object.freeze([
  'name',
  'description',
  'status',
  'start_date',
  'end_date',
  'laboratory_id',
]);

class ExperimentValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ExperimentValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

const getLotOnHand = (lot) => {
  if (!lot) return 0;
  const raw = lot.total_quantity ?? lot.substance_amount;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatLotLabel = (lot) => {
  const onHand = getLotOnHand(lot);
  const unit = lot.unit_measure ? ` ${lot.unit_measure}` : '';
  const status = lot.status ? ` · ${lot.status}` : '';
  return `Lot #${lot.id} · ${onHand}${unit}${status}`;
};

const mapInputRow = (row, catalog = null, inventoryLot = null) => ({
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
  inventoryLotLabel: inventoryLot ? formatLotLabel(inventoryLot) : null,
  onHand: inventoryLot ? getLotOnHand(inventoryLot) : null,
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

const assertInventoryLotForInput = async (inventoryId, itemType, referenceId) => {
  if (inventoryId == null || inventoryId === '') return null;

  const lot = await Inventory.findByPk(Number(inventoryId));
  if (!lot) {
    throw new ExperimentValidationError(`Inventory lot ${inventoryId} not found`, { inventoryId });
  }

  if (lot.item_type !== itemType || Number(lot.reference_id) !== Number(referenceId)) {
    throw new ExperimentValidationError(
      `Inventory lot ${inventoryId} does not match catalog item (${itemType} #${referenceId})`,
      { inventoryId, itemType, referenceId }
    );
  }

  return lot;
};

const enrichInputs = async (rows) => {
  return Promise.all(
    rows.map(async (row) => {
      const catalog = await assertCatalogReference(row.item_type, row.reference_id);
      let inventoryLot = null;
      if (row.inventory_id) {
        inventoryLot = await Inventory.findByPk(row.inventory_id);
      }
      return mapInputRow(row, catalog, inventoryLot);
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

  const inventoryId = raw.inventoryId ?? raw.inventory_id ?? null;

  return {
    input_role: inputRole,
    item_type: itemType,
    reference_id: Number(referenceId),
    inventory_id: inventoryId != null && inventoryId !== '' ? Number(inventoryId) : null,
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

  if (!data.name?.trim()) {
    throw new ExperimentValidationError('name is required');
  }

  return Experiment.create({
    ...data,
    name: data.name.trim(),
    status: data.status && EXPERIMENT_STATUSES.includes(data.status) ? data.status : 'Pending',
  });
};

const pickUpdatableFields = (data) => {
  const payload = {};

  for (const field of UPDATABLE_EXPERIMENT_FIELDS) {
    if (data[field] !== undefined) {
      payload[field] = data[field];
    }
  }

  if (payload.name != null && !String(payload.name).trim()) {
    throw new ExperimentValidationError('name cannot be empty');
  }

  if (payload.name) {
    payload.name = String(payload.name).trim();
  }

  if (payload.status != null && !EXPERIMENT_STATUSES.includes(payload.status)) {
    throw new ExperimentValidationError(`status must be one of: ${EXPERIMENT_STATUSES.join(', ')}`);
  }

  return payload;
};

const updateExperiment = async (id, data) => {
  const experiment = await getExperimentOrThrow(id);
  const payload = pickUpdatableFields(data);

  if (!Object.keys(payload).length) {
    throw new ExperimentValidationError('No valid fields to update');
  }

  await experiment.update(payload);
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
    if (row.inventory_id) {
      await assertInventoryLotForInput(row.inventory_id, row.item_type, row.reference_id);
    }
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

const getAggregateOnHand = async (itemType, referenceId) => {
  const lots = await Inventory.findAll({
    where: {
      item_type: itemType,
      reference_id: Number(referenceId),
    },
  });

  return lots.reduce((sum, lot) => sum + getLotOnHand(lot), 0);
};

const checkInputStock = async (input) => {
  const inputRole = input.input_role || input.inputRole;
  if (inputRole !== 'reagent') {
    return {
      inputId: input.id,
      catalogName: input.catalogName,
      status: 'skipped',
      reason: 'Equipment inputs are not stock-checked',
    };
  }

  const quantity = input.quantity != null ? Number(input.quantity) : null;
  if (quantity == null || quantity <= 0) {
    return {
      inputId: input.id,
      catalogName: input.catalogName,
      status: 'warning',
      reason: 'No amount specified — stock check skipped',
    };
  }

  const inventoryId = input.inventoryId ?? input.inventory_id;
  let available = 0;
  let source = 'aggregate';

  if (inventoryId) {
    const lot = await Inventory.findByPk(inventoryId);
    available = getLotOnHand(lot);
    source = input.inventoryLotLabel || `Lot #${inventoryId}`;
  } else {
    available = await getAggregateOnHand(input.itemType || input.item_type, input.referenceId ?? input.reference_id);
    source = 'All lots (aggregate)';
  }

  const sufficient = available >= quantity;

  return {
    inputId: input.id,
    catalogName: input.catalogName,
    requested: quantity,
    unitMeasure: input.unitMeasure || input.unit_measure,
    available,
    source,
    status: sufficient ? 'ok' : 'insufficient',
    reason: sufficient
      ? 'Sufficient stock'
      : `Need ${quantity}, available ${available}`,
  };
};

const checkExperimentStock = async (experimentId) => {
  const experiment = await getExperimentDetail(experimentId);
  const inputs = experiment.inputs || [];
  const reagentInputs = inputs.filter((input) => (input.inputRole || input.input_role) === 'reagent');

  if (!reagentInputs.length) {
    return {
      experimentId: Number(experimentId),
      ready: true,
      summary: 'No reagent inputs to check',
      checks: [],
    };
  }

  const checks = await Promise.all(reagentInputs.map((input) => checkInputStock(input)));
  const blocking = checks.filter((check) => check.status === 'insufficient');
  const warnings = checks.filter((check) => check.status === 'warning');

  return {
    experimentId: Number(experimentId),
    ready: blocking.length === 0,
    summary: blocking.length
      ? `${blocking.length} input(s) insufficient`
      : warnings.length
        ? `${warnings.length} input(s) without amount`
        : 'All reagent inputs have sufficient stock',
    checks,
  };
};

const runExperiment = async (experimentId) => {
  const experiment = await getExperimentOrThrow(experimentId);

  if (experiment.status === 'Completed') {
    throw new ExperimentValidationError('Experiment is already completed');
  }

  const stockCheck = await checkExperimentStock(experimentId);
  if (!stockCheck.ready) {
    const error = new ExperimentValidationError('Insufficient stock for one or more reagent inputs', {
      stockCheck,
    });
    error.statusCode = 409;
    throw error;
  }

  const now = new Date();
  await experiment.update({
    status: 'Ongoing',
    start_date: experiment.start_date || now,
  });

  const detail = await getExperimentDetail(experimentId);
  return { experiment: detail, stockCheck };
};

const completeExperiment = async (experimentId) => {
  const experiment = await getExperimentOrThrow(experimentId);

  if (experiment.status === 'Completed') {
    throw new ExperimentValidationError('Experiment is already completed');
  }

  if (experiment.status === 'Pending') {
    throw new ExperimentValidationError('Run the experiment before marking it completed');
  }

  const now = new Date();
  await experiment.update({
    status: 'Completed',
    end_date: now,
  });

  return getExperimentDetail(experimentId);
};

module.exports = {
  ExperimentValidationError,
  EXPERIMENT_STATUSES,
  getExperiments,
  getExperimentDetail,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  replaceExperimentInputs,
  replaceExperimentOutputs,
  checkExperimentStock,
  runExperiment,
  completeExperiment,
};
