const express = require('express');
const router = express.Router();
const incidentController = require('../../controllers/user/incidentController');
const upload = require('../../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/my-reports', authMiddleware, permissionMiddleware(['VIEW_OWN_INCIDENTS']), incidentController.getMyIncidents);
router.get('/public', incidentController.getPublicIncidents);

router.post('/', 
  authMiddleware,
  permissionMiddleware(['CREATE_INCIDENT']),
  upload.array('images', 5), 
  incidentController.createIncident
);

module.exports = router;
