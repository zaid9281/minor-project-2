const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const pdfFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' && ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed.'), false);
  }
};

const materialStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'soet-portal/materials',
    resource_type: 'raw',
    format: 'pdf',
    access_mode: 'public',
    public_id: (req, file) => {
      const name = file.originalname
        .replace('.pdf', '').replace(/\s+/g, '_').substring(0, 50);
      return `MAT_${name}_${Date.now()}`;
    }
  }
});

const pyqStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'soet-portal/pyqs',
    resource_type: 'raw',
    format: 'pdf',
    access_mode: 'public',
    public_id: (req, file) => {
      const name = file.originalname
        .replace('.pdf', '').replace(/\s+/g, '_').substring(0, 50);
      return `PYQ_${name}_${Date.now()}`;
    }
  }
});

const syllabusStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'soet-portal/syllabus',
    resource_type: 'raw',
    format: 'pdf',
    access_mode: 'public',
    public_id: (req, file) => {
      const subjectCode = req.body.subjectCode || 'SYL';
      return `SYL_${subjectCode}_${Date.now()}`;
    }
  }
});

const uploadMaterial = multer({
  storage: materialStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadPYQ = multer({
  storage: pyqStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const uploadSyllabus = multer({
  storage: syllabusStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = { uploadMaterial, uploadPYQ, uploadSyllabus };