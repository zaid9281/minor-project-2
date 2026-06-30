const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { studentOnly } = require('../middleware/roleCheck');
const StudyGroup = require('../models/StudyGroup');
const GroupMessage = require('../models/GroupMessage');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const { getCurrentSemester } = require('../utils/semesterHelper');
const crypto = require('crypto');

const generateInviteCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    exists = await StudyGroup.findOne({ inviteCode: code });
  }

  return code;
};

router.get('/', protect, studentOnly, async (req, res) => {
  try {
    const myGroups = await StudyGroup.find({
      'members.studentId': req.user.id,
      isActive: true
    }).sort({ createdAt: -1 }).lean();

    res.render('student/groups', {
      myGroups,
      user: req.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Groups list error:', err);
    res.render('error', { message: 'Failed to load study groups.', user: req.user });
  }
});

router.get('/subject/:subjectCode', protect, studentOnly, async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const student = await Student.findById(req.user.id).lean();
    const currentSemester = getCurrentSemester(student.enrollmentYear);

    const subject = await Subject.findOne({
      subjectCode,
      $or: [
        { courseCode: student.courseCode, semester: currentSemester },
        { courseCode: 'COMMON', semester: currentSemester }
      ],
      isActive: true
    }).lean();

    if (!subject) {
      return res.render('error', { message: 'Subject not found.', user: req.user });
    }

    const groups = await StudyGroup.find({
      subjectCode,
      isActive: true
    }).sort({ createdAt: -1 }).lean();

    const groupsWithMeta = groups.map((group) => ({
      ...group,
      isMember: group.members.some((member) => member.studentId.toString() === req.user.id),
      isFull: group.members.length >= group.maxMembers
    }));

    res.render('student/groups-subject', {
      subject,
      groups: groupsWithMeta,
      currentSemester,
      user: req.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Subject groups error:', err);
    res.render('error', { message: 'Failed to load groups.', user: req.user });
  }
});

router.post('/subject/:subjectCode/create', protect, studentOnly, async (req, res) => {
  const { subjectCode } = req.params;
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.redirect(`/groups/subject/${subjectCode}?error=Group name is required.`);
  }

  try {
    const student = await Student.findById(req.user.id).lean();
    const currentSemester = getCurrentSemester(student.enrollmentYear);

    const subject = await Subject.findOne({
      subjectCode,
      $or: [
        { courseCode: student.courseCode, semester: currentSemester },
        { courseCode: 'COMMON', semester: currentSemester }
      ],
      isActive: true
    }).lean();

    if (!subject) {
      return res.redirect(`/groups/subject/${subjectCode}?error=Subject not found.`);
    }

    const inviteCode = await generateInviteCode();

    const group = await StudyGroup.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      subjectCode,
      subjectName: subject.name,
      courseCode: subject.courseCode,
      semester: subject.semester,
      creatorId: req.user.id,
      creatorName: req.user.name,
      inviteCode,
      members: [{
        studentId: req.user.id,
        name: req.user.name,
        joinedAt: new Date()
      }],
      createdAt: new Date()
    });

    return res.redirect(`/groups/${group._id}?success=Study group created! Share invite code: ${inviteCode}`);
  } catch (err) {
    console.error('Create group error:', err);
    return res.redirect(`/groups/subject/${subjectCode}?error=Failed to create group.`);
  }
});

router.get('/:id', protect, studentOnly, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id).lean();
    if (!group) {
      return res.render('error', { message: 'Group not found.', user: req.user });
    }

    const isMember = group.members.some((member) => member.studentId.toString() === req.user.id);
    if (!isMember) {
      return res.render('error', { message: 'You are not a member of this group.', user: req.user });
    }

    const messages = await GroupMessage.find({ groupId: group._id })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.render('student/group-detail', {
      group,
      messages,
      isCreator: group.creatorId.toString() === req.user.id,
      user: req.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Group detail error:', err);
    res.render('error', { message: 'Failed to load group.', user: req.user });
  }
});

router.post('/join', protect, studentOnly, async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    return res.redirect('/groups?error=Please enter an invite code.');
  }

  try {
    const group = await StudyGroup.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
      isActive: true
    });

    if (!group) {
      return res.redirect('/groups?error=Invalid invite code.');
    }

    const alreadyMember = group.members.some((member) => member.studentId.toString() === req.user.id);
    if (alreadyMember) {
      return res.redirect(`/groups/${group._id}?success=You are already a member.`);
    }

    if (group.members.length >= group.maxMembers) {
      return res.redirect('/groups?error=This group is full (max 10 members).');
    }

    group.members.push({
      studentId: req.user.id,
      name: req.user.name,
      joinedAt: new Date()
    });
    await group.save();

    return res.redirect(`/groups/${group._id}?success=Joined "${group.name}" successfully!`);
  } catch (err) {
    console.error('Join group error:', err);
    return res.redirect('/groups?error=Failed to join group.');
  }
});

router.post('/:id/message', protect, studentOnly, async (req, res) => {
  const { content, linkUrl } = req.body;

  if (!content || !content.trim()) {
    return res.redirect(`/groups/${req.params.id}?error=Message cannot be empty.`);
  }

  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.redirect('/groups?error=Group not found.');
    }

    const isMember = group.members.some((member) => member.studentId.toString() === req.user.id);
    if (!isMember) {
      return res.redirect('/groups?error=Not a member of this group.');
    }

    await GroupMessage.create({
      groupId: group._id,
      senderId: req.user.id,
      senderName: req.user.name,
      content: content.trim(),
      linkUrl: linkUrl ? linkUrl.trim() : null,
      createdAt: new Date()
    });

    return res.redirect(`/groups/${req.params.id}`);
  } catch (err) {
    console.error('Post message error:', err);
    return res.redirect(`/groups/${req.params.id}?error=Failed to send message.`);
  }
});

router.post('/:id/leave', protect, studentOnly, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) {
      return res.redirect('/groups?error=Group not found.');
    }

    if (group.creatorId.toString() === req.user.id) {
      return res.redirect(`/groups/${req.params.id}?error=Creator cannot leave. Delete the group instead.`);
    }

    group.members = group.members.filter((member) => member.studentId.toString() !== req.user.id);
    await group.save();

    return res.redirect('/groups?success=You left the group.');
  } catch (err) {
    return res.redirect('/groups?error=Failed to leave group.');
  }
});

router.post('/:id/remove-member', protect, studentOnly, async (req, res) => {
  const { memberId } = req.body;

  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.json({ success: false });

    if (group.creatorId.toString() !== req.user.id) {
      return res.json({ success: false, message: 'Only creator can remove members.' });
    }

    group.members = group.members.filter((member) => member.studentId.toString() !== memberId);
    await group.save();

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false });
  }
});

router.post('/:id/delete', protect, studentOnly, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.redirect('/groups?error=Group not found.');

    if (group.creatorId.toString() !== req.user.id) {
      return res.redirect('/groups?error=Only the creator can delete this group.');
    }

    await GroupMessage.deleteMany({ groupId: group._id });
    await StudyGroup.findByIdAndDelete(group._id);

    return res.redirect('/groups?success=Group deleted.');
  } catch (err) {
    return res.redirect('/groups?error=Failed to delete group.');
  }
});

module.exports = router;