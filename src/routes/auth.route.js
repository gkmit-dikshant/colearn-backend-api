const express = require("express");
const { authController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/refresh", authController.sendAccessToken);
router.get("/me", authMiddleware, authController.getLoginUserDetails);

module.exports = router;
