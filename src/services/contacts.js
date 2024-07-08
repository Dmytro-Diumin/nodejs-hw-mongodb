import Contact from '../models/contact.js';

export const getContactsService = async (
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
) => {
  const skip = (page - 1) * perPage;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const query = { userId };
  if (type) {
    query.contactType = type;
  }
  if (isFavourite) {
    query.isFavourite = isFavourite === 'true';
  }

  const [contacts, totalItems] = await Promise.all([
    Contact.find(query).skip(skip).limit(perPage).sort(sortOptions),
    Contact.countDocuments(query),
  ]);

  return { contacts, totalItems };
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
