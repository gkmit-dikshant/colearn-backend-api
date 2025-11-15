"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
      project_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "projects", key: "id" } },
      status: { type: Sequelize.ENUM("pending", "accepted", "rejected"), defaultValue: "pending" },
      message: { type: Sequelize.TEXT, allowNull: false },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("applications");
  },
};
