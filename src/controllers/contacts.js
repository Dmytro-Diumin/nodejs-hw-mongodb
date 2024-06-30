import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactByIdService,
  getContactByIdService,
  getContactsService,
  updateContactByIdService,
} from '../services/contacts.js';
import mongoose from 'mongoose';
import Contact from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;
    const pageNumber = parseInt(page, 10);
    const perPageNumber = parseInt(perPage, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(perPageNumber) ||
      pageNumber < 1 ||
      perPageNumber < 1
    ) {
      return next(createHttpError(400, 'Invalid pagination parameters'));
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return next(
        createHttpError(
          400,
          'Invalid sortOrder parameter. Use "asc" or "desc"',
        ),
      );
    }

    const { contacts, totalItems } = await getContactsService(
      req.user._id,
      pageNumber,
      perPageNumber,
      sortBy,
      sortOrder,
      type,
      isFavourite,
    );

    const totalPages = Math.ceil(totalItems / perPageNumber);
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: pageNumber,
        perPage: perPageNumber,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
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
    const contact = await getContactByIdService(req.user._id, contactId);
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

export const getContactsByUserId = async (userId) => {
  try {
    const contacts = await Contact.find({ userId: userId });
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts by userId:', error);
    throw error;
  }
};

export const getContactByUserId = async (userId, contactId) => {
  try {
    const contact = await Contact.findOne({ _id: contactId, userId: userId });
    return contact;
  } catch (error) {
    console.error('Error fetching contact by userId:', error);
    throw error;
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, contactType, isFavourite } = req.body;
    const newContact = await createContactService({
      name,
      email,
      phoneNumber,
      contactType,
      isFavourite,
      userId: req.user._id,
    });
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(createHttpError(400, error.message));
    } else {
      next(createHttpError(500, error.message));
    }
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const updatedContact = await updateContactByIdService(
      contactId,
      req.user._id,
      {
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
      },
    );

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
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await deleteContactByIdService(req.user._id, contactId);
    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
