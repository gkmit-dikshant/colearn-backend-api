const joi = require("joi");

const createProjectValidation = (req, res, next) => {
  const schema = joi.object({
    title: joi.string().max(100).required().messages({
      "string.max": "Title must be up to 100 characters",
      "any.required": "Title is required",
    }),

    description: joi.string().max(500).required().messages({
      "string.max": "Description must be up to 500 characters",
      "any.required": "Description is required",
    }),

    skills: joi.array().items(joi.number()).messages({
      "array.base": "Skills must be an array of numbers",
    }),

    location_id: joi.number().required().messages({
      "number.base": "location_id must be a number",
      "any.required": "location_id is required",
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

const updateProjectValidation = (req, res, next) => {
  const schema = joi.object({
    title: joi.string().max(100).messages({
      "string.max": "Title must be up to 100 characters",
    }),

    description: joi.string().max(500).messages({
      "string.max": "Description must be up to 500 characters",
    }),

    skills: joi.array().items(joi.number()).messages({
      "array.base": "Skills must be an array of numbers",
    }),

    location_id: joi.number().messages({
      "number.base": "location_id must be a number",
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
  createProjectValidation,
  updateProjectValidation,
};
