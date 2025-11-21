const bcrypt = require("bcrypt");
const { User, Skill, UserSkill, sequelize } = require("../models");

const missingDetail = (data) => {
  for (const key in data) {
    if (!data[key]) return key;
  }
};

const signup = async (payload) => {
  const { name, email, password, bio } = payload;
  if (!name || !email || !password) {
    const field = missingDetail({ name, email, password });
    throw { statusCode: 400, message: `please provide ${field}` };
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
    throw { statusCode: 400, message: `please provide ${field}` };
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { statusCode: 404, message: "no user exists" };
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw { statusCode: 401, message: "invalid credentials" };
    }

    return user;
  } catch (error) {
    console.log("failed to fetch user with email", error.message);
    throw error;
  }
};

const getUserDetails = async (userId) => {
  if (!userId) {
    throw { statusCode: 400, message: "no user id provide for user details" };
  }
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "bio"],
  });

  return user;
};

module.exports = {
  signup,
  login,
  getUserDetails,
};
