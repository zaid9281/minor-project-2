const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  courseCode: { type: String, required: true },
  semester: { type: Number, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  creatorName: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
  members: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    name: { type: String },
    joinedAt: { type: Date, default: Date.now }
  }],
  maxMembers: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

studyGroupSchema.index({ subjectCode: 1 });
studyGroupSchema.index({ inviteCode: 1 });
studyGroupSchema.index({ 'members.studentId': 1 });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);