const mongoose = require('mongoose');

const subjectFacultyMapSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  courseCode: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, default: 'A' },
  academicYear: { type: String, required: true }, // e.g. "2025-26"
  type: { type: String, enum: ['Theory', 'Lab'], default: 'Theory' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SubjectFacultyMap', subjectFacultyMapSchema);