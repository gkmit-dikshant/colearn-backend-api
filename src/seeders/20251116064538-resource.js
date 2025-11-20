"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("resources", [
      { id: 1, name: "projects" },
      { id: 2, name: "users" },
      { id: 3, name: "applications" },
      { id: 4, name: "skills" },
      { id: 5, name: "locations" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("resources", null, {});
  },
};
