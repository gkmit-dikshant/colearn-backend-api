const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");

const missingDetail = (data) => {
  for (const key in data) {
    if (!data[key]) return key;
  }
};

const signup = async (payload) => {
  const { name, email, password, bio } = payload;
  if (!name || !email || !password || !bio) {
    const field = missingDetail({ name, email, password });
    throw new Error(`please provide ${field}`);
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
    });
    return user;
  } catch (error) {
    console.log("Failed to register:", error);
    throw error;
  }
};

module.exports = {
  signup,
};
