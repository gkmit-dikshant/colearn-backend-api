"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("operations", [
      { id: 1, name: "create" },
      { id: 2, name: "read" },
      { id: 3, name: "update" },
      { id: 4, name: "delete" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("operations", null, {});
  },
};
