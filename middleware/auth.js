const jwt = require('jsonwebtoken');

// Verifies JWT from cookie and attaches user to req
const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Prevent browser from caching protected pages
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return res.redirect('/auth/landing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Tell browser NEVER cache authenticated pages
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    next();
  } catch (err) {
    res.clearCookie('token');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    return res.redirect('/auth/landing');
  }
};

// Redirect already-logged-in users away from login pages
const redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'student') return res.redirect('/student/dashboard');
    if (decoded.role === 'faculty' || decoded.role === 'admin') return res.redirect('/faculty/dashboard');
  } catch {
    res.clearCookie('token');
  }
  next();
};

/**
 * @desc    Grant access to specific roles
 * @param   {...string} roles - Allowed roles (e.g., 'admin', 'faculty')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was set in the 'protect' middleware above
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).render('error/403', { 
                message: 'You do not have permission to access this resource' 
            });
        }
        next();
    };
};

// Update the Exports
module.exports = { 
    protect, 
    redirectIfLoggedIn, 
    authorize 
};