var deviceModel = require('../models/device.model');
var userModel = require('../models/user.model');

function isValid(clientId, next) {
	var isVehicle = deviceModel.findById(clientId).select('_id');
	var isUser = userModel.findById(clientId).select('_id');

	Promise.all([isVehicle, isUser])
	.then(function(results) {
		if (results[0] || results[1]){
			return next();
		}
		else {
			return next(new Error('authentication error'));	
		}
	})
	.catch(function(error) {
		console.log(error);
		return next(new Error('authentication error'));	
	})
}

module.exports = function(io) {
	const trackingDevicePath = io.of('/socket/tracking-vehicle');

	trackingDevicePath.use(function(socket, next) {
		let clientId = socket.handshake.headers['client-id'];
		isValid(clientId, next);
	});

	trackingDevicePath.on('connect', function(socket) {
		console.log('Tracking vehicle connection is established!');
		console.log(socket.handshake.headers['license-plate']);
		socket.on('vehicle-location', function(data) {
			console.log(data);
			trackingDevicePath.emit('tracking-vehicle', data);
		});
		socket.on('disconnect', function() {
			console.log('One client disconnected' + socket.id)
		})
	});
}