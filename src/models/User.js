"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Skill, {
        through: models.UserSkill,
        foreignKey: "user_id",
        otherKey: "skill_id",
        as: "skills",
      });

      this.hasMany(models.UserSkill, {
        foreignKey: "user_id",
        as: "user_skills",
      });

      this.hasMany(models.Application, {
        foreignKey: "user_id",
        as: "applications",
      });
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
    }
  );
  return User;
};
