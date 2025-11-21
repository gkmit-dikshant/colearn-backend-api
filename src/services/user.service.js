const { User } = require("../models");

const getUserDetailsByEmail = async (email) => {
  try {
    if (!email) {
      throw { statusCode: 400, message: "no email provided for user details" };
    }
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "bio"],
    });
    return user;
  } catch (error) {
    console.log("failed to fetch user with email", error.message);
    throw error;
  }
};

module.exports = {
  getUserDetailsByEmail,
};
