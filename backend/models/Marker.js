const mongoose = require('mongoose');

const MarkerSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: ['landmark','entrance','parking','food','facility','emergency'],
      default: 'landmark',
    },
    icon:     { type: String, default: '📍' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Marker', MarkerSchema);
