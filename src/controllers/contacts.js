import Contact from '../models/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
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

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};
