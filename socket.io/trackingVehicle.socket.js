// var vehicleModel = require('../models/vehicle.model');
// var userModel = require('../models/user.model');

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
		
		socket.on('dist', function(data) {
			console.log('dist: ', data)
		})

		socket.on('room', function(data) {
			roomID = data;
			socket.join(data);
		});

		socket.on('[vehicle]-realtime-location', function(data) {
			trackingVehiclePath.to(roomID).emit('[center]-tracking-vehicle', data);
			console.log("Vehicle's location: ", data);
		});

		socket.on('[vehicle]-set-priority', function(data) {
			controlLightPath.to(data.id).emit('[intersection]-change-mode', data.mode);
		});

		socket.on('disconnect', function() {
			console.log('One client disconnected: ' + socket.id);
		});
	});
}