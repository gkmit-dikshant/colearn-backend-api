const { authService, userService } = require("../services");
const client = require("../config/redis");
const emailHelper = require("../utils/email.helper");
const { createOtp, createJwtToken, verifyJwtToken } = require("../utils/helper");

const signup = async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  const otpExpMin = Number(process.env.OTP_EXP_MIN) || 5;

  try {
    const existingUser = await userService.getUserDetailsByEmail(email);
    if (existingUser) {
      throw { statusCode: 409, message: "user with this email already exists" };
    }
    // create otp
    const otp = createOtp();

    // store data on redis
    const data = {
      otp,
      name,
      email,
      password,
      bio,
    };
    await client.set(email, JSON.stringify(data), "EX", otpExpMin * 60);

    // send email
    emailHelper.send(email, "OTP for Registration | Colearn", "signup-otp", {
      username: name,
      otp,
      expiryMinutes: otpExpMin,
    });

    return res.status(201).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = JSON.parse(await client.get(email));
    if (!user) {
      throw { statusCode: 401, message: "otp expired or invalid email" };
    }
    if (user.otp !== otp) {
      throw { statusCode: 400, message: "invalid otp" };
    }

    // delete cashe
    await client.del(email);

    // create user
    const userField = await authService.signup({
      name: user.name,
      email: user.email,
      password: user.password,
      bio: user.bio,
    });

    const refreshToken = createJwtToken("refresh", {
      id: userField.id,
      email: userField.email,
    });
    const accessToken = createJwtToken("access", {
      id: userField.id,
      email: userField.email,
    });

    return res.status(201).json({
      success: true,
      refreshToken,
      accessToken,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login({ email, password });

    if (!user) {
      throw { statusCode: 401, message: "invalid credentials" };
    }
    const accessToken = createJwtToken("access", { id: user.id, email });
    const refreshToken = createJwtToken("refresh", { id: user.id, email });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendAccessToken = async (req, res, next) => {
  const { email, refreshToken } = req.body;

  try {
    const currUser = verifyJwtToken("refresh", refreshToken);
    if (!currUser || currUser.email !== email) {
      throw { statusCode: 401, message: "invalid refresh token" };
    }

    const accessToken = createJwtToken("access", currUser);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLoginUserDetails = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await authService.getUserDetails(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signup, verifyOtp, login, sendAccessToken, getLoginUserDetails };
