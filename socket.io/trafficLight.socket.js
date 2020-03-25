module.exports = function(io) {
  const trafficLightPath = io.of('/data-collect');
  trafficLightPath.on('connect', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('news', function (data) {
      console.log(data);
    });
  trafficLightPath.emit('hi', 'Success!');
});
}