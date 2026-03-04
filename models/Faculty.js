const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Assistant Professor', 'Lab Instructor'],
    required: true
  },
  department: { type: String, default: 'School of Engineering & Technology' },
  specialization: [String],
  role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);