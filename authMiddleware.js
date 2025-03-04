const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Store user info in request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
