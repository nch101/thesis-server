var mongoose = require('mongoose');

var pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Departure', 'Current position', 'Destination'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

var deviceSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    license_plate: {
        type: String,
        required: true
    },
    avatarURL: String,
    phone: String,
    address: String,
    company: String,
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
        required: true
    },
    blocked: {
        type: Boolean,
        default: false,
        required: true
    },
    journey: {
        type: pointSchema,
        required: true
    }
});

var device = mongoose.model('Device', deviceSchema);

module.exports = device;