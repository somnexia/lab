'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { ROLE_VALUES, DEFAULT_REGISTER_ROLE } = require('../config/roles');

/**
 * User — учётная запись LIMS.
 *
 * Фаза 1: поле role (4 значения). Связь с tenant: User → Employee → lab_id
 * (laboratory_id в JWT появится в фазе 3, колонки на users нет).
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    }
  }

  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * Роль приложения (не MySQL GRANT-пользователь).
     * Списки «кто что может»: config/roles.js (CAN_* , фаза 2).
     * Публичная регистрация всегда пишет student — см. userService.createUser.
     */
    role: {
      type: DataTypes.ENUM(...ROLE_VALUES),
      allowNull: false,
      defaultValue: DEFAULT_REGISTER_ROLE,
      validate: {
        isIn: {
          args: [ROLE_VALUES],
          msg: `role must be one of: ${ROLE_VALUES.join(', ')}`,
        },
      },
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'employees',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    silent: false,
  });

  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
