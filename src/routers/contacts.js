import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactByIdController,
  updateContact,
} from '../controllers/contacts.js';

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

router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', updateContact);
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
