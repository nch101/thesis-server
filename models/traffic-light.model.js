var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        require: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

var trafficLightSchema = new Schema({
    intersection: {
        type: Schema.Types.ObjectId, 
        ref: 'Intersection'
    },
    streetName: {
        type: String,
        required: true
    },
    location: [{
        type: pointSchema,
        required: true
    }],
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
});

module.exports = mongoose.model('Traffic-light', trafficLightSchema);