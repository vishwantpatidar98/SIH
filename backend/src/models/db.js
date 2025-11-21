const { Pool } = require('pg');
const config = require('../config/env');

// NOTE: TimescaleDB hooks will be added later; for now we connect to plain PostgreSQL with PostGIS enabled.
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.dbSSL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
