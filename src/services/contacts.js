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

export const getContactByUserId = async (userId) => {
  try {
    const contact = await Contact.findOne({ userId: userId });
    return contact;
  } catch (error) {
    console.error('Error fetching contact by userId:', error);
    throw error;
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

export const updateContactByIdService = async (userId, id, updatedFields) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    { _id: id, userId },
    { $set: updatedFields },
    { new: true },
  );

  return updatedContact;
};

export const deleteContactByIdService = async (userId, contactId) => {
  const result = await Contact.findByIdAndDelete({ _id: contactId, userId });
  return result;
};
