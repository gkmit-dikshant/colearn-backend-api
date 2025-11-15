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

const login = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) {
    const field = missingDetail({ email, password });
    throw new Error(`please provide ${field}`);
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return new Error("invalid credential");
    }

    return user;
  } catch (error) {
    console.log("failed to fetch user with email", error.message);
    throw error;
  }
};

module.exports = {
  signup,
  login,
};
