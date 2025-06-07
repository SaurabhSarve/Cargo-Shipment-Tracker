const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  containerId: { type: String, required: true },
  route: [{ type: String }],
  currentLocation: { type: String },
  currentETA: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
