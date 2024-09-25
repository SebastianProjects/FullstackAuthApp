const router = require('express').Router();
const { User } = require('../models/user');
const Joi = require('joi')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_EXPIRES_IN = require('../config/jwt_expires_in')
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.sendStatus(400);
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.sendStatus(401);
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.sendStatus(401);
        }

        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save();
                const url = `${process.env.BASE_URL}/register/${user._id}/verify/${token.token}`;
                await sendEmail(user.email, 'Verify Email', url);
            }
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

        const refreshToken = jwt.sign(
            {
                userInfo: {
                    email: user.email,
                    roles: roles
                }
            },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN.REFRESH }
        );

        console.log(refreshToken)

        user.refreshToken = refreshToken;
        const result = await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: JWT_EXPIRES_IN.REFRESH * 1000 },).json({ email: user.email, token: accessToken, roles: roles });

    } catch (error) {
        return res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/logout', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(204);
    }

    user.refreshToken = '';
    const result = await user.save();

    res.clearCookie('jwt', { httpOnly: true }).sendStatus(204);
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/).required()
    })

    return schema.validate(data)
};

module.exports = router;