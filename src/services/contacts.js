import Contact from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../сontact/index.js';

export const getContactsService = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await Contact.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const totalItems = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...totalItems };
};

export const getContactByIdService = async (userId, contactId) => {
  const contact = await Contact.findOne({ _id: contactId, userId: userId });
  return contact;
};

export const createContactService = async (contactData) => {
  const contact = await Contact.create(contactData);
  return contact;
};

export const updateContactByIdService = async (
  contactId,
  userId,
  updateData,
) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, includeResultMetadata: true },
  );

  if (!contact || !contact.value) return null;

  return {
    contact: contact.value,
    isNew: Boolean(contact?.lastErrorObject?.upserted),
  };
};

export const deleteContactByIdService = async (userId, contactId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
