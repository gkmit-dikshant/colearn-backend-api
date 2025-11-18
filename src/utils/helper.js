const jwt = require("jsonwebtoken");

const createOtp = () => {
  let len = Number(process.env.OTP_LEN) || 4;
  if (len < 4) throw new Error("invalid otp length in env");
  let otp = "";
  while (len--) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const createJwtToken = (type, payload) => {
  let secret = "";
  let exp = "";
  if (type === "refresh") {
    secret = process.env.JWT_REFRESH_SECRET;
    exp = process.env.JWT_REFRESH_EXP;
  } else if (type === "access") {
    secret = process.env.JWT_ACCESS_SECRET;
    exp = process.env.JWT_ACCESS_EXP;
  }
  if (!secret) throw new Error(`JWT ${type} secret is not defined`);

  return jwt.sign(payload, secret, { expiresIn: exp });
};

const verifyJwtToken = (type, token) => {
  let secret = "";
  if (type === "refresh") {
    secret = process.env.JWT_REFRESH_SECRET;
  } else if (type === "access") {
    secret = process.env.JWT_ACCESS_SECRET;
  }
  if (!secret) throw new Error(`JWT ${type} secret is not defined`);

  try {
    const decoded = jwt.verify(token, secret);
    return decoded ? { id: decoded.id, email: decoded.email } : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  createOtp,
  createJwtToken,
  verifyJwtToken,
};
