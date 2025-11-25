const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  createUser,
  getUserByEmail,
  getRoleById
} = require('../models/queries');
const config = require('../config/env');

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
};

const register = async (req, res, next) => {
  try {
    const { roleId, name, email, phone, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const role = await getRoleById(roleId);
    if (role.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await createUser(roleId, name, email, phone, passwordHash);
    const user = sanitizeUser(createdUser.rows[0]);
    user.role_name = role.rows[0].name;

    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userResult = await getUserByEmail(email);
    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        roleId: user.role_id,
        email: user.email
      },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    const roleResult = await getRoleById(user.role_id);
    const roleName = roleResult.rowCount > 0 ? roleResult.rows[0].name : null;
    const safeUser = sanitizeUser(user);
    safeUser.role_name = roleName;

    return res.json({
      success: true,
      token,
      data: safeUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};


