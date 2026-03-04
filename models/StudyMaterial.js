const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  courseCode: { type: String, required: true },
  semester: { type: Number, required: true },
  unit: { type: Number, required: true, min: 1, max: 6 },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  fileSize: { type: Number },
  fileType: { type: String, default: 'application/pdf' },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);