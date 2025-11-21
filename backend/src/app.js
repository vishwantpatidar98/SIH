require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { requestLogger } = require('./utils/logger');
const { notFoundHandler, errorHandler } = require('./middleware/validate');

// Route modules
const authRoutes = require('./routes/auth.routes');
const sensorsRoutes = require('./routes/sensors.routes');
const alertsRoutes = require('./routes/alerts.routes');
const complaintsRoutes = require('./routes/complaints.routes');
const govtRoutes = require('./routes/govt.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Basic security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-api', timestamp: new Date().toISOString() });
});

// API routes (wire up when implemented)
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/govt', govtRoutes);
app.use('/api/admin', adminRoutes);

// 404 + error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;


