var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trafficLightSchema = new Schema({
    intersection: {
        type: Schema.Types.ObjectId, 
        ref: 'Intersection'
    },
    streetName: {
        type: String,
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

module.exports = mongoose.model('Traffic-light', trafficLightSchema);