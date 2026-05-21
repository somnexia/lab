const inventoryService = require('../services/inventoryService');
const { sendInventoryError } = require('../utils/inventoryControllerErrors');

const createInventoryItem = async (req, res) => {
  try {
    const newInventoryItem = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json(newInventoryItem);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getAllInventoryItems = async (req, res) => {
  try {
    const { item_type, item_types, include_catalog } = req.query;
    const itemTypes = item_types
      ? item_types.split(',').map((value) => value.trim()).filter(Boolean)
      : undefined;

    const inventoryItems = await inventoryService.getInventoryLots({
      itemType: item_type,
      itemTypes,
      includeCatalog: include_catalog !== 'false',
    });
    return res.status(200).json(inventoryItems);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getInventoryItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const inventoryItem = await inventoryService.getInventoryItemById(id);
    return res.status(200).json(inventoryItem);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedInventoryItem = await inventoryService.updateInventoryItem(id, req.body);
    return res.status(200).json(updatedInventoryItem);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await inventoryService.deleteInventoryItem(id);
    return res.status(200).json(result);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getInventoriesByReferenceAndType = async (req, res) => {
  try {
    const { reference_id, item_type } = req.query;

    if (!reference_id || !item_type) {
      return res.status(400).json({
        error: 'Query parameters reference_id and item_type are required',
      });
    }

    const inventories = await inventoryService.getInventoriesByReferenceAndType(
      reference_id,
      item_type
    );

    return res.status(200).json(inventories);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const validateCatalogReference = async (req, res) => {
  try {
    const { reference_id, item_type } = req.query;

    if (!reference_id || !item_type) {
      return res.status(400).json({
        error: 'Query parameters reference_id and item_type are required',
      });
    }

    const result = await inventoryService.checkCatalogReference(item_type, reference_id);
    return res.status(200).json(result);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getOrphanInventoryLots = async (req, res) => {
  try {
    const orphans = await inventoryService.findOrphanInventoryLots();
    return res.status(200).json({
      count: orphans.length,
      orphans,
    });
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getLocationsForEntity = async (req, res) => {
  const { entityType, entityId } = req.params;

  try {
    const entity = await inventoryService.getLocationsForEntity(entityType, entityId);
    return res.status(200).json(entity);
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getChemicalCount = async (req, res) => {
  try {
    const count = await inventoryService.countChemicals();
    return res.json({ count });
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

const getEquipmentCount = async (req, res) => {
  try {
    const count = await inventoryService.countEquipment();
    return res.json({ count });
  } catch (error) {
    return sendInventoryError(error, res);
  }
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoriesByReferenceAndType,
  validateCatalogReference,
  getOrphanInventoryLots,
  getLocationsForEntity,
  getChemicalCount,
  getEquipmentCount,
};
