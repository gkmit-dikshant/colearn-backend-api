const express = require("express");
const logger = require("./utils/logger.js");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use("/", (req, res, next) => logger(req, res, next));
app.use("/api", routes);

module.exports = app;
