const express = require('express');

const sensorsController = require('../controllers/sensors.controller');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, sensorsController.listSensors);

router.post(
  '/',
  requireAuth,
  authorizeRoles('site_admin', 'super_admin'),
  sensorsController.addSensor
);

router.post(
  '/:sensorId/readings',
  requireAuth,
  authorizeRoles('field_worker', 'site_admin', 'super_admin'),
  sensorsController.addReading
);

router.get(
  '/:sensorId/readings',
  requireAuth,
  sensorsController.getReadings
);

module.exports = router;


