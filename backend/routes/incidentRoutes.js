const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// ============================================================
// ĐỊNH NGHĨA ROUTES CHO SỰ CỐ
// ============================================================

// 1. Route PUBLIC (Ai cũng gọi được)
// Đường dẫn đầy đủ sẽ là: http://localhost:3000/api/incidents/public
router.get('/public', incidentController.getPublicIncidents);


// (Sau này Lộc sẽ thêm các route cần bảo mật ở dưới đây)
// ví dụ: router.post('/', authMiddleware, incidentController.createIncident);

module.exports = router;