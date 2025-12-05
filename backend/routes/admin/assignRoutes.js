const express = require('express');
const router = express.Router();
const assignController = require('../../controllers/assignController');

router.get('/', assignController.getIncidentsForAssignment);
router.post('/assign', assignController.assignEngineer);

module.exports = router;