"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      this.belongsTo(models.Operation, {
        foreignKey: "operation_id",
        as: "operation",
      });

      this.belongsTo(models.Resource, {
        foreignKey: "resource_id",
        as: "resource",
      });

      this.hasMany(models.RolePermission, {
        foreignKey: "permission_id",
        as: "role_permissions",
      });
    }
  }
  Permission.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      operation_id: { type: DataTypes.INTEGER, allowNull: false },
      resource_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
    }
  );
  return Permission;
};
