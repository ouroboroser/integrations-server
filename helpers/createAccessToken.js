const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
    const payload = {
        id: user.dataValues.id,
        email: user.dataValues.email,
    };
    
    return jwt.sign(
        payload, 
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIME
        }
    );
};

module.exports = {
    createAccessToken
};