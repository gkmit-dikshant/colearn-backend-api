const jwt = require("jsonwebtoken");
const { authService } = require("../services");

const createAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new Error("JWT secret is not defined");

  return jwt.sign(payload, secret);
};

const signup = async (req, res, next) => {
  const { name, email, password, bio } = req.body;

  try {
    const user = await authService.signup({
      name,
      email,
      password,
      bio,
    });

    const token = createAccessToken({ id: user.id, email: user.email });
    return res.status(200).json({
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

module.exports = { signup };
