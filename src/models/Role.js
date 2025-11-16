"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.RolePermission, {
        foreignKey: "role_id",
        as: "role_permissions",
      });

      this.hasMany(models.ProjectUserRole, {
        foreignKey: "role_id",
        as: "project_user_roles",
      });
    }
  }
  Role.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );
  return Role;
};
