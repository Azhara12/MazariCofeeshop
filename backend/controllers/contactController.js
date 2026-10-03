import Contact from '../models/Contact.js';

// @desc    Submit a contact query
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    if (contact) {
      res.status(201).json({
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        status: contact.status,
      });
    } else {
      res.status(400);
      throw new Error('Invalid contact data');
    }
  } catch (error) {
    next(error);
  }
};

export { submitContact };
