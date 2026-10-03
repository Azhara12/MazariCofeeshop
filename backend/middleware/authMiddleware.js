import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ADMIN_EMAIL = 'azharmahmoodmazari@gmail.com';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user — if deleted or from a different DB, findById returns null
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.error('[protect] JWT decoded but no matching user found in DB. id:', decoded.id);
        return res.status(401).json({
          message: 'Not authorized: your session is invalid. Please log out and log in again.',
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin Middleware with Developer Auto-Bypass Guarantee
const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.isAdmin || req.user.role === 'admin' || req.user.email === ADMIN_EMAIL)
  ) {
    return next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };