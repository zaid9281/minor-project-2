const mongoose = require('mongoose');

const downloadLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  itemType: {
    type: String,
    enum: ['material', 'pyq', 'syllabus'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subjectCode: { type: String, required: true },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  downloadedAt: { type: Date, default: Date.now }
}, { timestamps: false });

downloadLogSchema.index({ facultyId: 1, downloadedAt: -1 });
downloadLogSchema.index({ itemId: 1 });
downloadLogSchema.index({ subjectCode: 1 });

module.exports = mongoose.model('DownloadLog', downloadLogSchema);
