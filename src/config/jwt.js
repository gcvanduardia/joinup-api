const jwt = require('jsonwebtoken');

const verifyToken = (bearerToken) => {
    if (!bearerToken) {
        return false;
    }

    // Split the Bearer token to get the actual token
    const token = bearerToken.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
};

const generateToken = (IdUsuario) => {
    const token = jwt.sign({ IdUsuario: IdUsuario }, process.env.JWT_SECRET, { expiresIn: '5d' });
    return token;
};

module.exports = { generateToken, verifyToken };