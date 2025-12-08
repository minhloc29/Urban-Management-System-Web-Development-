const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const upload = require('../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../middleware/authMiddleware');

// --- ROUTE MỚI (Lấy danh sách việc được giao) ---
// Đặt lên đầu để tránh bị nhầm lẫn với các route có tham số (như /:id)
router.get('/assigned', authMiddleware, incidentController.getAssignedIncidents);
// ------------------------------------------------

router.get('/public', incidentController.getPublicIncidents);

router.post('/', 
  authMiddleware,
  upload.array('images', 5), 
  incidentController.createIncident
);

// --- 5. CẬP NHẬT TIẾN ĐỘ (DÒNG MỚI THÊM Ở ĐÂY) ---
router.post('/:id/update', 
  authMiddleware, 
  upload.array('images', 5), 
  incidentController.updateIncidentProgress
);
// -------------------------------------------------

module.exports = router;