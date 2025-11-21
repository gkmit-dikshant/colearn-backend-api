const Joi = require("joi");

const otpLen = process.env.OTP_LENGTH || 4;
if (isNaN(otpLen) || otpLen < 4 || otpLen > 10) {
  throw new Error("Invalid OTP_LENGTH environment variable");
}

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required().messages({
      "string.max": "Name must be a string up to 50 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
    bio: Joi.string().max(300).allow("").messages({
      "string.max": "Bio must be a string up to 300 characters",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: `Validation failed: ${error.details[0].message}`,
    });
  }

  next();
};

const otpValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string()
      .length(otpLen)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": `OTP must be a ${otpLen}-digit number`,
        "string.pattern.base": `OTP must be a ${otpLen}-digit number`,
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: `Validation failed: ${error.details[0].message}`,
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: `Validation failed: ${error.details[0].message}`,
    });
  }

  next();
};

const refreshTokenValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    refreshToken: Joi.string().required().messages({
      "any.required": "Refresh token is required",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: `Validation failed: ${error.details[0].message}`,
    });
  }

  next();
};

module.exports = {
  signupValidation,
  otpValidation,
  loginValidation,
  refreshTokenValidation,
};
