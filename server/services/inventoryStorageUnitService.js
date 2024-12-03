const { StorageUnit, Inventory, InventoryStorageUnit } = require('../models');
const { buildLocationChain } = require('./storageUnitService');

const getInventoriesByStorageUnitId = async (storageunit_id) => {
    try {
        const storageUnit = await StorageUnit.findOne({
            where: { id: storageunit_id },
            include: [
                {
                    model: Inventory,
                    as: 'inventories',
                    through: {
                        model: InventoryStorageUnit,
                        attributes: ['quantity'], // Получаем поле quantity
                    },
                },
            ],
        });

        if (!storageUnit) {
            throw new Error(`StorageUnit с id ${storageunit_id} не найден`);
        }

        return storageUnit.inventories.map((inventory) => ({
            ...inventory.get(), // Преобразуем данные из модели
            quantity: inventory.InventoryStorageUnit.quantity, // Добавляем поле quantity
        }));
    } catch (error) {
        console.error('Ошибка в getInventoriesByStorageUnitId:', error);
        throw error;
    }
};

const getInventoriesWithLocation = async (storageunit_id) => {
    const storageUnit = await StorageUnit.findOne({
        where: { id: storageunit_id },
        include: [
            {
                model: Inventory,
                as: 'inventories',
            },
        ],
    });

    if (!storageUnit) {
        throw new Error(`StorageUnit с id ${storageunit_id} не найден`);
    }

    const inventories = await Promise.all(
        storageUnit.inventories.map(async (inventory) => {
            const location = await buildLocationChain(storageunit_id);
            return { ...inventory.toJSON(), location }; // Добавляем цепочку в инвентарь
        })
    );

    return inventories;
};

module.exports = { 
    getInventoriesByStorageUnitId,
    getInventoriesWithLocation

 };
