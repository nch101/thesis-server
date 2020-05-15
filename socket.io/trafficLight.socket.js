var intersectionModel = require('../models/intersection.model');

module.exports = function(io) {
	const stateLightPath = io.of('/socket/state-light');
	const controlLightPath = io.of('/socket/control-light');

	controlLightPath.on('connect', function(socket) {
		var roomID = ''

		socket.on('room', function(data) {
			roomID = data;
			socket.join(data)
		});

		socket.on('[center]-change-light', function(data) {
			console.log('Server received: ' + data)
			console.log('RoomID center ' + roomID)
			controlLightPath.to(roomID).emit('[intersection]-change-light', data)			
		});

		socket.on('[center]-change-mode', function(data) {
			console.log('Server received: ' + data)
			controlLightPath.to(roomID).emit('[intersection]-change-mode', data)
		});

		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	});

	stateLightPath.on('connect', function(socket) {
		var roomID = ''

		socket.on('room', function(data) {
			roomID = data;
			socket.join(data)
		});

		socket.on('[intersection]-time-light', function(timeLight) {
			console.log('RoomID ' + roomID)
			stateLightPath.to(roomID).emit('[center]-time-light', timeLight);
		})
		socket.on('[intersection]-light-state', function(lightState) {
			stateLightPath.to(roomID).emit('[center]-light-state', lightState);
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	})
	
}