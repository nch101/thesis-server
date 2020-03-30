var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var intersectionSchema = new Schema({
    name: {
        type: String,
        required: true,
        uniqueCaseInsensitive: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    bearing: {
        type: [Number],
        required: true
    },
    modeControl: {
        type: String,
        enum: ['automatic', 'manual', 'emergency'],
        default: 'automatic',
        required: true
    },
    trafficLights: [{
        type: Schema.Types.ObjectId, 
        ref: 'Traffic-light', 
        require: true
    }]
});

module.exports = mongoose.model('Intersection', intersectionSchema);