"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSkill extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      this.belongsTo(models.Skill, {
        foreignKey: "skill_id",
        as: "skill",
      });
    }
  }
  UserSkill.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      skill_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "UserSkill",
      tableName: "user_skills",
    }
  );
  return UserSkill;
};
