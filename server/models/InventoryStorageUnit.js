'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InventoryStorageUnit extends Model {
        static associate(models) {
            InventoryStorageUnit.belongsTo(models.Inventory, { foreignKey: 'inventory_id', as: 'inventory' });
            InventoryStorageUnit.belongsTo(models.StorageUnit, { foreignKey: 'storageunit_id', as: 'storageUnit' });
           
        }
    }

    InventoryStorageUnit.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        inventory_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'inventories',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false
        },
        storageunit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'storageunits',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
        

    }, {
        sequelize,
        modelName: 'InventoryStorageUnit',
        tableName: 'inventorystorageunits',
        timestamps: true
    });

    return InventoryStorageUnit;
};
