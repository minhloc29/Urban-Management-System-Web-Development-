const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/admin/adminEngineerController');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/', engineerController.getEngineers);
router.get('/available', engineerController.getAvailableEngineers);
router.post('/add_engineer', engineerController.addEngineer);

module.exports = router;