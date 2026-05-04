const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      default: 'gavel', // Material Symbol name
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    details: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Índice compuesto para la consulta más frecuente:
// GET /api/services → find({ isActive: true }).sort({ order: 1, createdAt: 1 })
serviceSchema.index({ isActive: 1, order: 1, createdAt: 1 });

module.exports = mongoose.model('Service', serviceSchema);
