import Contact from '../models/contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
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

export const getContactById = async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: '404',
        message: `Contact with id ${contactId} not found`,
        data: null,
      });
    }

    res.status(200).json({
      status: '200',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: '500',
      message: 'Server error',
      data: error,
    });
  }
};
