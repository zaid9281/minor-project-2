const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  courseCode: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  semesterType: { type: String, enum: ['odd', 'even'], required: true },
  examType: { type: String, enum: ['MidTerm', 'EndTerm'], default: 'EndTerm' },
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PYQ', pyqSchema);