const router = require('express').Router();
const verifyJWT = require('../middlewares/authMiddleware');
const verifyRoles = require('../middlewares/rolesMiddleware');
const { User } = require('../models/user');
const ROLES_LIST = require('../config/roles_list');

router.get('/', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        return res.sendStatus(500);
    }
})

router.delete('/:email', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
});


router.patch('/:email', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        const { email } = req.params;
        const { role } = req.body;

        const roleValue = ROLES_LIST[role];
        if (!roleValue) {
            return res.sendStatus(400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.sendStatus(404);
        }

        if (user.roles[role]) {
            const roles = user.roles;
            const newRoles = { ...roles };
            delete newRoles[role];
            user.roles = newRoles;
        } else {
            user.roles[role] = roleValue;
        }

        await user.save();

        res.status(200).send({ roles: user.roles });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

module.exports = router;