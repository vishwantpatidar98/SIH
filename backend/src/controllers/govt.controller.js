const {
  createAdvisoryMessage,
  getAlertsByType
} = require('../models/queries');

const postAdvisory = async (req, res, next) => {
  try {
    const { slopeId = null, message, severity = 'info' } = req.body;

    const created = await createAdvisoryMessage(slopeId, message, severity);
    return res.status(201).json({
      success: true,
      data: created.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const getAdvisories = async (req, res, next) => {
  try {
    const { slopeId = null } = req.query;
    const advisories = await getAlertsByType('gov_advisory', slopeId);

    return res.json({
      success: true,
      data: advisories.rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postAdvisory,
  getAdvisories
};


