import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export const getAllContactsService = async () => {
  return await Contact.find();
};

export const getContactByIdService = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContactService = async (payload) => {
  const { name, phoneNumber, email, isFavourite, contactType } = payload;

  if (!name || !phoneNumber) {
    throw createHttpError(400, {
      status: 400,
      message: 'Bad Request',
      data: { message: 'Name and phone number are required' },
    });
  }

  const newContact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  await newContact.save();
  return newContact;
};

export const updateContactById = async (id, updatedFields) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    { new: true },
  );

  return updatedContact;
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
