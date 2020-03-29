var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    _id: String,
    email: String,
    username: {
        type: String,
        unique: true,
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

userSchema.plugin(uniqueValidator, { message: 'Error, {VALUE} already exists' });

module.exports = mongoose.model('User', userSchema);