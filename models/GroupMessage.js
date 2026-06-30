const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyGroup',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  linkUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

groupMessageSchema.index({ groupId: 1, createdAt: 1 });

module.exports = mongoose.model('GroupMessage', groupMessageSchema);