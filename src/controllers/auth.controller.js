const { authService } = require("../services");
const client = require("../config/redis");
const emailHelper = require("../utils/email.helper");
const { createOtp, createJwtToken, verifyJwtToken } = require("../utils/helper");

const signup = async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  const otpExpMin = Number(process.env.OTP_EXP_MIN) || 5;

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
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = JSON.parse(await client.get(email));
  if (!user) {
    return res.status(401).json({
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

  // delete cashe
  await client.del(email);

  // create user
  try {
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
    return res.status(400).json({
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
      return res.status(404).json({
        success: false,
        message: `no user with email ${email}`,
      });
    }
    const accessToken = createJwtToken("access", { id: user.id, email });
    const refreshToken = createJwtToken("refresh", { id: user.id, email });

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const sendAccessToken = async (req, res, next) => {
  const { email, refreshToken } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "please provide email",
    });
  }
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "please provide password",
    });
  }

  const currUser = verifyJwtToken("refresh", refreshToken);
  if (!currUser || currUser.email !== email) {
    return res.status(401).json({
      success: false,
      message: "invalid refresh token, please login agian",
    });
  }

  const accessToken = createJwtToken("access", currUser);

  return res.status(200).json({
    success: true,
    accessToken,
  });
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
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signup, verifyOtp, login, sendAccessToken, getLoginUserDetails };
