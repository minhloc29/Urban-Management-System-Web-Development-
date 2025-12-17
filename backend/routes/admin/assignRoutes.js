const express = require('express');
const router = express.Router();
const assignController = require('../../controllers/admin/assignController');
const authMiddleware = require('../../middleware/authMiddleware');
const permissionMiddleware = require('../../middleware/permissionMiddleware');

router.get('/incidents', authMiddleware, permissionMiddleware(['VIEW_ALL_INCIDENTS']), assignController.getIncidentsForAssignment);
router.post('/assign_engineer', authMiddleware, permissionMiddleware(['ASSIGN_ENGINEER']), assignController.assignEngineer);

module.exports = router;