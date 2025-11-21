const { query } = require('./db');

/* ============================================================
   ROLES
============================================================ */
const getAllRoles = () => query(`SELECT * FROM roles`);
const getRoleById = (id) => query(`SELECT * FROM roles WHERE id = $1`, [id]);

/* ============================================================
   USERS
============================================================ */
const createUser = (role_id, name, email, phone, password_hash) =>
  query(
    `INSERT INTO users (role_id, name, email, phone, password_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [role_id, name, email, phone, password_hash]
  );

const getUserByEmail = (email) =>
  query(`SELECT * FROM users WHERE email = $1`, [email]);

const getUserById = (id) =>
  query(`SELECT * FROM users WHERE id = $1`, [id]);

/* ============================================================
   GOVT AUTHORITIES
============================================================ */
const createGovAuthority = (user_id, department, region) =>
  query(
    `INSERT INTO govt_authorities (user_id, department, region)
     VALUES ($1, $2, $3) RETURNING *`,
    [user_id, department, region]
  );

const getGovAuthorityByUser = (user_id) =>
  query(`SELECT * FROM govt_authorities WHERE user_id = $1`, [user_id]);

/* ============================================================
   SLOPES
============================================================ */
const createSlope = (name, description, lat, lng) =>
  query(
    `INSERT INTO slopes (name, description, location)
     VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))
     RETURNING *`,
    [name, description, lng, lat]
  );

const getAllSlopes = () => query(`SELECT * FROM slopes`);

const getSlopeById = (id) =>
  query(`SELECT * FROM slopes WHERE id = $1`, [id]);

/* ============================================================
   SENSORS
============================================================ */
const createSensor = (slope_id, name, sensor_type, unit) =>
  query(
    `INSERT INTO sensors (slope_id, name, sensor_type, unit)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [slope_id, name, sensor_type, unit]
  );

const getSensorsBySlope = (slope_id) =>
  query(`SELECT * FROM sensors WHERE slope_id = $1`, [slope_id]);

const getAllSensors = () =>
  query(`SELECT * FROM sensors ORDER BY created_at DESC`);

const getSensorById = (sensor_id) =>
  query(`SELECT * FROM sensors WHERE id = $1`, [sensor_id]);

/* ============================================================
   SENSOR READINGS (Timescale hypertables to be added later)
============================================================ */
const insertSensorReading = (sensor_id, value, status = 'ok') =>
  query(
    `INSERT INTO sensor_readings (time, sensor_id, value, status)
     VALUES (NOW(), $1, $2, $3) RETURNING *`,
    [sensor_id, value, status]
  );

const getSensorHistory = (sensor_id, limit = 100) =>
  query(
    `SELECT * FROM sensor_readings
     WHERE sensor_id = $1
     ORDER BY time DESC
     LIMIT $2`,
    [sensor_id, limit]
  );

/* ============================================================
   COMPLAINTS
============================================================ */
const createComplaint = (user_id, slope_id, description, media_url) =>
  query(
    `INSERT INTO complaints (user_id, slope_id, description, media_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, slope_id, description, media_url]
  );

const getComplaintsByUser = (user_id) =>
  query(`SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC`, [user_id]);

const getAllComplaints = () =>
  query(`SELECT * FROM complaints ORDER BY created_at DESC`);

const updateComplaintStatus = (id, status) =>
  query(
    `UPDATE complaints
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

/* ============================================================
   ALERTS
============================================================ */
const createAlert = (slope_id, alert_type, message, severity) =>
  query(
    `INSERT INTO alerts (slope_id, alert_type, message, severity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [slope_id, alert_type, message, severity]
  );

const acknowledgeAlert = (alert_id, user_id) =>
  query(
    `UPDATE alerts
     SET acknowledged = TRUE, acknowledged_by = $1
     WHERE id = $2
     RETURNING *`,
    [user_id, alert_id]
  );

const getAlertsBySlope = (slope_id) =>
  query(`SELECT * FROM alerts WHERE slope_id = $1 ORDER BY created_at DESC`, [slope_id]);

const getAlertsByType = (alert_type, slope_id) => {
  if (slope_id) {
    return query(
      `SELECT * FROM alerts
       WHERE alert_type = $1 AND slope_id = $2
       ORDER BY created_at DESC`,
      [alert_type, slope_id]
    );
  }
  return query(
    `SELECT * FROM alerts
     WHERE alert_type = $1
     ORDER BY created_at DESC`,
    [alert_type]
  );
};

const createAdvisoryMessage = (slope_id, message, severity = 'info') =>
  query(
    `INSERT INTO alerts (slope_id, alert_type, message, severity)
     VALUES ($1, 'gov_advisory', $2, $3)
     RETURNING *`,
    [slope_id, message, severity]
  );

/* ============================================================
   OFFLINE MESSAGES
============================================================ */
const addOfflineMessage = (user_id, payload) =>
  query(
    `INSERT INTO offline_messages (user_id, payload)
     VALUES ($1, $2) RETURNING *`,
    [user_id, payload]
  );

const getOfflineMessages = (user_id) =>
  query(
    `SELECT * FROM offline_messages
     WHERE user_id = $1 AND delivered = FALSE`,
    [user_id]
  );

const markOfflineDelivered = (id) =>
  query(`UPDATE offline_messages SET delivered = TRUE WHERE id = $1`, [id]);

/* ============================================================
   ML PREDICTIONS
============================================================ */
const savePrediction = (slope_id, risk_score, prediction, explainability) =>
  query(
    `INSERT INTO ml_predictions (slope_id, risk_score, prediction, explainability)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [slope_id, risk_score, prediction, explainability]
  );

/* ============================================================
   TASKS
============================================================ */
const createTask = (assigned_by, assigned_to, slope_id, title, description) =>
  query(
    `INSERT INTO tasks (assigned_by, assigned_to, slope_id, title, description)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [assigned_by, assigned_to, slope_id, title, description]
  );

const getTasksForUser = (user_id) =>
  query(`SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC`, [user_id]);

const getAllTasks = () =>
  query(`SELECT * FROM tasks ORDER BY created_at DESC`);

const updateTaskStatus = (task_id, status) =>
  query(
    `UPDATE tasks
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, task_id]
  );

const getAllUsers = () =>
  query(
    `SELECT u.*, r.name AS role_name
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     ORDER BY u.created_at DESC`
  );

const updateUserRole = (user_id, role_id) =>
  query(
    `UPDATE users
     SET role_id = $1
     WHERE id = $2
     RETURNING *`,
    [role_id, user_id]
  );

const updateSlopeRisk = (slope_id, risk_level) =>
  query(
    `UPDATE slopes
     SET risk_level = $1
     WHERE id = $2
     RETURNING *`,
    [risk_level, slope_id]
  );

module.exports = {
  getAllRoles,
  getRoleById,
  createUser,
  getUserByEmail,
  getUserById,
  createGovAuthority,
  getGovAuthorityByUser,
  createSlope,
  getAllSlopes,
  getSlopeById,
  createSensor,
  getSensorsBySlope,
  getAllSensors,
  getSensorById,
  insertSensorReading,
  getSensorHistory,
  createComplaint,
  getComplaintsByUser,
  getAllComplaints,
  updateComplaintStatus,
  createAlert,
  acknowledgeAlert,
  getAlertsBySlope,
  getAlertsByType,
  createAdvisoryMessage,
  addOfflineMessage,
  getOfflineMessages,
  markOfflineDelivered,
  savePrediction,
  createTask,
  getTasksForUser,
  getAllTasks,
  updateTaskStatus,
  getAllUsers,
  updateUserRole,
  updateSlopeRisk
};
