"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserSkill,
        foreignKey: "skill_id",
        otherKey: "user_id",
        as: "users",
      });

      this.hasMany(models.UserSkill, {
        foreignKey: "skill_id",
        as: "user_skills",
      });
    }
  }
  Skill.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Skill",
      tableName: "skills",
    }
  );
  return Skill;
};
