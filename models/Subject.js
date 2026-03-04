const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String },
  courseCode: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  credits: { type: Number, required: true },
  type: { type: String, enum: ['Theory', 'Lab', 'Theory+Lab'], default: 'Theory' },
  category: {
    type: String,
    enum: ['Core', 'Elective', 'Open Elective', 'Lab', 'Minor Project', 'Major Project', 'Internship', 'Common']
  },
  hasTheory: { type: Boolean, default: true },
  hasLab: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);