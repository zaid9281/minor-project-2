const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  action: {
    type: String,
    enum: [
      'page_view',
      'material_view',
      'pyq_view',
      'syllabus_view',
      'forum_view',
      'search',
      'announcement_view'
    ],
    required: true
  },
  page: { type: String, required: true },
  subjectCode: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  loggedAt: { type: Date, default: Date.now }
}, { timestamps: false });

usageLogSchema.index({ loggedAt: -1 });
usageLogSchema.index({ userId: 1, loggedAt: -1 });
usageLogSchema.index({ action: 1, loggedAt: -1 });

module.exports = mongoose.model('UsageLog', usageLogSchema);