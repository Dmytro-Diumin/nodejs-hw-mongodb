import express from 'express';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../utils/isValidId.js';

const contactRouter = express.Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getAllContacts));

contactRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactSchema),
  ctrlWrapper(createContact),
);
contactRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
contactRouter.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default contactRouter;
