"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectSkill extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "project_id",
        as: "project",
      });

      this.belongsTo(models.Skill, {
        foreignKey: "skill_id",
        as: "skill",
      });
    }
  }
  ProjectSkill.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      skill_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "ProjectSkill",
      tableName: "project_skills",
    }
  );
  return ProjectSkill;
};
