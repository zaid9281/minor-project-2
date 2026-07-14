const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { facultyOnly } = require('../middleware/roleCheck');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const StudyMaterial = require('../models/StudyMaterial');
const PYQ = require('../models/PYQ');
const Subject = require('../models/Subject');
const SubjectFacultyMap = require('../models/SubjectFacultyMap');
const { notifyStudentsForSubject } = require('../utils/notificationHelper');

// ── Multer for bulk upload ──
const bulkStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPYQ = req.body.uploadType === 'pyq';
    const name = file.originalname
      .replace('.pdf','').replace(/\s+/g,'_').substring(0, 50);
    return {
      folder: isPYQ ? 'soet-portal/pyqs' : 'soet-portal/materials',
      resource_type: 'raw',
      format: 'pdf',
      access_mode: 'public',
      public_id: `${isPYQ ? 'PYQ' : 'MAT'}_${name}_${Date.now()}`
    };
  }
});

const bulkUpload = multer({
  storage: bulkStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`${file.originalname} is not a PDF`), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024, files: 20 }
});

// ─────────────────────────────────────────────
// GET /bulk/upload — Show bulk upload page
// ─────────────────────────────────────────────
router.get('/upload', protect, facultyOnly, async (req, res) => {
  try {
    let subjectOptions = [];
    if (req.user.role === 'admin') {
      const maps = await SubjectFacultyMap.find({ isActive: true }).lean();
      const codes = [...new Set(maps.map(m => m.subjectCode))];
      subjectOptions = await Subject.find({ subjectCode: { $in: codes } })
        .sort({ semester: 1, subjectCode: 1 }).lean();
    } else {
      const maps = await SubjectFacultyMap.find({
        facultyId: req.user.id, isActive: true
      }).lean();
      const codes = [...new Set(maps.map(m => m.subjectCode))];
      subjectOptions = await Subject.find({ subjectCode: { $in: codes } })
        .sort({ semester: 1, subjectCode: 1 }).lean();
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    res.render('faculty/bulk-upload', {
      subjectOptions,
      years,
      user: req.user,
      faculty: await require('../models/Faculty').findById(req.user.id).lean()
    });
  } catch (err) {
    res.render('error', { message: 'Failed to load bulk upload.', user: req.user });
  }
});

// ─────────────────────────────────────────────
// POST /bulk/upload/single — Upload ONE file
// Called per file via fetch (not full form submit)
// ─────────────────────────────────────────────
router.post('/upload/single', protect, facultyOnly,
  (req, res, next) => {
    bulkUpload.single('file')(req, res, (err) => {
      if (err) {
        return res.json({ success: false, error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const {
      uploadType, subjectCode,
      unit, title,
      year, semesterType, examType
    } = req.body;

    if (!req.file) {
      return res.json({ success: false, error: 'No file received.' });
    }

    try {
      // Auth check
      if (req.user.role !== 'admin') {
        const allowed = await SubjectFacultyMap.findOne({
          subjectCode, facultyId: req.user.id, isActive: true
        });
        if (!allowed) {
          return res.json({
            success: false,
            error: 'Not authorized for this subject.'
          });
        }
      }

      const subject = await Subject.findOne({ subjectCode }).lean();
      if (!subject) {
        return res.json({ success: false, error: 'Subject not found.' });
      }

      if (uploadType === 'material') {
        if (!unit || !title) {
          return res.json({
            success: false,
            error: 'Unit and title required for materials.'
          });
        }

        await StudyMaterial.create({
          subjectCode,
          facultyId: req.user.id,
          courseCode: subject.courseCode,
          semester: subject.semester,
          unit: parseInt(unit),
          title: title.trim(),
          description: '',
          fileUrl: req.file.path,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: 'application/pdf',
          uploadedAt: new Date()
        });

        notifyStudentsForSubject({
          subjectCode,
          subjectName: subject.name,
          courseCode: subject.courseCode,
          semester: subject.semester,
          type: 'new_material',
          title: `New Material: ${title.trim()}`,
          message: `${req.user.name} uploaded "${title.trim()}" for ${subject.name} — Unit ${unit}`
        });

      } else if (uploadType === 'pyq') {
        if (!year || !semesterType || !examType) {
          return res.json({
            success: false,
            error: 'Year, semester type and exam type required for PYQs.'
          });
        }

        const existing = await PYQ.findOne({
          subjectCode,
          year: parseInt(year),
          semesterType,
          examType
        });
        if (existing) {
          return res.json({
            success: false,
            error: `PYQ already exists: ${subjectCode} ${examType} ${year} (${semesterType})`
          });
        }

        await PYQ.create({
          subjectCode,
          facultyId: req.user.id,
          courseCode: subject.courseCode,
          semester: subject.semester,
          year: parseInt(year),
          semesterType,
          examType,
          fileUrl: req.file.path,
          fileName: req.file.originalname,
          uploadedAt: new Date()
        });

        notifyStudentsForSubject({
          subjectCode,
          subjectName: subject.name,
          courseCode: subject.courseCode,
          semester: subject.semester,
          type: 'new_pyq',
          title: `New PYQ: ${subject.name} — ${examType} ${year}`,
          message: `${req.user.name} uploaded a ${examType} paper for ${subject.name} (${year})`
        });
      }

      return res.json({ success: true });

    } catch (err) {
      console.error('Bulk single upload error:', err);
      return res.json({ success: false, error: 'Server error. Try again.' });
    }
  }
);

module.exports = router;