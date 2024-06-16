import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactByIdService,
  getAllContactsService,
  getContactByIdService,
  updateContactByIdService,
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
        message: 'Invalid contact ID format',
        data: { message: `Invalid _id: ${contactId}` },
      }),
    );
  }

  try {
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

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
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

  const updatedContact = await updateContactByIdService(contactId, {
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

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await deleteContactByIdService(contactId);
    const { NotFound } = createHttpError;
    if (!result) {
      throw new NotFound('Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
