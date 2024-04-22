const jwt = require('jsonwebtoken');
const { verifyToken } = require('../config/jwt');

const auth = (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = bearerToken.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
};

module.exports = auth;