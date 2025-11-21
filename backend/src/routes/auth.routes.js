const express = require('express');
const { body } = require('express-validator');

const { register, login } = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('roleId').isInt().withMessage('roleId is required'),
    body('name').notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('phone is required'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 chars')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('password is required')
  ],
  validateRequest,
  login
);

module.exports = router;


