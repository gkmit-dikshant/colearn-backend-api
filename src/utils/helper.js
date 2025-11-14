const createOtp = () => {
  let len = Number(process.env.OTP_LEN) || 4;
  let otp = "";
  while (len--) {
    otp += Math.floor(Math.random() * 10);
  }
  return Number(otp);
};

module.exports = {
  createOtp,
};
