const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema'); // ✅ Corrected Import

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Extract token
        const tokenValue = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // ✅ Exclude password

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}


exports.isAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token from header

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify token
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user; // ✅ Attach user to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};




