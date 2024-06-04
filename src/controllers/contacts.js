import { getAllContactsService } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
