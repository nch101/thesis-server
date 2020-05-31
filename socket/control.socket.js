var log4js = require('log4js');
var logger = log4js.getLogger('socket.control');
var intersectionModel = require('../models/intersection.model');
var trafficLightModel = require('../models/traffic-light.model');

module.exports = function(io) {
	const controlLightPath = io.of('/socket/control-light');

    controlLightPath.on('connect', function(socket) {
		var roomID = ''
		socket.on('room', function(data) {
			roomID = data;
            socket.join(data);
            logger.info('Socket ID %s joins room %s', socket.id, roomID);
		});

		socket.on('leave-room', function(data) {
            socket.leave(data);
            logger.info('Socket ID %s leaves room %s', socket.id, roomID);
		});

		socket.on('[center]-change-light', function(data) {
            controlLightPath.to(roomID).emit('[intersection]-change-light', data);
            logger.info('Change light state');
		});

		socket.on('[center]-change-mode', function(data) {
            controlLightPath.to(roomID).emit('[intersection]-change-mode', data.mode);
            intersectionModel
            .findByIdAndUpdate(roomID, { $set: { modeControl: data.mode }})
			.then(function(result) {
				logger.info('Change mode control: ', data.mode);
			})
			.catch(function(error) {
				logger.error('Change mode control error: ', error);
			});
		});

		socket.on('[vehicle]-set-priority', function(data) {
			controlLightPath.to(roomID).emit('[intersection]-change-mode', data.mode);
			logger.debug('[vehicle] ', data);
			intersectionModel
			.findByIdAndUpdate(roomID, { $set: { modeControl: data.mode }})
			.then(function(result) {
				logger.info('Change mode control: ', data.mode);
			})
			.catch(function(error) {
				logger.error('Change mode control error: ', error);
			});

			trafficLightModel
			.findByIdAndUpdate(data.id, { $set: { priority: data.priority }})
			.then(function(result) {
				logger.info('Set priority: ', data.priority);
			})
			.catch(function(error) {
				logger.error('Set priority error: ', error);
			})
		});
	});
}