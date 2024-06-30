import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactByIdController,
  updateContact,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';

const contactRouter = express.Router();

contactRouter.use(authenticate);

const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

contactRouter.get('/', ctrlWrapper(getAllContacts));

contactRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactRouter.post(
  '/',
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);
contactRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  updateContact,
);
contactRouter.delete('/:contactId', ctrlWrapper(deleteContact));

export default contactRouter;
