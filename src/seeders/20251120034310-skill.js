"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const PROJECT_SKILLS = [
      { id: 1, name: "JavaScript" },
      { id: 2, name: "React" },
      { id: 3, name: "Node.js" },
      { id: 4, name: "Python" },
      { id: 5, name: "team management" },
      { id: 6, name: "physics" },
      { id: 7, name: "communication" },
    ];

    return queryInterface.bulkInsert("skills", PROJECT_SKILLS, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("skills", null, {});
  },
};
