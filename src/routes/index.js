const express = require("express");
const authRoutes = require("./auth.route.js");
const projectRoutes = require("./project.route.js");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
