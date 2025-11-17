const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger.js");
const routes = require("./routes");
const app = express();

const clientUrl = process.env.CLIENT_URL || `http://localhost:5173`;

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", (req, res, next) => logger(req, res, next));

app.use("/api", routes);

module.exports = app;
