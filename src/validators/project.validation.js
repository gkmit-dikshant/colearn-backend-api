const joi = require("joi");

const createProjectValidation = (req, res, next) => {
  const schema = joi.object({
    title: joi.string().max(100).min(10).required().messages({
      "string.max": "Title must be up to 100 characters",
      "string.min": "Title must be atleast 10 characters",
      "any.required": "Title is required",
    }),

    description: joi.string().max(500).min(20).required().messages({
      "string.max": "Description must be up to 500 characters",
      "string.min": "Description must be atleast 20 characters",
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
    title: joi.string().max(100).min(10).required().messages({
      "string.max": "Title must be up to 100 characters",
      "string.min": "Title must be atleast 10 characters",
      "any.required": "Title is required",
    }),

    description: joi.string().max(500).min(20).required().messages({
      "string.max": "Description must be up to 500 characters",
      "string.min": "Description must be atleast 20 characters",
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

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};
