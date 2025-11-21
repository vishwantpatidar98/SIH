const express = require('express');

const alertsController = require('../controllers/alerts.controller');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  requireAuth,
  authorizeRoles('site_admin', 'super_admin', 'gov_authority'),
  alertsController.createAlert
);

router.post(
  '/:alertId/acknowledge',
  requireAuth,
  alertsController.acknowledge
);

router.get(
  '/slope/:slopeId',
  requireAuth,
  alertsController.getAlertsForSlope
);

module.exports = router;


