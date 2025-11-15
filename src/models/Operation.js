"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Operation extends Model {
    static associate(models) {
      // define association here
    }
  }
  Operation.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Operation",
      tableName: "operations",
    }
  );
  return Operation;
};
