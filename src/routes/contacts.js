import express from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts.js';

export const router = express.Router();

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
