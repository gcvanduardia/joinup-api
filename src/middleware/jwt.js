const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
};

const generateToken = (username) => {
    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '5d' });
    return token;
};

module.exports = { generateToken, verifyToken };