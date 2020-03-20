var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    email: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: String,
    avatarURL: String,
    phone: String,
    address: String,
    admin: {
        type: Boolean,
        default: false,
        required: true,
    },
    blocked: {
        type: Boolean,
        default: false,
        required: true,
    }
});

var user = mongoose.model('User', userSchema);

module.exports = user;