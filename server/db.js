const mongoose = require('mongoose');

module.exports = () => {
    try {
        mongoose.connect(process.env.DB);
    } catch (err) {
        console.log(err);
    }
}