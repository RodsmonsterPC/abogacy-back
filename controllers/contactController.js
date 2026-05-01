const ContactMessage = require('../models/ContactMessage');

// @desc  Submit contact form
// @route POST /api/contact
// @access Public
const submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, practiceArea, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const contact = await ContactMessage.create({
      firstName,
      lastName,
      email,
      practiceArea: practiceArea || 'General',
      message,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: 'Your message has been received. We will contact you shortly.',
      id: contact._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Get all contact messages (admin)
// @route GET /api/contact
// @access Private
const getMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ messages, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update message status
// @route PUT /api/contact/:id
// @access Private
const updateMessageStatus = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete message
// @route DELETE /api/contact/:id
// @access Private
const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getMessages, updateMessageStatus, deleteMessage };
