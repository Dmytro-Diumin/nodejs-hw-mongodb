import Joi from 'joi';

export const resetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
