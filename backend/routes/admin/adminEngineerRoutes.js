const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/adminEngineerController');

router.get('/', engineerController.getEngineers);

module.exports = router;