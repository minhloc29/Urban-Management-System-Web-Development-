const express = require('express');
const router = express.Router();
const adminAllReport = require('../../controllers/admin/adminAllReport');
const authMiddleware = require('../../middleware/authMiddleware')
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/', authMiddleware, permissionMiddleware(['VIEW_ALL_INCIDENTS']), adminAllReport.getAllReports);
router.patch("/:id/delete", authMiddleware, adminAllReport.deleteReport);

module.exports = router;