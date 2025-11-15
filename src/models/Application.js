"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      this.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });
    }
  }
  Application.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM("pending", "accepted", "rejected"), defaultValue: "pending" },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Application",
      tableName: "applications",
    }
  );
  return Application;
};
