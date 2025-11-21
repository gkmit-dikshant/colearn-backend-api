const joi = require("joi");

const createApplicationValidation = (req, res, next) => {
  const schema = joi.object({
    message: joi
      .string()
      .max(1000)
      .messages({
        "string.max": "Message must be up to 1000 characters",
      })
      .required()
      .messages({
        "any.required": "Message is required",
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

const updateApplicationValidation = (req, res, next) => {
  const schema = joi.object({
    message: joi.string().max(1000).messages({
      "string.max": "Message must be up to 1000 characters",
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
  createApplicationValidation,
  updateApplicationValidation,
};
