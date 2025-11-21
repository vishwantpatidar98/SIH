const express = require('express');

const govtController = require('../controllers/govt.controller');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/advisories',
  requireAuth,
  authorizeRoles('gov_authority', 'super_admin'),
  govtController.postAdvisory
);

router.get(
  '/advisories',
  requireAuth,
  govtController.getAdvisories
);

module.exports = router;


