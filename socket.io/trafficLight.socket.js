var intersectionModel = require('../models/intersection.model');

module.exports = function(io) {
	const stateLightPath = io.of('/socket/state-light');
	const controlLightPath = io.of('/socket/control-light');
	
	controlLightPath.on('connect', function(socket) {
		socket.on('[center]-change-light', function(data) {
			controlLightPath.emit('[intersection]-change-light', data)			
		});
		socket.on('[center]-change-mode', function(data) {
			controlLightPath.emit('[intersection]-change-mode', data)
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	});

	stateLightPath.on('connect', function(socket) {
		socket.on('[intersection]-time-light', function(timeLight) {
			stateLightPath.emit('[center]-time-light', timeLight);
			console.log(timeLight);
		})
		socket.on('[intersection]-light-state', function(lightState) {
			stateLightPath.emit('[center]-light-state', lightState);
			console.log(lightState);
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	})
	
}