import express from "express";

const app = express();

app.use("/", (req, res) => {
  res.send("welcome");
});

export default app;
