const express  = require('express');
const router   = express.Router();
const Location = require('../models/Location');

// GET all (optional filters: type, block, floor)
router.get('/', async (req, res) => {
  try {
    const { type, block, floor } = req.query;
    const filter = {};
    if (type)              filter.type  = type;
    if (block)             filter.block = block;
    if (floor !== undefined && floor !== '') filter.floor = Number(floor);
    const locations = await Location.find(filter).sort({ name: 1 });
    res.json(locations);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const loc = await Location.findById(req.params.id);
    if (!loc) return res.status(404).json({ error: 'Not found' });
    res.json(loc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const loc = new Location(req.body);
    await loc.save();
    res.status(201).json(loc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const loc = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!loc) return res.status(404).json({ error: 'Not found' });
    res.json(loc);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const loc = await Location.findByIdAndDelete(req.params.id);
    if (!loc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /seed/demo — load sample campus data
router.post('/seed/demo', async (req, res) => {
  try {
    await Location.deleteMany({});
    const demo = [
      { name: 'CSE Lab 1',            type: 'lab',       block: 'A', floor: 1, roomNumber: 'A101', description: 'Computer Science Engineering Lab',         coordinates: { lat: 17.4486, lng: 78.3909 }, facilities: ['AC','Projector','Computers'], tags: ['cse','lab','computers'], capacity: 60 },
      { name: 'CSE Lab 2',            type: 'lab',       block: 'A', floor: 2, roomNumber: 'A201', description: 'Advanced Programming Lab',                  coordinates: { lat: 17.4488, lng: 78.3911 }, facilities: ['AC','Projector','Computers'], tags: ['cse','lab','programming'], capacity: 40 },
      { name: 'ECE Department',       type: 'office',    block: 'B', floor: 0, roomNumber: 'B001', description: 'Electronics & Communication Dept Office',    coordinates: { lat: 17.4490, lng: 78.3905 }, tags: ['ece','department'], capacity: 20 },
      { name: 'Main Seminar Hall',    type: 'hall',      block: 'C', floor: 1, roomNumber: 'C101', description: 'Large seminar hall for campus events',       coordinates: { lat: 17.4483, lng: 78.3915 }, facilities: ['AC','Stage','Projector','Sound'], tags: ['seminar','hall','events'], capacity: 500 },
      { name: 'Central Library',      type: 'library',   block: 'D', floor: 0, roomNumber: 'D001', description: 'Main campus library with digital resources', coordinates: { lat: 17.4492, lng: 78.3900 }, facilities: ['AC','WiFi','Digital Catalog'], tags: ['library','books','study'], capacity: 200, isAccessible: true },
      { name: 'HOD Office - CSE',     type: 'admin',     block: 'E', floor: 1, roomNumber: 'E102', description: 'Head of Department — CSE',                  coordinates: { lat: 17.4480, lng: 78.3912 }, tags: ['admin','hod','cse','office'] },
      { name: 'Cafeteria',            type: 'canteen',   block: 'F', floor: 0, roomNumber: 'F001', description: 'Main campus cafeteria & food court',         coordinates: { lat: 17.4478, lng: 78.3907 }, tags: ['food','canteen','cafeteria'], capacity: 300, isAccessible: true },
      { name: 'Classroom A-102',      type: 'classroom', block: 'A', floor: 1, roomNumber: 'A102', description: 'General purpose lecture hall',               coordinates: { lat: 17.4487, lng: 78.3910 }, facilities: ['Projector','Whiteboard'], tags: ['classroom','lecture'], capacity: 80 },
      { name: 'Conference Room',      type: 'office',    block: 'E', floor: 2, roomNumber: 'E201', description: 'Faculty conference & meeting room',           coordinates: { lat: 17.4481, lng: 78.3913 }, facilities: ['AC','Projector','Video Call'], tags: ['conference','faculty','meeting'], capacity: 30 },
      { name: 'Sports Ground',        type: 'other',     block: 'G', floor: 0, roomNumber: 'G001', description: 'Outdoor sports area & courts',               coordinates: { lat: 17.4475, lng: 78.3920 }, tags: ['sports','outdoor','ground'] },
      { name: 'Dr. Priya Room',       type: 'office',    block: 'B', floor: 1, roomNumber: 'B102', description: 'Asst. Prof Priya Sharma — ECE',              coordinates: { lat: 17.4491, lng: 78.3906 }, tags: ['faculty','ece','office'] },
      { name: 'Classroom B-201',      type: 'classroom', block: 'B', floor: 2, roomNumber: 'B201', description: 'ECE Department lecture hall',                coordinates: { lat: 17.4493, lng: 78.3904 }, facilities: ['Projector','AC'], tags: ['classroom','ece'], capacity: 60 },
    ];
    const inserted = await Location.insertMany(demo);
    res.json({ message: `${inserted.length} locations seeded ✅`, locations: inserted });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
