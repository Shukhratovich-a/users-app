import Joi from "joi";

const loginScheme = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const registerScheme = Joi.object({
  username: Joi.string().min(3).max(25).required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().required(),
  contact: Joi.string().length(12).pattern(/^[0-9]+$/).required(),
});

export { loginScheme, registerScheme };