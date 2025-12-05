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

// --- THÊM DÒNG NÀY ---
// Mở quyền truy cập tĩnh cho thư mục 'uploads'
// Ví dụ: Truy cập http://localhost:5000/uploads/anh.jpg sẽ xem được ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/user/upload', require('./routes/user.upload'));

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
