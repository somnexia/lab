
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Laboratory extends Model {
		static associate(models) {
			Laboratory.hasMany(models.ChemStorage, { foreignKey: 'laboratory_id', as: 'chemstorages', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
		}
	}

	Laboratory.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		lab_name: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		location: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: true,
			defaultValue: null
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: null
		},
		specialization: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: null
		},
		lab_type: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: null
		}
	}, {
		sequelize,
		modelName: 'Laboratory',
		tableName: 'laboratories',  // Название таблицы в БД
		timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
	});

	return Laboratory;
};
