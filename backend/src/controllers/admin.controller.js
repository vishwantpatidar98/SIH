const {
  getAllUsers,
  updateUserRole,
  getAllSlopes,
  updateSlopeRisk,
  createSlope,
  createTask,
  getAllTasks,
  updateTaskStatus
} = require('../models/queries');

const listUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res.json({
      success: true,
      data: users.rows
    });
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    const updated = await updateUserRole(userId, roleId);
    if (updated.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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

const listSlopes = async (req, res, next) => {
  try {
    const slopes = await getAllSlopes();
    return res.json({
      success: true,
      data: slopes.rows
    });
  } catch (error) {
    next(error);
  }
};

const createSlopeController = async (req, res, next) => {
  try {
    const { name, description, lat, lng } = req.body;
    const created = await createSlope(name, description, lat, lng);
    return res.status(201).json({
      success: true,
      data: created.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateSlopeRiskController = async (req, res, next) => {
  try {
    const { slopeId } = req.params;
    const { riskLevel } = req.body;

    const updated = await updateSlopeRisk(slopeId, riskLevel);
    if (updated.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Slope not found'
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

const listTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasks();
    return res.json({
      success: true,
      data: tasks.rows
    });
  } catch (error) {
    next(error);
  }
};

const createTaskController = async (req, res, next) => {
  try {
    const { assignedTo, slopeId, title, description } = req.body;
    const assignedBy = req.user?.id || req.body.assignedBy;

    const created = await createTask(assignedBy, assignedTo, slopeId, title, description);
    return res.status(201).json({
      success: true,
      data: created.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatusController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updated = await updateTaskStatus(taskId, status);
    if (updated.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
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

module.exports = {
  listUsers,
  changeUserRole,
  listSlopes,
  createSlope: createSlopeController,
  updateSlopeRisk: updateSlopeRiskController,
  listTasks,
  createTask: createTaskController,
  updateTaskStatus: updateTaskStatusController
};


