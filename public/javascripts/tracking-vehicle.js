var socket = io('http://localhost:3000/socket/tracking-vehicle');

function trackingVehicle() {
    socket.on('tracking-vehicle', function(data) {
        console.log(data);
    })
}

trackingVehicle()