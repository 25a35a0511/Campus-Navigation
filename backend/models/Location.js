const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    type:        { type: String, enum: ['classroom','lab','office','hall','canteen','library','admin','other'], default: 'other' },
    block:       { type: String },
    floor:       { type: Number, default: 0 },
    roomNumber:  { type: String },
    description: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    facilities:   [String],
    tags:         [String],
    capacity:     { type: Number },
    isAccessible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', LocationSchema);
