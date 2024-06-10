import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

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

router.get(
  '/:contactId',
  ctrlWrapper(async (req, res, next) => {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next(
        createHttpError(400, {
          status: 400,
          message: 'Invalid contact ID',
          data: { message: 'Invalid contact ID format' },
        }),
      );
    }

    const contact = await getContactById(contactId);
    if (!contact) {
      return next(
        createHttpError(404, {
          status: 404,
          message: 'Contact not found',
          data: { message: 'Contact not found' },
        }),
      );
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  }),
);

export default router;
