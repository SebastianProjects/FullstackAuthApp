const { User } = require('../models/user');

const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(401);
        }
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        if (!req?.email) {
            return res.sendStatus(401);
        }
        const user = await User.findOne({ email: req?.email })
        const roles = Object.values(user.roles);
        const result2 = roles.map(role => rolesArray.includes(role)).find(val => val === true);

        if (!result2) {
            return res.sendStatus(401)
        };
        next();
    }
}

module.exports = verifyRoles;