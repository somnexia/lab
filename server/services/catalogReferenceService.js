const CatalogReferenceError = require('../errors/CatalogReferenceError');
const {
  ChemElement,
  ChemEquipment,
  ChemCompound,
  ChemMixture,
} = require('../models');

const INVENTORY_ITEM_TYPES = Object.freeze([
  'element',
  'compound',
  'mixture',
  'equipment',
]);

const REAGENT_ITEM_TYPES = Object.freeze(['element', 'compound', 'mixture']);

const CATALOG_MODELS = Object.freeze({
  element: ChemElement,
  compound: ChemCompound,
  mixture: ChemMixture,
  equipment: ChemEquipment,
});

const isInventoryItemType = (itemType) => INVENTORY_ITEM_TYPES.includes(itemType);

const isReagentItemType = (itemType) => REAGENT_ITEM_TYPES.includes(itemType);

const normalizeReferenceId = (referenceId) => {
  const parsed = Number(referenceId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new CatalogReferenceError('reference_id must be a positive integer', {
      reference_id: referenceId,
    });
  }
  return parsed;
};

const getCatalogModel = (itemType) => {
  if (!isInventoryItemType(itemType)) {
    throw new CatalogReferenceError(`Unsupported item_type: ${itemType}`, {
      item_type: itemType,
      allowed: INVENTORY_ITEM_TYPES,
    });
  }
  return CATALOG_MODELS[itemType];
};

const findCatalogEntry = async (itemType, referenceId) => {
  const Model = getCatalogModel(itemType);
  const id = normalizeReferenceId(referenceId);
  return Model.findByPk(id);
};

/**
 * Ensures (item_type, reference_id) points to an existing catalog row.
 * @returns {Promise<import('sequelize').Model>} catalog row
 */
const assertCatalogReference = async (itemType, referenceId) => {
  if (itemType == null || itemType === '') {
    throw new CatalogReferenceError('item_type is required', { field: 'item_type' });
  }

  if (referenceId == null || referenceId === '') {
    throw new CatalogReferenceError('reference_id is required', { field: 'reference_id' });
  }

  const catalog = await findCatalogEntry(itemType, referenceId);

  if (!catalog) {
    throw new CatalogReferenceError(
      `No catalog record found for item_type="${itemType}" and reference_id=${referenceId}`,
      { item_type: itemType, reference_id: normalizeReferenceId(referenceId) }
    );
  }

  return catalog;
};

const resolveCatalogDisplayName = (itemType, catalog) => {
  if (!catalog) return null;
  if (itemType === 'element' && catalog.symbol && catalog.name) {
    return `${catalog.name} (${catalog.symbol})`;
  }
  return catalog.name || catalog.symbol || null;
};

/**
 * Validates pair for inventory create/update; returns merged fields with optional item_name.
 */
const validateInventoryCatalogPair = async ({ item_type, reference_id, item_name }) => {
  const catalog = await assertCatalogReference(item_type, reference_id);
  const resolvedName = item_name?.trim() || resolveCatalogDisplayName(item_type, catalog);

  return {
    item_type,
    reference_id: normalizeReferenceId(reference_id),
    item_name: resolvedName,
    catalog,
  };
};

/**
 * Merge existing inventory row with patch and validate resulting pair.
 */
const validateInventoryCatalogPatch = async (existingRow, patch = {}) => {
  const item_type = patch.item_type ?? existingRow.item_type;
  const reference_id = patch.reference_id ?? existingRow.reference_id;

  const validated = await validateInventoryCatalogPair({
    item_type,
    reference_id,
    item_name: patch.item_name ?? existingRow.item_name,
  });

  return {
    ...patch,
    item_type: validated.item_type,
    reference_id: validated.reference_id,
    item_name: validated.item_name,
  };
};

module.exports = {
  INVENTORY_ITEM_TYPES,
  REAGENT_ITEM_TYPES,
  CATALOG_MODELS,
  isInventoryItemType,
  isReagentItemType,
  getCatalogModel,
  findCatalogEntry,
  assertCatalogReference,
  resolveCatalogDisplayName,
  validateInventoryCatalogPair,
  validateInventoryCatalogPatch,
};
