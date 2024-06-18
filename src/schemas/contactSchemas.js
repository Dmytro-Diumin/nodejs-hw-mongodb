import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Name is required',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 20',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email',
  }),
  phone: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Phone number is required',
    'string.min': 'Phone number should have a minimum length of 3',
    'string.max': 'Phone number should have a maximum length of 20',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 20',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email',
  }),
  phone: Joi.string().min(3).max(20).messages({
    'string.min': 'Phone number should have a minimum length of 3',
    'string.max': 'Phone number should have a maximum length of 20',
  }),
})
  .or('name', 'email', 'phone')
  .messages({
    'object.missing': 'Name, email, or phone number is required to update',
  });
