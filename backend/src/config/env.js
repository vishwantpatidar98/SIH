require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:1@localhost:5432/sih_db',
  jwtSecret: process.env.JWT_SECRET || 'supersecretjwt'
};

module.exports = config;
