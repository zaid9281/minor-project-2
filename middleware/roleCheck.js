// Only allow students
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') return next();
  return res.status(403).render('error', {
    message: 'Access denied. Students only.',
    user: req.user || null
  });
};

// Only allow faculty or admin
const facultyOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'faculty' || req.user.role === 'admin')) return next();
  return res.status(403).render('error', {
    message: 'Access denied. Faculty only.',
    user: req.user || null
  });
};

// Only allow admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).render('error', {
    message: 'Access denied. Admins only.',
    user: req.user || null
  });
};

// A more flexible way to check roles dynamically
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).render('error', {
                message: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}`,
                user: req.user || null
            });
        }
        next();
    };
};

// Update the exports to include the new checkRole function
module.exports = { 
    studentOnly, 
    facultyOnly, 
    adminOnly, 
    checkRole // Add this!
};