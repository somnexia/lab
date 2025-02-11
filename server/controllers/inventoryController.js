const inventoryService = require('../services/inventoryService'); // Путь к вашему сервису

// Создание новой записи инвентаря
const createInventoryItem = async (req, res) => {
  try {
    const newInventoryItem = await inventoryService.createInventoryItem(req.body);
    return res.status(201).json(newInventoryItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех записей инвентаря
const getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await inventoryService.getAllInventoryItems();
    return res.status(200).json(inventoryItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение записи инвентаря по ID
const getInventoryItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const inventoryItem = await inventoryService.getInventoryItemById(id);
    return res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// const getInventoriesByStorageUnitId = async (req, res) => {
//   try {
//     const { storageunit_id } = req.query;
//     if (!storageunit_id) {
//       return res.status(400).json({ error: "storageunit_id is required" });
//     }

//     const inventories = await inventoryService.getInventoriesByStorageUnitId(storageunit_id);
//     res.status(200).json(inventories);
//   } catch (error) {
//     console.error("Ошибка при получении инвентаря:", error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// };


// Обновление записи инвентаря по ID
const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedInventoryItem = await inventoryService.updateInventoryItem(id, req.body);
    return res.status(200).json(updatedInventoryItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление записи инвентаря по ID
const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await inventoryService.deleteInventoryItem(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getInventoriesByReferenceAndType = async (req, res) => {
  try {
    const { reference_id, item_type } = req.query;

    if (!reference_id || !item_type) {
      return res.status(400).json({
        error: 'Параметры reference_id и item_type обязательны',
      });
    }

    const inventories = await inventoryService.getInventoriesByReferenceAndType(
      reference_id,
      item_type
    );
    
    
    res.status(200).json(inventories);
  } catch (error) {
    console.error('Ошибка при фильтрации инвентаря:', error.message);
    res.status(500).json({
      error: 'Ошибка сервера при получении инвентаря',
    });
  }
};

const getLocationsForEntity = async (req, res) => {
  const { entityType, entityId } = req.params;

  try {
    const entity = await inventoryService.getLocationsForEntity(entityType, entityId);
    return res.status(200).json(entity);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};





module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoriesByReferenceAndType,
  getLocationsForEntity


};
