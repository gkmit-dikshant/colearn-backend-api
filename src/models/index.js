const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config.js");
const basename = path.basename(__filename);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = { sequelize, Sequelize };

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const modelDef = require(path.join(__dirname, file));
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
