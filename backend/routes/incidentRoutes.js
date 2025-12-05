const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const upload = require('../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../middleware/authMiddleware');

// ============================================================
// ĐỊNH NGHĨA ROUTES CHO SỰ CỐ
// ============================================================


// 1. Route PUBLIC (Ai cũng gọi được)
// Đường dẫn đầy đủ sẽ là: http://localhost:3000/api/incidents/public
router.get('/public', incidentController.getPublicIncidents);


// --- ROUTE MỚI: TẠO BÁO CÁO ---
// Phải có authMiddleware để nó giải mã token và tạo ra req.user
router.post('/', 
  authMiddleware, // <--- THÊM CÁI NÀY VÀO
  upload.array('images', 5), 
  incidentController.createIncident
);

module.exports = router;