import createHttpError from 'http-errors';
import Contact from '../models/contact.js';
import {
  createContactService,
  getAllContactsService,
  getContactByIdService,
  updateContactById,
} from '../services/contacts.js';
import mongoose from 'mongoose';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: '200',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: '500',
      message: 'Server error',
      data: error,
    });
  }
};

export const getContactByIdController = async (req, res, next) => {
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

  const contact = await getContactByIdService(contactId);
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
};

export const createContact = async (req, res) => {
  const newContact = await createContactService(req.body);
  res.json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const updatedContact = await updateContactById(contactId, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  if (!updatedContact) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      }),
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.contactId);
  if (!contact) {
    throw createHttpError(404, { message: 'Contact not found' });
  }

  const contacts = await getAllContactsService();
  res.status(204).json({
    status: 204,
    message: 'Contact deleted successfully',
    data: contacts,
  });
};
