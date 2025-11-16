"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      this.hasMany(models.Project, {
        foreignKey: "location_id",
        as: "projects",
      });
    }
  }
  Location.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      descriptions: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Location",
      tableName: "locations",
    }
  );
  return Location;
};
