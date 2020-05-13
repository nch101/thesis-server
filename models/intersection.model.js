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

var intersectionSchema = new Schema({
    intersectionName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    location: {
        type: pointSchema,
        required: true
    },
    modeControl: {
        type: String,
        enum: ['automatic', 'manual', 'emergency'],
        default: 'automatic',
        required: true
    },
    delta: {
        type: Number,
        required: true
    },
    trafficLights: [{
        type: Schema.Types.ObjectId, 
        ref: 'Traffic-light', 
        require: true
    }]
});

module.exports = mongoose.model('Intersection', intersectionSchema);