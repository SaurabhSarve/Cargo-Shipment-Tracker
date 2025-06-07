const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// GET all shipments
router.get('/shipments', async (req, res) => {
  const shipments = await Shipment.find();
  res.json(shipments);
});

// GET shipment by ID
router.get('/shipment/:id', async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) return res.status(404).json({ message: 'Not found' });
  res.json(shipment);
});

// ✅ FIXED: POST new shipment (with correct currentLocation)
router.post('/shipment', async (req, res) => {
  const { shipmentId, containerId, route, currentLocation } = req.body;
  
  const shipment = new Shipment({
    shipmentId,
    containerId,
    route,
    currentLocation: currentLocation || route?.[0] || '',
    currentETA: new Date(Date.now() + 2 * 60 * 60 * 1000), // temporary placeholder
    status: 'In Transit'
  });

  await shipment.save();
  res.status(201).json(shipment);
});

// POST update location
router.post('/shipment/:id/update-location', async (req, res) => {
  const { currentLocation } = req.body;
  const shipment = await Shipment.findByIdAndUpdate(
    req.params.id,
    { currentLocation },
    { new: true }
  );
  res.json(shipment);
});

// GET ETA
router.get('/shipment/:id/eta', async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) return res.status(404).json({ message: 'Not found' });

  const newETA = new Date(Date.now() + 2 * 60 * 60 * 1000);
  shipment.currentETA = newETA;
  await shipment.save();
  res.json({ eta: newETA });
});

module.exports = router;
