// middleware/auth.js - FIXED VERSION
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                      req.query.token || 
                      req.body.token;
        
        console.log('🔑 Auth middleware - Token:', token ? 'Present' : 'Missing');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log('✅ Auth successful - User ID:', req.userId);
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};