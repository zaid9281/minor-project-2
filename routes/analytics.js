const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { facultyOnly } = require('../middleware/roleCheck');
const DownloadLog = require('../models/DownloadLog');
const StudyMaterial = require('../models/StudyMaterial');
const PYQ = require('../models/PYQ');
const Rating = require('../models/Rating');
const SubjectFacultyMap = require('../models/SubjectFacultyMap');
const Subject = require('../models/Subject');
const ForumPost = require('../models/ForumPost');

// ─────────────────────────────────────────────
// GET /analytics/faculty — Faculty analytics page
// ─────────────────────────────────────────────
router.get('/faculty', protect, facultyOnly, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const facultyIdObject = isAdmin ? null : new mongoose.Types.ObjectId(req.user.id);
    const facultyFilter = isAdmin ? {} : { facultyId: facultyIdObject };

    const mapFilter = isAdmin
      ? { isActive: true }
      : { facultyId: facultyIdObject, isActive: true };

    const maps = await SubjectFacultyMap.find(mapFilter).lean();
    const subjectCodes = [...new Set(maps.map(m => m.subjectCode))];

    const [totalMaterials, totalPYQs] = await Promise.all([
      StudyMaterial.countDocuments(facultyFilter),
      PYQ.countDocuments(facultyFilter)
    ]);

    const downloadsBySubject = await DownloadLog.aggregate([
      {
        $match: isAdmin ? {} : { facultyId: facultyIdObject }
      },
      {
        $group: {
          _id: '$subjectCode',
          totalDownloads: { $sum: 1 },
          materialDownloads: {
            $sum: { $cond: [{ $eq: ['$itemType', 'material'] }, 1, 0] }
          },
          pyqDownloads: {
            $sum: { $cond: [{ $eq: ['$itemType', 'pyq'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalDownloads: -1 } }
    ]);

    const totalDownloads = downloadsBySubject.reduce((sum, item) => sum + item.totalDownloads, 0);

    const topMaterials = await DownloadLog.aggregate([
      {
        $match: {
          itemType: 'material',
          ...(isAdmin ? {} : { facultyId: facultyIdObject })
        }
      },
      { $group: { _id: '$itemId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topMaterialsWithDetails = await Promise.all(
      topMaterials.map(async (item) => {
        const mat = await StudyMaterial.findById(item._id).select('title subjectCode unit').lean();
        return {
          title: mat ? mat.title : 'Unknown',
          subjectCode: mat ? mat.subjectCode : '—',
          unit: mat ? mat.unit : '—',
          downloads: item.count
        };
      })
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyDownloads = await DownloadLog.aggregate([
      {
        $match: {
          downloadedAt: { $gte: sevenDaysAgo },
          ...(isAdmin ? {} : { facultyId: facultyIdObject })
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$downloadedAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().split('T')[0];
      const found = dailyDownloads.find(entry => entry._id === key);
      last7Days.push({
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count: found ? found.count : 0
      });
    }

    const ratingsPerSubject = await Rating.aggregate([
      {
        $match: {
          subjectCode: { $in: subjectCodes }
        }
      },
      {
        $group: {
          _id: '$subjectCode',
          avgStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { avgStars: -1 } }
    ]);

    const subjectsWithMaterials = await StudyMaterial.distinct(
      'subjectCode',
      isAdmin ? {} : { facultyId: facultyIdObject }
    );

    const subjectsWithoutMaterials = subjectCodes.filter(code => !subjectsWithMaterials.includes(code));

    const forumActivity = await ForumPost.aggregate([
      { $match: { subjectCode: { $in: subjectCodes } } },
      {
        $group: {
          _id: '$subjectCode',
          totalPosts: { $sum: 1 },
          unresolvedPosts: {
            $sum: { $cond: [{ $eq: ['$isResolved', false] }, 1, 0] }
          }
        }
      },
      { $sort: { unresolvedPosts: -1 } }
    ]);

    const unitCoverage = await StudyMaterial.aggregate([
      {
        $match: isAdmin ? {} : { facultyId: facultyIdObject }
      },
      {
        $group: {
          _id: { subjectCode: '$subjectCode', unit: '$unit' },
          count: { $sum: 1 }
        }
      }
    ]);

    const subjectNameDocs = await Subject.find({
      subjectCode: { $in: subjectCodes }
    }).select('subjectCode name').lean();

    const subjectNameMap = {};
    subjectNameDocs.forEach(subject => {
      subjectNameMap[subject.subjectCode] = subject.name;
    });

    const uploadsByDate = {};
    const materialUploads = await StudyMaterial.aggregate([
      {
        $match: isAdmin ? {} : { facultyId: facultyIdObject }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$uploadedAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    const pyqUploads = await PYQ.aggregate([
      {
        $match: isAdmin ? {} : { facultyId: facultyIdObject }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$uploadedAt' }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    [...materialUploads, ...pyqUploads].forEach(entry => {
      uploadsByDate[entry._id] = (uploadsByDate[entry._id] || 0) + entry.count;
    });

    const uploadTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().split('T')[0];
      uploadTimeline.push({
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count: uploadsByDate[key] || 0
      });
    }

    res.render('faculty/analytics', {
      user: req.user,
      stats: {
        totalMaterials,
        totalPYQs,
        totalDownloads,
        totalSubjects: subjectCodes.length
      },
      downloadsBySubject,
      topMaterials: topMaterialsWithDetails,
      last7Days,
      uploadTimeline,
      ratingsPerSubject,
      subjectsWithoutMaterials,
      forumActivity,
      unitCoverage,
      subjectNameMap
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.render('error', {
      message: 'Failed to load analytics.',
      user: req.user
    });
  }
});

module.exports = router;
