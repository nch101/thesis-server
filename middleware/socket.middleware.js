var io = require('socket.io')();
var intersectionModel = require('../models/intersection.model');

var isValid = function(clientId) {
    
}
var socketMiddleware = function() {
    io.use(function(socket, next) {
        let clientId = socket.handshake.headers['x-clientid'];
        if (isValid(clientId)) {
            return next();
        }
        return next(new Error('authentication error'));
    })
}