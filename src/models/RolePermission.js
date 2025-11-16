"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      this.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permission",
      });
    }
  }
  RolePermission.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
      permission_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permission",
    }
  );
  return RolePermission;
};
