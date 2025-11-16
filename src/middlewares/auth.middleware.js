const { User } = require("../models");
const { verifyJwtToken } = require("../utils/helper");
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "your not logged in",
    });
  }

  const currUser = verifyJwtToken("access", token);

  if (!currUser) {
    return res.status(403).json({
      success: false,
      message: "invalid token, login again",
    });
  }

  req.user = currUser;
  next();
};

module.exports = authMiddleware;
