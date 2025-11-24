-- ==========================================================
-- 1. EXTENSIONS
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- ==========================================================
-- 2. ROLES TABLE
-- ==========================================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES
('field_worker'),
('site_admin'),
('gov_authority'),
('super_admin');

-- ==========================================================
-- 3. USERS TABLE
-- ==========================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 4. GOVERNMENT AUTHORITIES TABLE
-- ==========================================================
CREATE TABLE govt_authorities (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    department VARCHAR(255) NOT NULL,       -- police, NDRF, railways etc
    region VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 5. SITES / SLOPES
-- ==========================================================
CREATE TABLE slopes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326),
    risk_level VARCHAR(50) DEFAULT 'low',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 6. SENSORS TABLE
-- ==========================================================
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    slope_id INT REFERENCES slopes(id),
    name VARCHAR(255),
    sensor_type VARCHAR(100),        -- tilt, vibration, rainfall, manual_input
    unit VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 7. SENSOR READINGS (TIMESCALED)
-- ==========================================================
CREATE TABLE sensor_readings (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INT REFERENCES sensors(id),
    value NUMERIC,
    status VARCHAR(50) DEFAULT 'ok',
    PRIMARY KEY (time, sensor_id)
);

-- SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);

-- ==========================================================
-- 8. COMPLAINTS (Field Worker)
-- ==========================================================
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    slope_id INT REFERENCES slopes(id),
    description TEXT,
    media_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',       -- pending, in_progress, resolved
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 9. ALERTS TABLE
-- ==========================================================
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    slope_id INT REFERENCES slopes(id),
    alert_type VARCHAR(255),                   -- risk_high, sensor_failure, crack_detected
    message TEXT,
    severity VARCHAR(50),                       -- low/medium/high/critical
    created_at TIMESTAMP DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by INT REFERENCES users(id)
);

-- ==========================================================
-- 10. OFFLINE MESSAGES (Redis queue fallback storage)
-- ==========================================================
CREATE TABLE offline_messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    delivered BOOLEAN DEFAULT FALSE
);

-- ==========================================================
-- 11. CAMERA SNAPSHOTS (ML detections)
-- ==========================================================
CREATE TABLE camera_snapshots (
    id SERIAL PRIMARY KEY,
    slope_id INT REFERENCES slopes(id),
    image_url TEXT,
    detection JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 12. ML PREDICTION LOGS
-- ==========================================================
CREATE TABLE ml_predictions (
    id SERIAL PRIMARY KEY,
    slope_id INT REFERENCES slopes(id),
    risk_score NUMERIC,
    prediction JSONB,
    explainability JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
-- 13. TASK MANAGEMENT (Admin → Field Workers)
-- ==========================================================
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    assigned_by INT REFERENCES users(id),
    assigned_to INT REFERENCES users(id),
    slope_id INT REFERENCES slopes(id),
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, completed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
