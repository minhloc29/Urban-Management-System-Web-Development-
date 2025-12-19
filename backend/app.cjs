const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initializeSocket } = require('./config/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authentication/auth'));
app.use('/api/user/incidents', require('./routes/user/incidentRoutes'));

app.use('/api/admin/reports', require('./routes/admin/adminAllReports'));
app.use('/api/admin/engineer', require('./routes/admin/adminEngineerRoutes'));
app.use('/api/admin/assign', require('./routes/admin/assignRoutes'));

app.use('/api/engineer', require('./routes/engineer/engineerRoutes'));
//AI
app.use('/api/ai', require('./routes/ai/descriptionRoute'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };