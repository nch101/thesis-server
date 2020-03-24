module.exports = function(io) {
  const trafficLightPath = io.of('/traffic-light');
  trafficLightPath.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  trafficLightPath.emit('hi', 'Success!');
});
}