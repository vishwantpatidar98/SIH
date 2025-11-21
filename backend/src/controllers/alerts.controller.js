const {
  createAlert,
  acknowledgeAlert,
  getAlertsBySlope
} = require('../models/queries');

const createAlertController = async (req, res, next) => {
  try {
    const { slopeId, alertType, message, severity } = req.body;

    const created = await createAlert(slopeId, alertType, message, severity);
    return res.status(201).json({
      success: true,
      data: created.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const acknowledge = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User id required to acknowledge alert'
      });
    }

    const updated = await acknowledgeAlert(alertId, userId);
    if (updated.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    return res.json({
      success: true,
      data: updated.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const getAlertsForSlope = async (req, res, next) => {
  try {
    const { slopeId } = req.params;
    const alerts = await getAlertsBySlope(slopeId);

    return res.json({
      success: true,
      data: alerts.rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlert: createAlertController,
  acknowledge,
  getAlertsForSlope
};


