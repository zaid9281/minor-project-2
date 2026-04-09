const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  loginAt: { type: Date, default: Date.now },
  ipAddress: { type: String, default: 'unknown' },
  userAgent: { type: String, default: 'unknown' }
}, { timestamps: false });

loginLogSchema.index({ userId: 1, loginAt: -1 });
loginLogSchema.index({ loginAt: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
