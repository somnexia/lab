const inventoryStorageUnitService = require('../services/inventoryStorageUnitService');

const getInventoriesByStorageUnitId = async (req, res) => {
  try {
    const { id: storageunit_id } = req.params; // Используем req.params для получения ID
    if (!storageunit_id) {
      return res.status(400).json({ error: 'storageunit_id is required' });
    }

    const inventories = await inventoryStorageUnitService.getInventoriesByStorageUnitId(storageunit_id);
    res.json(inventories);
  } catch (error) {
    console.error('Ошибка в контроллере:', error);
    res.status(500).json({ error: 'Ошибка при получении данных инвентаря' });
  }
};
const getInventoriesWithLocation = async (req, res) => {
  try {
    const { id: storageUnitId } = req.params;
    if (!storageUnitId) {
      return res.status(400).json({ error: 'storageUnitId is required' });
    }

    // Вызов сервиса для получения инвентаря с местоположением
    const inventories = await inventoryStorageUnitService.getInventoriesWithLocation(storageUnitId);

    // Отправка результата клиенту
    res.status(200).json(inventories);
    
  } catch (error) {
    console.error('Ошибка в контроллере getInventoriesWithLocation:', error);
    res.status(500).json({ error: 'Ошибка при получении инвентаря с местоположением' });
  }
};

module.exports = {
  getInventoriesByStorageUnitId,
  getInventoriesWithLocation
};
