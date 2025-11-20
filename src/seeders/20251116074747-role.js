"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      { id: 1, name: "admin", description: "super admin with all rights" },
      { id: 2, name: "owner", description: "all rights at project level" },
      { id: 3, name: "member", description: "limited rights at project level" },
      { id: 4, name: "viewer", description: "no rights" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
