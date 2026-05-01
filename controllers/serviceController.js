const Service = require('../models/Service');

// @desc  Get all active services
// @route GET /api/services
// @access Public
const getServices = async (req, res) => {
  try {
    const query = req.query.all ? {} : { isActive: true };
    const services = await Service.find(query).sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single service
// @route GET /api/services/:id
// @access Public
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create service
// @route POST /api/services
// @access Private
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update service
// @route PUT /api/services/:id
// @access Private
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete service
// @route DELETE /api/services/:id
// @access Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getServices, getService, createService, updateService, deleteService };
