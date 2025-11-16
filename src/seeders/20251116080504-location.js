"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Paste API output here (Array of city names)
    const cities = [
      "Ābu",
      "Ajmer",
      "Aklera",
      "Alwar",
      "Bāndīkūi",
      "Bānswāra",
      "Baran",
      "Bāri",
      "Baswa",
      "Beāwar",
      "Behror",
      "Bharatpur",
      "Bhīlwāra",
      "Bīkaner",
      "Būndi",
      "Chaksu",
      "Chidawa",
      "Chittaurgarh",
      "Chūru",
      "Dausa",
      "Gangānagar",
      "Gangāpur",
      "Hanumangarh",
      "Jaipur",
      "Jaisalmer",
      "Jhunjhunūn",
      "Jobner",
      "Jodhpur",
      "Karauli",
      "Kishangarh",
      "Kota",
      "Lālsot",
      "Nāgaur",
      "Nāthdwāra",
      "Nawalgarh",
      "Pāli",
      "Phulera",
      "Pilāni",
      "Pokaran",
      "Pratāpgarh",
      "Pushkar",
      "Raipur",
      "Rājgarh",
      "Rājsamand",
      "Rāmgarh",
      "Rāwatbhāta",
      "Sīkar",
      "Udaipur",
    ];

    const locations = cities.map((city) => ({
      descriptions: city,
    }));

    await queryInterface.bulkInsert("locations", locations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("locations", null, {});
  },
};
