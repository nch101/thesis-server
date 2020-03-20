var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: String,
    Email: String,
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Fullname: String,
    AvatarURL: String,
    Phone: String,
    Address: String,
    Admin: {
        type: Boolean,
        default: false,
        required: true,
    },
    Banned: {
        type: Boolean,
        default: false,
        required: true,
    }
});

var user = mongoose.model('User', userSchema);

module.exports = user;