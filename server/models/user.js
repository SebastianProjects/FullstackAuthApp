const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    roles: {
        User: { type: Number, default: 2001 },
        Editor: Number,
        Admin: Number
    },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    refreshToken: String
});

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(24).regex(/^[a-zA-Z][a-zA-Z]{3,24}$/).required(),
        lastName: Joi.string().min(3).max(24).regex(/^[a-zA-Z][a-zA-Z]{3,24}$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/).required()
    })

    return schema.validate(data)
};

const User = mongoose.model('user', userSchema);

module.exports = { User, validate };