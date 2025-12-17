const express = require('express');
const router = express.Router();
const adminAllReport = require('../../controllers/admin/adminAllReport');
const authMiddleware = require('../../middleware/authMiddleware')
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/', authMiddleware, permissionMiddleware(['VIEW_ALL_INCIDENTS']), adminAllReport.getAllReports);

module.exports = router;