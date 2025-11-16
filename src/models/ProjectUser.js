"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
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

      this.hasMany(models.ProjectUserRole, {
        foreignKey: "project_user_id",
        as: "project_user_roles",
      });
    }
  }
  ProjectUser.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "ProjectUser",
      tableName: "project_users",
    }
  );
  return ProjectUser;
};
