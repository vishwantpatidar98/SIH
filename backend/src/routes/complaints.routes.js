const express = require('express');

const complaintsController = require('../controllers/complaints.controller');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/upload',
  requireAuth,
  complaintsController.uploadEvidence
);

router.post(
  '/',
  requireAuth,
  complaintsController.createComplaint
);

router.get(
  '/',
  requireAuth,
  complaintsController.listComplaints
);

router.patch(
  '/:complaintId/status',
  requireAuth,
  authorizeRoles('site_admin', 'super_admin'),
  complaintsController.updateComplaintStatus
);

module.exports = router;


