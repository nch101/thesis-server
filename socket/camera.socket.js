var log4js = require('log4js');
var logger = log4js.getLogger('socket.camera');

module.exports = function(io) {
    const cameraPath = io.of('/socket/camera');

    cameraPath.on('connect', function(socket) {
        var roomID = ''
		socket.on('room', function(data) {
			roomID = data;
            socket.join(data)
            logger.info('Socket ID %s joins room %s', socket.id, roomID);
		});

		socket.on('leave-room', function(data) {
            socket.leave(data)
            logger.info('Socket ID %s leaves room %s', socket.id, roomID);
        });
        
		socket.on('[intersection]-camera', function(data) {
			cameraPath.to(data.room).emit('[center]-camera', data.data);
		});
	});
}