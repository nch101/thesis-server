var vehicleModel = require('../models/vehicle.model');
var userModel = require('../models/user.model');

var log4js = require('log4js');
var log = log4js.getLogger('tracking-vehicle');

// function isValid(clientId, next) {
// 	var isVehicle = vehicleModel.findById(clientId).select('_id');
// 	var isUser = userModel.findById(clientId).select('_id');

// 	Promise.all([isVehicle, isUser])
// 	.then(function(results) {
// 		if (results[0] || results[1]){
// 			return next();
// 		}
// 		else {
// 			return next(new Error('authentication error'));	
// 		}
// 	})
// 	.catch(function(error) {
// 		console.log(error);
// 		return next(new Error('authentication error'));	
// 	})
// }

module.exports = function(io) {
	const trackingVehiclePath = io.of('/socket/tracking-vehicle');
	const controlLightPath = io.of('/socket/control-light');

	// trackingVehiclePath.use(function(socket, next) {
	// 	let clientId = socket.handshake.headers['client-id'];
	// 	isValid(clientId, next);
	// });

	trackingVehiclePath.on('connect', function(socket) {
		var roomID = ''
		
		socket.on('room', function(data) {
			roomID = data;
			socket.join(data);
		});

		socket.on('[vehicle]-realtime-location', function(data) {
			trackingVehiclePath.to(roomID).emit('[center]-tracking-vehicle', data);
			log.debug('Location of vehicle: ', data);			
		});

		socket.on('[vehicle]-set-priority', function(data) {
			controlLightPath.to(data.id).emit('[intersection]-change-mode', data.mode);
			log.debug('Change mode of traffic light: ', data);
		});

		socket.on('disconnect', function() {
			console.log('One client disconnected: ' + socket.id);
		});
	});
}