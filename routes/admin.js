const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const StudyMaterial = require('../models/StudyMaterial');
const PYQ = require('../models/PYQ');
const LoginLog = require('../models/LoginLog');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

// GET /admin - Admin panel home (redirect)
router.get('/', protect, adminOnly, (req, res) => {
  res.redirect('/admin/students');
});

// GET /admin/students - View all students
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const {
      search,
      course,
      batch,
      status,
      page = 1
    } = req.query;

    const limit = 20;
    const skip = (parseInt(page, 10) - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (course) filter.courseCode = course;
    if (batch) filter.enrollmentYear = parseInt(batch, 10);
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const [students, total, courses] = await Promise.all([
      Student.find(filter)
        .sort({ enrollmentYear: -1, rollNo: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(filter),
      Course.find({}).sort({ shortName: 1 }).lean()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.render('admin/students', {
      students,
      courses,
      total,
      totalPages,
      currentPage: parseInt(page, 10),
      filters: { search, course, batch, status },
      user: req.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Admin students error:', err);
    res.render('error', {
      message: 'Failed to load students.',
      user: req.user
    });
  }
});

// POST /admin/students/:id/toggle - Activate/deactivate
router.post('/students/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.redirect('/admin/students?error=Student not found.');
    }

    student.isActive = !student.isActive;
    await student.save();

    return res.redirect(
      `/admin/students?success=Student ${student.name} ${student.isActive ? 'activated' : 'deactivated'} successfully.`
    );
  } catch (err) {
    return res.redirect('/admin/students?error=Failed to update student.');
  }
});

// GET /admin/faculty - View all faculty
router.get('/faculty', protect, adminOnly, async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const faculty = await Faculty.find(filter)
      .sort({ designation: 1, name: 1 })
      .lean();

    const facultyWithStats = await Promise.all(
      faculty.map(async (f) => {
        const [materials, pyqs, lastLogin] = await Promise.all([
          StudyMaterial.countDocuments({ facultyId: f._id }),
          PYQ.countDocuments({ facultyId: f._id }),
          LoginLog.findOne({ userId: f._id })
            .sort({ loginAt: -1 })
            .lean()
        ]);

        return {
          ...f,
          totalMaterials: materials,
          totalPYQs: pyqs,
          lastLogin: lastLogin ? lastLogin.loginAt : null
        };
      })
    );

    res.render('admin/faculty', {
      faculty: facultyWithStats,
      filters: { search, status },
      user: req.user,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Admin faculty error:', err);
    res.render('error', {
      message: 'Failed to load faculty.',
      user: req.user
    });
  }
});

// POST /admin/faculty/:id/toggle - Activate/deactivate
router.post('/faculty/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.redirect('/admin/faculty?error=Faculty not found.');
    }

    if (faculty._id.toString() === req.user.id) {
      return res.redirect('/admin/faculty?error=Cannot deactivate your own account.');
    }

    faculty.isActive = !faculty.isActive;
    await faculty.save();

    return res.redirect(
      `/admin/faculty?success=${faculty.name} ${faculty.isActive ? 'activated' : 'deactivated'}.`
    );
  } catch (err) {
    return res.redirect('/admin/faculty?error=Failed to update.');
  }
});

// POST /admin/faculty/:id/reset-password
router.post('/faculty/:id/reset-password', protect, adminOnly, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.redirect('/admin/faculty?error=Faculty not found.');
    }

    const defaultPassword = 'Faculty@123';
    faculty.password = await bcrypt.hash(defaultPassword, 10);
    await faculty.save();

    return res.redirect(
      `/admin/faculty?success=Password for ${faculty.name} reset to Faculty@123`
    );
  } catch (err) {
    return res.redirect('/admin/faculty?error=Failed to reset password.');
  }
});

// GET /admin/faculty/new - Add faculty form
router.get('/faculty/new', protect, adminOnly, (req, res) => {
  res.render('admin/faculty-new', {
    user: req.user,
    error: req.query.error || null
  });
});

