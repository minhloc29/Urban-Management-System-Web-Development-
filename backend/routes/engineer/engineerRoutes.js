const express = require('express');
const router = express.Router();
const engineerController = require('../../controllers/engineer/engineerController');
const upload = require('../../middleware/uploadMiddleware'); // Import multer
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/assigned', authMiddleware, engineerController.getAssignedIncidents);

router.post('/:id/update', 
  authMiddleware, 
  upload.array('images', 5), 
  engineerController.updateIncidentProgress
);

module.exports = router;