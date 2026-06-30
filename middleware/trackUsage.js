const jwt = require('jsonwebtoken');
const UsageLog = require('../models/UsageLog');

const getPageName = (path) => {
  if (path === '/student/dashboard') return 'Student Dashboard';
  if (path.includes('/materials')) return 'Study Materials';
  if (path.includes('/pyqs')) return 'PYQs';
  if (path.includes('/syllabus')) return 'Syllabus';
  if (path.startsWith('/forum')) return 'Discussion Forum';
  if (path.startsWith('/bookmarks')) return 'Bookmarks';
  if (path.startsWith('/notifications')) return 'Notifications';
  if (path.startsWith('/announcements')) return 'Announcements';
  if (path === '/faculty/dashboard') return 'Faculty Dashboard';
  if (path.includes('/upload/material')) return 'Upload Material';
  if (path.includes('/upload/pyq')) return 'Upload PYQ';
  if (path.includes('/upload/syllabus')) return 'Upload Syllabus';
  if (path.includes('/bulk/upload')) return 'Bulk Upload';
  if (path.includes('/analytics')) return 'Analytics';
  if (path.startsWith('/admin')) return 'Admin Panel';
  return path;
};

const getAction = (path) => {
  if (path.includes('/materials')) return 'material_view';
  if (path.includes('/pyqs')) return 'pyq_view';
  if (path.includes('/syllabus') && !path.includes('/upload')) return 'syllabus_view';
  if (path.startsWith('/forum')) return 'forum_view';
  if (path.startsWith('/announcements')) return 'announcement_view';
  return 'page_view';
};

const trackUsage = (req, res, next) => {
  if (req.method !== 'GET') return next();

  const token = req.cookies && req.cookies.token;
  if (!token) return next();

  const skip = [
    '/auth/',
    '/notifications/unread-count',
    '/notifications/dropdown',
    '/bookmarks/ids',
    '/ratings/',
    '/announcements/latest-banner',
    '/student/track-download',
    '/favicon.ico'
  ];
  if (skip.some((s) => req.path.includes(s))) return next();

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next();
  }

  UsageLog.create({
    userId: decoded.id,
    userRole: decoded.role,
    action: getAction(req.path),
    page: getPageName(req.path),
    subjectCode: req.params && req.params.subjectCode ? req.params.subjectCode : null,
    loggedAt: new Date()
  }).catch(() => {});

  next();
};

module.exports = trackUsage;