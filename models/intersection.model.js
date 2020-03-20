var mongoose = require('mongoose');

var trafficLightSchema = new mongoose.Schema({
    streetName: {
        type: String,
        required: true
    },
    lightStatus: {
        type: String,
        enum: ['red', 'yellow', 'green'],
        required: true
    },
    controlStatus: {
        type: String,
        enum: ['automatic', 'manual', 'emergency'],
        default: 'automatic',
        required: true
    },
    timeRed: {
        type: Number,
        required: true
    },
    timeYellow: {
        type: Number,
        required: true
    },
    timeGreen: {
        type: Number,
        required: true
    },
    camip: String,
    bearing: {
        type: Number,
        required: true
    }
});

var intersectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    bearing: {
        type: [Number],
        required: true
    },
    trafficLight: {
        type: trafficLightSchema,
        required: true
    }
});

var intersection = new mongoose.model('Intersection', intersectionSchema);

module.exports = intersection;