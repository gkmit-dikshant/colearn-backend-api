"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectUserRole extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });

      this.belongsTo(models.ProjectUser, {
        foreignKey: "project_user_id",
        as: "project_user",
      });
    }
  }
  ProjectUserRole.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      project_user_id: { type: DataTypes.INTEGER, allowNull: false },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "ProjectUserRole",
      tableName: "project_user_roles",
    }
  );
  return ProjectUserRole;
};
