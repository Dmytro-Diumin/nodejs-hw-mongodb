import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactByIdController,
  updateContact,
} from '../controllers/contacts.js';
import createHttpError from 'http-errors';
import { deleteContact } from '../services/contacts.js';

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

router.get('/contacts/:contactId', getContactByIdController);

router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', updateContact);
router.delete(
  '/:contactId',
  ctrlWrapper(async (req, res, next) => {
    const { contactId } = req.params;

    const deletedContact = await deleteContact(contactId);

    if (!deletedContact) {
      return next(
        createHttpError(404, {
          status: 404,
          message: 'Contact not found',
          data: { message: 'Contact not found' },
        }),
      );
    }

    res.sendStatus(204);
  }),
);

export default router;
