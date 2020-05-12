var intersectionModel = require('../models/intersection.model');

module.exports = function(io) {
	const timeLight = io.of('/socket/time-light');
	const controlLightPath = io.of('/socket/control-light');
	
	controlLightPath.on('connect', function(socket) {
		socket.on('[center]-change-light', function(data) {
			socket.broadcast.emit('[intersection]-change-light', data)			
		});
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	});

	timeLight.on('connect', function(socket) {
		socket.on('[intersection]-time-red', function(timeRed) {
			socket.broadcast.emit('[center]-time-red', timeRed);
		})
		socket.on('[intersection]-time-yellow', function(timeRed) {
			socket.broadcast.emit('[center]-time-yellow', timeRed);
		})
		socket.on('[intersection]-time-green', function(timeRed) {
			socket.broadcast.emit('[center]-time-green', timeRed);
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	})
}