const { User } = require("../models");
const { verifyJwtToken } = require("../utils/helper");
const optionalAuthMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next();
  }

  const currUser = verifyJwtToken("access", token);

  if (!currUser) {
    return next();
  }

  const user = await User.findByPk(currUser.id);

  if (!user) {
    return next();
  }

  req.user = currUser;
  next();
};

module.exports = optionalAuthMiddleware;
