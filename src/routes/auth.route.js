const express = require("express");
const { authController } = require("../controllers");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/refresh", authController.sendRefreshToken);

module.exports = router;
