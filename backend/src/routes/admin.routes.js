const express = require('express');

const adminController = require('../controllers/admin.controller');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const adminOnly = [requireAuth, authorizeRoles('site_admin', 'super_admin')];

router.get('/users', ...adminOnly, adminController.listUsers);
router.patch('/users/:userId/role', ...adminOnly, adminController.changeUserRole);

router.get('/slopes', ...adminOnly, adminController.listSlopes);
router.post('/slopes', ...adminOnly, adminController.createSlope);
router.patch('/slopes/:slopeId/risk', ...adminOnly, adminController.updateSlopeRisk);

router.get('/tasks', ...adminOnly, adminController.listTasks);
router.post('/tasks', ...adminOnly, adminController.createTask);
router.patch('/tasks/:taskId/status', ...adminOnly, adminController.updateTaskStatus);

module.exports = router;


