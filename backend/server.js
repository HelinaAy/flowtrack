const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const wellnessRoutes = require('./routes/wellnessRoutes');
// ...

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cycle', cycleRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/wellness', wellnessRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'FlowTrack API is running 🌸' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});