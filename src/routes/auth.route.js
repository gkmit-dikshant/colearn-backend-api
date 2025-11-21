const express = require("express");
const { authController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  signupValidation,
  otpValidation,
  loginValidation,
  refreshTokenValidation,
} = require("../validators/auth.validator");
const router = express.Router();

router.post("/signup", signupValidation, authController.signup);
router.post("/verify-otp", otpValidation, authController.verifyOtp);
router.post("/login", loginValidation, authController.login);
router.post("/refresh", refreshTokenValidation, authController.sendAccessToken);
router.get("/me", authMiddleware, authController.getLoginUserDetails);

module.exports = router;
