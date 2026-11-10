const { StorageUnit, Inventory, InventoryStorageUnit } = require('../models');
const {
  buildLocationChain,
  assertUnitLabAccess,
} = require('./storageUnitService');

/**
 * Загружает StorageUnit или кидает ошибку с NOT_FOUND.
 */
async function loadStorageUnitOrThrow(storageUnitId, includeInventories = true) {
  const query = {
    where: { id: storageUnitId },
  };
  if (includeInventories) {
    query.include = [
      {
        model: Inventory,
        as: 'inventories',
        through: {
          model: InventoryStorageUnit,
          attributes: ['quantity'],
        },
      },
    ];
  }

  const storageUnit = await StorageUnit.findOne(query);
  if (!storageUnit) {
    const err = new Error(`StorageUnit с id ${storageUnitId} не найден`);
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }
  return storageUnit;
}

/**
 * Лоты, лежащие в блоке хранения.
 * user — req.user: чужой lab (через chemstorage) → 403.
 */
const getInventoriesByStorageUnitId = async (storageunit_id, user) => {
  try {
    const storageUnit = await loadStorageUnitOrThrow(storageunit_id, true);
    await assertUnitLabAccess(user, storageUnit, 'просмотра инвентаря блока хранения');

    return storageUnit.inventories.map((inventory) => ({
      ...inventory.get(),
      quantity: inventory.InventoryStorageUnit.quantity,
    }));
  } catch (error) {
    console.error('Ошибка в getInventoriesByStorageUnitId:', error);
    throw error;
  }
};

/**
 * Лоты блока + цепочка location.
 * Та же проверка lab, что и у getInventoriesByStorageUnitId.
 */
const getInventoriesWithLocation = async (storageunit_id, user) => {
  const storageUnit = await loadStorageUnitOrThrow(storageunit_id, true);
  await assertUnitLabAccess(user, storageUnit, 'просмотра инвентаря блока хранения');

  const inventories = await Promise.all(
    storageUnit.inventories.map(async (inventory) => {
      const location = await buildLocationChain(storageunit_id, user);
      return { ...inventory.toJSON(), location };
    })
  );

  return inventories;
};

module.exports = {
  getInventoriesByStorageUnitId,
  getInventoriesWithLocation,
  loadStorageUnitOrThrow,
};
