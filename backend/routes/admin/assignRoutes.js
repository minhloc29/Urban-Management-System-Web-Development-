const express = require('express');
const router = express.Router();
const assignController = require('../../controllers/assignController');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/incidents', assignController.getIncidentsForAssignment);
router.post('/assign_engineer', authMiddleware, assignController.assignEngineer);

module.exports = router;