var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var pointSchema = new Schema({
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

var deviceSchema = new Schema({
    license_plate: {
        type: String,
        unique: true,
        required: true
    },
    password: {
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

deviceSchema.plugin(uniqueValidator, { message: 'Error, {VALUE} already exists' });

module.exports = mongoose.model('Device', deviceSchema);