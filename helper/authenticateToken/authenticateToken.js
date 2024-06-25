const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({success: false, message: "token has been expired"});
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;