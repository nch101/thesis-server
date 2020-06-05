var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenSchema = new Schema({
    refreshToken: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Token', tokenSchema);