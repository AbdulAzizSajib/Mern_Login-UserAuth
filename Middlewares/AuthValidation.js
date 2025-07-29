import Joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.empty": `"name" cannot be an empty field`,
      "string.min": `"name" should have a minimum length of 2`,
      "string.max": `"name" should have a maximum length of 50`,
    }),
    email: Joi.string().email().required().messages({
      "string.email": `"email" must be a valid email address`,
      "string.empty": `"email" cannot be an empty field`,
    }),
    password: Joi.string().min(4).max(100).required().messages({
      "string.min": `"password" should have a minimum length of 4`,
      "string.max": `"password" should have a maximum length of 100`,
      "string.empty": `"password" cannot be an empty field`,
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.details,
    });
  }
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.details,
    });
  }
  next();
};
