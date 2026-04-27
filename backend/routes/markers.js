const express = require('express');
const router  = express.Router();
const Marker  = require('../models/Marker');

router.get('/', async (_req, res) => {
  try {
    res.json(await Marker.find({ isActive: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const m = new Marker(req.body);
    await m.save();
    res.status(201).json(m);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Marker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/seed/demo', async (_req, res) => {
  try {
    await Marker.deleteMany({});
    const demo = [
      { title: 'Main Gate',        description: 'Primary campus entrance',    coordinates: { lat: 17.4473, lng: 78.3905 }, category: 'entrance',  icon: '🚪' },
      { title: 'Parking Zone A',   description: 'Student parking area',       coordinates: { lat: 17.4476, lng: 78.3902 }, category: 'parking',   icon: '🅿️' },
      { title: 'Medical Center',   description: 'Campus health facility',     coordinates: { lat: 17.4494, lng: 78.3918 }, category: 'facility',  icon: '🏥' },
      { title: 'Drinking Water',   description: 'Drinking water station',     coordinates: { lat: 17.4488, lng: 78.3906 }, category: 'facility',  icon: '💧' },
      { title: 'Fire Exit — North',description: 'Emergency exit point',       coordinates: { lat: 17.4496, lng: 78.3910 }, category: 'emergency', icon: '🚨' },
      { title: 'ATM',              description: 'Campus ATM kiosk',           coordinates: { lat: 17.4477, lng: 78.3908 }, category: 'facility',  icon: '🏧' },
    ];
    const inserted = await Marker.insertMany(demo);
    res.json({ message: `${inserted.length} markers seeded ✅` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
