var intersectionModel = require('../models/intersection.model');

module.exports = function(io) {
	const stateLight = io.of('/socket/state-light');
	const controlLightPath = io.of('/socket/control-light');
	
	controlLightPath.on('connect', function(socket) {
		socket.on('[center]-change-light', function(data) {
			socket.emit('[intersection]-change-light', data)			
		});
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	});

	stateLight.on('connect', function(socket) {
		socket.on('[intersection]-time-light', function(timeLight) {
			socket.emit('[center]-time-light', timeLight);
		})
		socket.on('[intersection]-light-state', function(lightState) {
			socket.emit('[center]-light-state', lightState);
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	})
}