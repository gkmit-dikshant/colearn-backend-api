import express from "express";
import logger from "./utils/logger.js";

const app = express();

app.use(logger);
app.use("/", (req, res) => {
  res.send("welcome");
});

export default app;
