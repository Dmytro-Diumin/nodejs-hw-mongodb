import { Router } from 'express';
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
import { upload } from '../middlewares/multer.js';

const contactRouter = Router();

contactRouter.use(authenticate);

export const ctrlWrapper = (ctrl) => {
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
  upload.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);
contactRouter.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);
contactRouter.delete('/:contactId', ctrlWrapper(deleteContact));

export default contactRouter;
