var mongoose = require('mongoose');

var trafficLightSchema = new mongoose.Schema({
    StreetName: {
        type: String,
        required: true
    },
    LightStatus: {
        type: String,
        enum: ['red', 'yellow', 'green'],
        required: true
    },
    ControlStatus: {
        type: String,
        enum: ['automatic', 'manual', 'emergency'],
        default: 'automatic',
        required: true
    },
    TimeRed: {
        type: Number,
        required: true
    },
    TimeYellow: {
        type: Number,
        required: true
    },
    TimeGreen: {
        type: Number,
        required: true
    },
    Camip: String,
    Bearing: {
        type: Number,
        required: true
    }
});

var intersectionSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Coordinates: {
        type: [Number],
        required: true
    },
    Bearing: {
        type: [Number],
        required: true
    },
    TrafficLight: {
        type: trafficLightSchema,
        required: true
    }
});

var intersection = new mongoose.model('Intersection', intersectionSchema);

module.exports = intersection;