const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.sendStatus(400);
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.sendStatus(409);
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hash = await bcrypt.hash(req.body.password, salt);
        user = await User({ ...req.body, password: hash }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();
        const url = `${process.env.BASE_URL}/register/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, 'Verify Email', url);
        
        res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
})

router.get('/:id/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: 'Invalid link' });
        }

        if (user.verified) {
            return res.status(200).send({ message: 'Email verified successfully' });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) {
            return res.status(400).send({ message: 'Invalid link' });
        }
        user.verified = true;
        await user.save();
        await Token.deleteOne({ _id: token._id });

        res.status(200).send({ message: 'Email verified successfully' });

    } catch (error) {
        return res.status(500).send({ message: 'Internal error' });
    }
});

module.exports = router;