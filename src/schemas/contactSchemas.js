import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(50).optional(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  contactType: Joi.string().min(3).max(20).optional(),
  isFavourite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
}).or('name', 'email', 'phoneNumber', 'contactType', 'isFavourite');
