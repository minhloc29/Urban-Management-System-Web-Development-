const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/engineer/engineerController');
const upload = require('../../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/assigned', authMiddleware, permissionMiddleware(['VIEW_ASSIGNED_TASKS']), engineerController.getAssignedIncidents);

router.post('/:id/update', 
  authMiddleware, 
  permissionMiddleware(['UPDATE_INCIDENT_STATUS']),
  upload.array('images', 5), 
  engineerController.updateIncidentProgress
);

module.exports = router;