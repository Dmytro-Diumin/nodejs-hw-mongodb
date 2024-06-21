import Contact from '../models/contact.js';

export const getContactsService = async (
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

  const query = {};
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

export const getContactByIdService = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContactService = async ({
  name,
  email,
  phoneNumber,
  contactType,
  isFavourite,
}) => {
  const newContact = new Contact({
    name,
    email,
    phoneNumber,
    contactType,
    isFavourite,
  });
  await newContact.save();
  return newContact;
};

export const updateContactByIdService = async (id, updatedFields) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { $set: updatedFields },
    { new: true },
  );

  return updatedContact;
};

export const deleteContactByIdService = async (contactId) => {
  const result = await Contact.findByIdAndDelete(contactId);
  return result;
};
