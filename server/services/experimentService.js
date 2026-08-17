const { sequelize } = require('../models');
const {
  Experiment,
  ExperimentInput,
  ExperimentOutput,
  ExperimentConsumption,
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
const { planReagentConsumption } = require('./experimentConsumptionPlanner');

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

const mapConsumptionRow = (row, catalog = null, inventoryLot = null) => ({
  id: row.id,
  experimentId: row.experiment_id,
  experimentInputId: row.experiment_input_id,
  inventoryId: row.inventory_id,
  itemType: row.item_type,
  referenceId: row.reference_id,
  quantityConsumed: row.quantity_consumed != null ? Number(row.quantity_consumed) : null,
  unitMeasure: row.unit_measure,
  consumedAt: row.consumed_at,
  consumptionPhase: row.consumption_phase,
  notes: row.notes,
  catalogName: catalog ? resolveCatalogDisplayName(row.item_type, catalog) : null,
  inventoryLotLabel: inventoryLot ? formatLotLabel(inventoryLot) : `Lot #${row.inventory_id}`,
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

const enrichConsumptions = async (rows) => {
  return Promise.all(
    rows.map(async (row) => {
      const catalog = await assertCatalogReference(row.item_type, row.reference_id);
      const inventoryLot = await Inventory.findByPk(row.inventory_id);
      return mapConsumptionRow(row, catalog, inventoryLot);
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
      {
        model: ExperimentConsumption,
        as: 'consumptions',
        separate: true,
        order: [['consumed_at', 'ASC'], ['id', 'ASC']],
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
  plain.consumptions = await enrichConsumptions(experiment.consumptions || []);
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
  const experiment = await getExperimentOrThrow(experimentId);

  if (experiment.status === 'Completed') {
    throw new ExperimentValidationError(
      'Cannot change inputs on a completed experiment. Reopen or duplicate the run first.'
    );
  }

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
    const runInvalidated = await revertExperimentConsumptions(experimentId, transaction);

    if (runInvalidated && experiment.status === 'Ongoing') {
      await experiment.update({ status: 'Pending' }, { transaction });
    }

    await ExperimentInput.destroy({ where: { experiment_id: experimentId }, transaction });

    if (normalized.length) {
      await ExperimentInput.bulkCreate(
        normalized.map((row) => ({ ...row, experiment_id: experimentId })),
        { transaction }
      );
    }

    await transaction.commit();

    const detail = await getExperimentDetail(experimentId);
    detail.runInvalidated = runInvalidated;
    return detail;
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

const deductFromLot = async (lot, amount, transaction) => {
  const onHand = getLotOnHand(lot);
  if (onHand < amount) {
    throw new ExperimentValidationError(
      `Lot #${lot.id} has ${onHand} on hand, need ${amount}`,
      { inventoryId: lot.id, onHand, requested: amount }
    );
  }

  const remaining = onHand - amount;
  const updates = { last_updated: new Date() };

  if (lot.total_quantity != null && lot.total_quantity !== '') {
    updates.total_quantity = Number.isInteger(lot.total_quantity)
      ? Math.max(0, Math.floor(remaining))
      : remaining;
  }

  if (lot.substance_amount != null && lot.substance_amount !== '') {
    updates.substance_amount = remaining;
  } else if (lot.total_quantity == null || lot.total_quantity === '') {
    updates.substance_amount = remaining;
  }

  updates.status = remaining <= 0 ? 'out of stock' : 'available';

  await lot.update(updates, { transaction });
  return remaining;
};

const restoreToLot = async (lot, amount, transaction) => {
  const onHand = getLotOnHand(lot);
  const restored = onHand + Number(amount);
  const updates = { last_updated: new Date() };

  if (lot.total_quantity != null && lot.total_quantity !== '') {
    updates.total_quantity = Number.isInteger(lot.total_quantity)
      ? Math.floor(restored)
      : restored;
  }

  if (lot.substance_amount != null && lot.substance_amount !== '') {
    updates.substance_amount = restored;
  } else if (lot.total_quantity == null || lot.total_quantity === '') {
    updates.substance_amount = restored;
  }

  updates.status = restored > 0 ? 'available' : 'out of stock';

  await lot.update(updates, { transaction });
  return restored;
};

const revertExperimentConsumptions = async (experimentId, transaction) => {
  const consumptions = await ExperimentConsumption.findAll({
    where: { experiment_id: experimentId },
    transaction,
  });

  if (!consumptions.length) {
    return false;
  }

  for (const row of consumptions) {
    const lot = await Inventory.findByPk(row.inventory_id, { transaction });
    if (lot) {
      await restoreToLot(lot, row.quantity_consumed, transaction);
    }
  }

  await ExperimentConsumption.destroy({
    where: { experiment_id: experimentId },
    transaction,
  });

  return true;
};

const applyExperimentConsumptions = async (experimentId, phase, transaction) => {
  const existingCount = await ExperimentConsumption.count({
    where: { experiment_id: experimentId },
    transaction,
  });

  if (existingCount > 0) {
    return [];
  }

  const rawInputs = await ExperimentInput.findAll({
    where: { experiment_id: experimentId },
    order: [['sort_order', 'ASC'], ['id', 'ASC']],
    transaction,
  });

  const reagentInputs = await enrichInputs(rawInputs.filter((row) => row.input_role === 'reagent'));
  const plan = await planReagentConsumption(reagentInputs, { transaction });

  if (plan.blocking.length) {
    const firstBlock = plan.blocking[0];
    throw new ExperimentValidationError(
      firstBlock.reason || `Insufficient stock for ${firstBlock.catalogName}`,
      { stockCheck: { checks: plan.checks, ready: false } }
    );
  }

  if (plan.warnings.length) {
    throw new ExperimentValidationError(
      `${plan.warnings.length} reagent input(s) missing amount — required before consumption`
    );
  }

  if (!plan.allocations.length) {
    return [];
  }

  const createdRows = [];

  for (const allocation of plan.allocations) {
    await deductFromLot(allocation.lot, allocation.quantityConsumed, transaction);

    createdRows.push({
      experiment_id: experimentId,
      experiment_input_id: allocation.input.id,
      inventory_id: allocation.lot.id,
      item_type: allocation.input.itemType || allocation.input.item_type,
      reference_id: allocation.input.referenceId ?? allocation.input.reference_id,
      quantity_consumed: allocation.quantityConsumed,
      unit_measure: allocation.unitMeasure,
      consumed_at: new Date(),
      consumption_phase: phase,
      notes: allocation.input.notes,
    });
  }

  return ExperimentConsumption.bulkCreate(createdRows, { transaction });
};

const checkExperimentStock = async (experimentId, { forRun = false } = {}) => {
  const experiment = await getExperimentDetail(experimentId);
  const reagentInputs = (experiment.inputs || [])
    .filter((input) => (input.inputRole || input.input_role) === 'reagent');

  if (!reagentInputs.length) {
    return {
      experimentId: Number(experimentId),
      ready: true,
      summary: 'No reagent inputs to check',
      checks: [],
    };
  }

  const plan = await planReagentConsumption(reagentInputs);
  const { checks, blocking, warnings } = plan;
  const ready = blocking.length === 0 && (!forRun || warnings.length === 0);

  return {
    experimentId: Number(experimentId),
    ready,
    summary: blocking.length
      ? `${blocking.length} input(s) insufficient`
      : forRun && warnings.length
        ? `${warnings.length} reagent input(s) missing amount — required before run`
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

  if (experiment.status === 'Ongoing') {
    throw new ExperimentValidationError('Experiment is already running');
  }

  const stockCheck = await checkExperimentStock(experimentId, { forRun: true });
  if (!stockCheck.ready) {
    const detail = stockCheck.checks?.find((check) => check.status === 'insufficient');
    const error = new ExperimentValidationError(
      detail?.reason || 'Cannot run experiment — stock or input amounts are insufficient',
      { stockCheck }
    );
    error.statusCode = 409;
    throw error;
  }

  const transaction = await sequelize.transaction();

  try {
    await applyExperimentConsumptions(experimentId, 'run', transaction);

    const now = new Date();
    await experiment.update({
      status: 'Ongoing',
      start_date: experiment.start_date || now,
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const detail = await getExperimentDetail(experimentId);
  return { experiment: detail, stockCheck };
};

const completeExperiment = async (experimentId) => {
  const experiment = await getExperimentOrThrow(experimentId);

  if (experiment.status === 'Completed') {
    throw new ExperimentValidationError('Experiment is already completed');
  }

  const transaction = await sequelize.transaction();

  try {
    const existingCount = await ExperimentConsumption.count({
      where: { experiment_id: experimentId },
      transaction,
    });

    if (existingCount === 0) {
      if (experiment.status === 'Pending') {
        const stockCheck = await checkExperimentStock(experimentId, { forRun: true });
        if (!stockCheck.ready) {
          const error = new ExperimentValidationError('Cannot complete — stock or input amounts are insufficient', {
            stockCheck,
          });
          error.statusCode = 409;
          throw error;
        }
      }

      await applyExperimentConsumptions(experimentId, 'complete', transaction);

      if (experiment.status === 'Pending') {
        await experiment.update({
          status: 'Ongoing',
          start_date: experiment.start_date || new Date(),
        }, { transaction });
      }
    }

    const now = new Date();
    await experiment.update({
      status: 'Completed',
      end_date: now,
    }, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

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

