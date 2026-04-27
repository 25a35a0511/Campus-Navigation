require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const locationRoutes = require('./routes/locations');
const markerRoutes  = require('./routes/markers');
const searchRoutes  = require('./routes/search');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/locations', locationRoutes);
app.use('/api/markers',   markerRoutes);
app.use('/api/search',    searchRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', message: 'Smart Campus Nav API running ✅' })
);

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-campus-nav';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
