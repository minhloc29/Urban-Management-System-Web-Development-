const express = require('express');
const router = express.Router();
const incidentController = require('../../controllers/user/incidentController');
const upload = require('../../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/my-reports', authMiddleware, incidentController.getMyIncidents);
router.get('/public', incidentController.getPublicIncidents);

router.post('/', 
  authMiddleware,
  upload.array('images', 5), 
  incidentController.createIncident
);

module.exports = router;
