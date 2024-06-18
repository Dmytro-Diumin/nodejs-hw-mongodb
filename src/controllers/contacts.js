import createHttpError from 'http-errors';
import {
  createContactService,
  deleteContactByIdService,
  getContactByIdService,
  getContactsService,
  updateContactByIdService,
} from '../services/contacts.js';
import mongoose from 'mongoose';

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

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await createContactService({ name, email, phone });
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    next(createHttpError(500, error.message));
  }
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
