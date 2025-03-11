const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Token:', token);  // Log token for debugging
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      req.userId = decoded.userId;
      console.log('User ID:', req.userId);  // Check if userId is assigned
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  

module.exports = authMiddleware;
