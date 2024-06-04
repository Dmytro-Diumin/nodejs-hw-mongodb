import Contact from '../models/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${contactId} not found` });
    }

    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
