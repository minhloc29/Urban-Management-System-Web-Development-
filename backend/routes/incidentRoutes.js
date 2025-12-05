const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.get('/public', incidentController.getPublicIncidents);

module.exports = router;