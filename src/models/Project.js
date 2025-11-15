"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      this.belongsToMany(models.Skill, {
        through: models.UserSkill,
        foreignKey: "project_id",
        otherKey: "skill_id",
        as: "skills",
      });

      this.hasMany(models.UserSkill, {
        foreignKey: "project_id",
        as: "project_skills",
      });

      this.hasMany(models.Application, {
        foreignKey: "project_id",
        as: "applications",
      });
    }
  }
  Project.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      location_id: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
    }
  );
  return Project;
};
