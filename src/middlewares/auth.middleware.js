const { User } = require("../models");
const { verifyJwtToken } = require("../utils/helper");
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
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

  const user = await User.findByPk(currUser.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `user with email ${currUser.email} does'nt exist`,
    });
  }

  req.user = currUser;
  next();
};

module.exports = authMiddleware;
