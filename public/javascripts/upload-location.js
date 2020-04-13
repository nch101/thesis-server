var socket = io('http://localhost:3000/socket/tracking-vehicle', {
	transportOptions: {
		polling: {
			extraHeaders: {
				'client-id': '5e92f0f72500f11c8f990fed',
				'license-plate': '54h1234'
			}
		}
	}
});

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(uploadLocation);
	} else {
		console.log('Geolocation is not supported by this browser.');
	}
}

function uploadLocation(position) {
    var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
    socket.emit('vehicle-location', { 'latitude': latitude, 'longitude': longitude });
}

setInterval(getLocation, 5000);
    