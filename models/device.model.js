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
    Username: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    License_plate: {
        type: String,
        required: true
    },
    AvatarURL: String,
    Phone: String,
    Address: String,
    Company: String,
    Status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
        required: true
    },
    Banned: {
        type: Boolean,
        default: false,
        required: true
    },
    Journey: {
        type: pointSchema,
        required: true
    }
});

var device = mongoose.model('Device', deviceSchema);

module.exports = device;