// POST /admin/faculty/new - Create faculty
router.post('/faculty/new', protect, adminOnly, async (req, res) => {
  const {
    name,
    email,
    employeeId,
    designation,
    specialization,
    role
  } = req.body;

  if (!name || !email || !employeeId || !designation) {
    return res.redirect(
      '/admin/faculty/new?error=Name, email, employee ID and designation are required.'
    );
  }

  try {
    const existing = await Faculty.findOne({
      $or: [{ email: email.toLowerCase() }, { employeeId }]
    });

    if (existing) {
      return res.redirect(
        '/admin/faculty/new?error=A faculty with this email or employee ID already exists.'
      );
    }

    const hashedPassword = await bcrypt.hash('Faculty@123', 10);

    await Faculty.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      employeeId: employeeId.trim(),
      designation,
      department: 'School of Engineering & Technology',
      specialization: specialization
        ? specialization.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      role: role || 'faculty',
      password: hashedPassword,
      isActive: true
    });

    return res.redirect(
      `/admin/faculty?success=Faculty ${name} added successfully. Default password: Faculty@123`
    );
  } catch (err) {
    console.error('Add faculty error:', err);
    return res.redirect(
      '/admin/faculty/new?error=Failed to add faculty. Try again.'
    );
  }
});

// GET /admin/logs - Login audit logs
router.get('/logs', protect, adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1 } = req.query;
    const limit = 30;
    const skip = (parseInt(page, 10) - 1) * limit;

    const filter = {};
    if (role) filter.userRole = role;
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const [logs, total] = await Promise.all([
      LoginLog.find(filter)
        .sort({ loginAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LoginLog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogins = await LoginLog.countDocuments({
      loginAt: { $gte: today }
    });
    const totalLogins = await LoginLog.countDocuments({});

    res.render('admin/logs', {
      logs,
      total,
      totalPages,
      currentPage: parseInt(page, 10),
      todayLogins,
      totalLogins,
      filters: { role, search },
      user: req.user
    });
  } catch (err) {
    console.error('Admin logs error:', err);
    res.render('error', {
      message: 'Failed to load logs.',
      user: req.user
    });
  }
});

// GET /admin/overview - Admin overview stats
router.get('/overview', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      activeStudents,
      totalFaculty,
      activeFaculty,
      totalMaterials,
      totalPYQs,
      totalNotifications,
      todayLogins,
      recentLogs
    ] = await Promise.all([
      Student.countDocuments({}),
      Student.countDocuments({ isActive: true }),
      Faculty.countDocuments({}),
      Faculty.countDocuments({ isActive: true }),
      StudyMaterial.countDocuments({}),
      PYQ.countDocuments({}),
      Notification.countDocuments({}),
      LoginLog.countDocuments({ loginAt: { $gte: today } }),
      LoginLog.find({})
        .sort({ loginAt: -1 })
        .limit(10)
        .lean()
    ]);

    const courseStats = await Student.aggregate([
      { $group: { _id: '$courseCode', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topUploaders = await StudyMaterial.aggregate([
      { $group: { _id: '$facultyId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topUploadersWithNames = await Promise.all(
      topUploaders.map(async (u) => {
        const fac = await Faculty.findById(u._id).select('name').lean();
        return { name: fac ? fac.name : 'Unknown', count: u.count };
      })
    );

    res.render('admin/overview', {
      stats: {
        totalStudents,
        activeStudents,
        totalFaculty,
        activeFaculty,
        totalMaterials,
        totalPYQs,
        totalNotifications,
        todayLogins
      },
      courseStats,
      topUploaders: topUploadersWithNames,
      recentLogs,
      user: req.user
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    res.render('error', {
      message: 'Failed to load overview.',
      user: req.user
    });
  }
});

module.exports = router;
