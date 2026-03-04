const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  courseCode: { type: String, required: true },   // e.g. "0173"
  courseName: { type: String, required: true },
  enrollmentYear: { type: Number, required: true },
  batch: { type: String, required: true },         // e.g. "2023-2027"
  section: { type: String, default: 'A' },
  gender: { type: String, enum: ['Male', 'Female'] },
  role: { type: String, default: 'student' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);