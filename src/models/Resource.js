"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resource extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Permission, {
        foreignKey: "resource_id",
        as: "permissions",
      });
    }
  }
  Resource.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Resource",
      tableName: "resources",
    }
  );
  return Resource;
};
