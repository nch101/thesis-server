module.exports = function(io) {
	const trafficLightPath = io.of('/data-collect');
	trafficLightPath.on('connect', function (socket) {
		socket.emit('change-light', 'change');
		socket.on('change-light', function (data) {
			console.log(data);
		});
		trafficLightPath.emit('hi', 'Success!');
	});
}