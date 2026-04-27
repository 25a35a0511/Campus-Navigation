const express  = require('express');
const router   = express.Router();
const Location = require('../models/Location');

router.get('/', async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q || q.trim() === '') return res.json([]);
    const regex  = new RegExp(q.trim(), 'i');
    const filter = {
      $or: [
        { name:        regex },
        { description: regex },
        { block:       regex },
        { roomNumber:  regex },
        { tags:        regex },
        { facilities:  regex },
      ],
    };
    if (type) filter.type = type;
    const results = await Location.find(filter).limit(20);
    res.json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
