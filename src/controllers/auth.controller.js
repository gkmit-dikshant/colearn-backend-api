const jwt = require("jsonwebtoken");
const { authService } = require("../services");
const client = require("../config/redis");
const { createOtp } = require("../utils/helper");
const emailHelper = require("../utils/email.helper");

const createAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new Error("JWT secret is not defined");

  return jwt.sign(payload, secret);
};

const signup = async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  const otpExpMin = Number(process.env.OTP_EXP_MIN) || 5;

  // create otp
  const otp = createOtp();

  // store otp
  await client.set(
    email,
    JSON.stringify({
      otp,
      name,
      email,
      password,
      bio,
    }),
    { EX: otpExpMin * 60 }
  );

  // send email
  await emailHelper.send(email, "OTP for Registration | Colearn", "signup-otp", {
    username: name,
    otp,
    expiryMinutes: otpExpMin,
  });

  return res.status(201).json({
    success: true,
    message: "otp sent successfully",
  });
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = JSON.parse(await client.get(email));
  if (!user) {
    return res.status(403).json({
      success: false,
      message: "please signup first",
    });
  }
  if (user.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "invalid otp",
    });
  }

  // create user
  try {
    const userField = await authService.signup({
      name: user.name,
      email: user.email,
      password: user.password,
      bio: user.bio,
    });

    const token = createAccessToken({
      id: userField.id,
      email: userField.email,
    });
    return res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { signup, verifyOtp };
