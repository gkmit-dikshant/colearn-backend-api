import { Sequelize } from "sequelize";
import config from "./config.js";

const sequelize = new Sequelize({
  dialect: "postgres",
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASS,
  host: config.DB_HOST,
  port: config.DB_PORT,
  timezone: "+05:30",
  pool: {
    max: 20,
    min: 0,
    acquire: 0,
    idle: 0,
  },
});

try {
  await sequelize.authenticate();
  console.log("Db connected Successfully");
} catch (error) {
  console.log("unable to connect Db", error);
}

export default sequelize;
