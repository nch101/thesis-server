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

		socket.on('leave-room', function(data) {
			socket.leave(data)
		})

		socket.on('[center]-change-light', function(data) {
			controlLightPath.to(roomID).emit('[intersection]-change-light', data)		
		});

		socket.on('[center]-change-mode', function(data) {
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

		socket.on('leave-room', function(data) {
			socket.leave(data)
		});

		socket.on('[intersection]-time-light', function(data) {
			stateLightPath.to(data.room).emit('[center]-time-light', data.data);
		})
		socket.on('[intersection]-light-state', function(data) {
			stateLightPath.to(data.room).emit('[center]-light-state', data.data);
		})
		socket.on('disconnect', function(reason) {
			console.log('Reason of disconnection: ' + reason);
		})
	})
	
}