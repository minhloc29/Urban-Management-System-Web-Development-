const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/admin/adminEngineerController');
const authMiddleware = require('../../middleware/authMiddleware')
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/', authMiddleware, engineerController.getEngineers);
router.get('/available', authMiddleware, engineerController.getAvailableEngineers);
router.post('/add_engineer', authMiddleware, permissionMiddleware(['MANAGE_ENGINEERS']), engineerController.addEngineer);

module.exports = router;