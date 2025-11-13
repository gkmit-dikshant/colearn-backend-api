"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(200), allowNull: false },
      email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      bio: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      underscored: true,
    }
  );
  return User;
};
