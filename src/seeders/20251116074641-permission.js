"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const permissions = [];

    const operations = [1, 2, 3, 4]; // create, read, update, delete
    const resources = [1, 2, 3, 4]; // projects, users, applications, skills

    let id = 1;
    for (const op of operations) {
      for (const res of resources) {
        permissions.push({
          id: id++,
          operation_id: op,
          resource_id: res,
          created_at: now,
        });
      }
    }

    await queryInterface.bulkInsert("permissions", permissions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
