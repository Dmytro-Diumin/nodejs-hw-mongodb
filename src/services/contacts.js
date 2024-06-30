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
  const contact = await Contact.findById({ _id: contactId, userId: userId });
  return contact;
};

export const createContactService = async ({
  name,
  email,
  phoneNumber,
  contactType,
  isFavourite,
  userId,
}) => {
  const newContact = new Contact({
    name,
    email,
    phoneNumber,
    contactType,
    isFavourite,
    userId,
  });
  await newContact.save();
  return newContact;
};

export const updateContactByIdService = async (
  userId,
  contactId,
  updateData,
) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );

  return updatedContact;
};

export const deleteContactByIdService = async (userId, contactId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
