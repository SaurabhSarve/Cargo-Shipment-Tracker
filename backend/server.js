const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const shipmentRoutes = require('./routes/shipmentRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api', shipmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// POST /api/shipment/:id/update-location
app.post('/shipment/:id/update-location', async (req, res) => {
  try {
    const { currentLocation } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

    shipment.currentLocation = currentLocation;

    // Check if close to final route point
    const toRad = (val) => (val * Math.PI) / 180;
    const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const current = currentLocation.split(',').map(Number);
    const destination = shipment.route.at(-1).split(',').map(Number);

    const distance = haversineDistance(current, destination);

    if (distance < 0.5) {
      shipment.status = 'Delivered';
    }

    await shipment.save();
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /shipment/:id/eta
app.get('/shipment/:id/eta', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment || !shipment.route || !shipment.currentLocation) {
      return res.status(400).json({ error: 'Missing data to calculate ETA' });
    }

    const route = shipment.route;
    const destinationStr = route.at(-1);
    const destination = destinationStr.split(',').map(Number);
    const current = shipment.currentLocation.split(',').map(Number);

    if (current.length !== 2 || destination.length !== 2) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const toRad = (value) => (value * Math.PI) / 180;
    const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const distance = haversineDistance(current, destination); // in km
    const speed = 50; // km/h average assumed
    const hours = distance / speed;

    const eta = new Date(Date.now() + hours * 3600000); // milliseconds

    // Save ETA in DB if needed
    shipment.currentETA = eta;
    await shipment.save();

    return res.json({ eta, distance: distance.toFixed(2), hours: hours.toFixed(2) });
  } catch (err) {
    console.error('ETA error:', err);
    return res.status(500).json({ error: err.message });
  }
});
