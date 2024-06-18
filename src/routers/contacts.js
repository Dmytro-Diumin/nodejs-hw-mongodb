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

const router = express.Router();

const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', validateBody(updateContactSchema), updateContact);
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
