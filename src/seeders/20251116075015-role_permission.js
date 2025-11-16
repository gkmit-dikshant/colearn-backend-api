"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const rolePermissions = [];

    // Helper to push permissions
    const assign = (roleId, permissionIds) => {
      permissionIds.forEach((permId) => {
        rolePermissions.push({
          role_id: roleId,
          permission_id: permId,
          created_at: now,
        });
      });
    };

    // -----------------------------
    // 1. ADMIN → ALL permissions
    // -----------------------------
    const ALL_PERMISSIONS = Array.from({ length: 16 }, (_, i) => i + 1);
    assign(1, ALL_PERMISSIONS); // role_id = 1 (admin)

    // -----------------------------
    // 2. OWNER → project-scoped power
    // -----------------------------
    const OWNER_PERMISSIONS = [
      // Project CRUD (resource = 1)
      1,
      5,
      9,
      13,

      // Read users (resource = 2)
      6, // read users

      // Applications: create, read, update (resource = 3)
      3,
      7,
      11,

      // Read skills (resource = 4)
      14,
    ];
    assign(2, OWNER_PERMISSIONS); // role_id = 2 (owner)

    // -----------------------------
    // 3. MEMBER → basic contributor
    // -----------------------------
    const MEMBER_PERMISSIONS = [
      // Read project
      5,

      // Create & read applications
      3, 7,

      // Read skills
      14,
    ];
    assign(3, MEMBER_PERMISSIONS); // role_id = 3 (member)

    // Insert all role-permissions
    await queryInterface.bulkInsert("role_permissions", rolePermissions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
