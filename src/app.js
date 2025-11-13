const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("welcome");
});

module.exports = app;
