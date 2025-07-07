// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Member } = require('../models/gymSchemas');

// Simple Firebase token verification (without Admin SDK)
const verifyFirebaseToken = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized - no token provided' });
  }

  try {
    // For now, we'll use a simple approach - check if token exists and is not empty
    // In a production environment, you should verify the Firebase token properly
    if (!token || token.length < 10) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Try to decode the token as JWT first (fallback)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('JWT token verified for user:', decoded);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        next();
        return;
      }
    } catch (jwtError) {
      console.log('Token is not a JWT, treating as Firebase token');
    }

    // For Firebase tokens, we'll extract user info from the token
    // This is a simplified approach - in production, verify with Firebase Admin SDK
    try {
      // Decode the Firebase token (this is just for getting user info, not verification)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        
        console.log('Firebase token decoded for user:', payload.email);
        
        // Find user in our database by email
        let user = await User.findOne({ email: payload.email });
        
        if (!user) {
          // If user doesn't exist in User collection, check Member collection
          const member = await Member.findOne({ email: payload.email });
          if (member) {
            // Create a user object from member data
            user = {
              _id: member._id,
              email: member.email,
              name: member.name,
              role: member.role || 'member',
              status: member.status || 'active'
            };
          } else {
            // Create a basic user object from Firebase data
            user = {
              _id: payload.user_id || payload.sub,
              email: payload.email,
              name: payload.name || payload.email.split('@')[0],
              role: 'member', // default role
              status: 'active'
            };
          }
        }
        
        req.user = user;
        next();
        return;
      }
    } catch (firebaseError) {
      console.error('Firebase token decoding failed:', firebaseError);
    }

    // If we get here, token verification failed
    res.status(401).json({ message: 'Token verification failed' });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token verification failed' });
  }
};

// Legacy JWT middleware (for backward compatibility)
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded user:', decoded);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Token failed' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Role not allowed' });
    }
    next();
  };
};

module.exports = { 
  protect, 
  authorizeRoles, 
  verifyFirebaseToken
};
