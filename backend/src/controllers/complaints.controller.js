const fs = require('fs');
const path = require('path');
const multer = require('multer');

const {
  createComplaint,
  getComplaintsByUser,
  getAllComplaints,
  updateComplaintStatus
} = require('../models/queries');

const uploadsDir = path.join(__dirname, '../../uploads/complaints');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const uploadEvidence = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // TODO: Replace local path with S3/MinIO URL when storage service is ready.
    const relativePath = path.relative(path.join(__dirname, '../..'), req.file.path);
    return res.json({
      success: true,
      data: {
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/${relativePath.replace(/\\/g, '/')}`
      }
    });
  }
];

const createComplaintController = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { slopeId, description, mediaUrl } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User id required'
      });
    }

    const created = await createComplaint(userId, slopeId, description, mediaUrl || null);
    return res.status(201).json({
      success: true,
      data: created.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const listComplaints = async (req, res, next) => {
  try {
    let complaints;
    if (req.user && ['site_admin', 'super_admin', 'gov_authority'].includes(req.user.role_name)) {
      complaints = await getAllComplaints();
    } else {
      complaints = await getComplaintsByUser(req.user.id);
    }

    return res.json({
      success: true,
      data: complaints.rows
    });
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatusController = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const updated = await updateComplaintStatus(complaintId, status);
    if (updated.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
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
  uploadEvidence,
  createComplaint: createComplaintController,
  listComplaints,
  updateComplaintStatus: updateComplaintStatusController
};


