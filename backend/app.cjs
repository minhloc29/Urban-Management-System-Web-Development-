const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

require('./models/Permission');
require('./models/Role');
require('./models/User');
require('./models/IncidentType');
require('./models/Incident');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));

// USER
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ADMIN
app.use('/api/admin/assign', require('./routes/admin/assignRoutes'));
app.use('/api/admin/engineer', require('./routes/admin/adminEngineerRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  await connectDB(); // <-- FIX
  console.log("🔥 MongoDB connected successfully!");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
};

startServer();
