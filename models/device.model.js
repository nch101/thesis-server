var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var journeySchema = new Schema({
    type: {
        type: String,
        default: 'Feature'
    },
    geometry: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    properties: {
        name: {
            type: String,
            enum: ['Departure', 'Current position', 'Destination'],
            require: true
        }
    }
});

var deviceSchema = new Schema({
    license_plate: {
        type: String,
        uppercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
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
    journey: [{
        type: journeySchema,
    }]
});

deviceSchema.plugin(uniqueValidator, { message: 'Error, {VALUE} already exists' });

module.exports = mongoose.model('Device', deviceSchema);