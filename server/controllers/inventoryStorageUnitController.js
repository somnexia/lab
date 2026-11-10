const inventoryStorageUnitService = require('../services/inventoryStorageUnitService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message, code: 'NOT_FOUND' });
  }
  console.error(error);
  return res.status(error.status || fallbackStatus).json({ error: error.message });
}

const getInventoriesByStorageUnitId = async (req, res) => {
  try {
    const { id: storageunit_id } = req.params;
    if (!storageunit_id) {
      return res.status(400).json({ error: 'storageunit_id is required' });
    }

    const inventories = await inventoryStorageUnitService.getInventoriesByStorageUnitId(
      storageunit_id,
      req.user
    );
    return res.json(inventories);
  } catch (error) {
    return sendError(res, error);
  }
};

const getInventoriesWithLocation = async (req, res) => {
  try {
    const { id: storageUnitId } = req.params;
    if (!storageUnitId) {
      return res.status(400).json({ error: 'storageUnitId is required' });
    }

    const inventories = await inventoryStorageUnitService.getInventoriesWithLocation(
      storageUnitId,
      req.user
    );
    return res.status(200).json(inventories);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getInventoriesByStorageUnitId,
  getInventoriesWithLocation,
};
