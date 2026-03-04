const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  department: { type: String, default: 'School of Engineering & Technology' },
  duration: { type: Number, default: 4 }, // years
  totalSemesters: { type: Number, default: 8 },
  degree: { type: String, default: 'B.Tech' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);