const jwt = require('jsonwebtoken');

const config = require('../config/env');
const { getUserById, getRoleById } = require('../models/queries');

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.substring(7);
  }
  return null;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing'
      });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const userResult = await getUserById(payload.sub);
    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user'
      });
    }

    const user = userResult.rows[0];
    const roleResult = await getRoleById(user.role_id);
    const roleName = roleResult.rowCount > 0 ? roleResult.rows[0].name : null;

    req.user = {
      ...user,
      role_name: roleName
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: error.message
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role_name)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden'
    });
  }
  next();
};

module.exports = {
  requireAuth,
  authorizeRoles
};
