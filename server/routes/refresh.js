const router = require('express').Router();
const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const JWT_EXPIRES_IN = require('../config/jwt_expires_in')

router.get('/', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        return res.status(403);
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_JWT_SECRET,
        (err, decoded) => {
            if (err || user.email !== decoded.userInfo.email) {
                return res.sendStatus(403);
            }
            const roles = Object.values(user.roles);
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        email: user.email,
                        roles: roles
                    }
                },
                process.env.JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN.ACCESS }
            );
            res.json({ accessToken });
        }
    );
})

module.exports = router;