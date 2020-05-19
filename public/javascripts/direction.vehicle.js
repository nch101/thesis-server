var menu = document.getElementById('menu-container');
var menuIcon = document.getElementById('menu-icon');
var menuBox = document.getElementById('menu-box')

menu.addEventListener('click', function() {
    menuIcon.classList.toggle('menu-icon-active');
    menuBox.classList.toggle('menu-box-active');
});

const trackingVehiclePath = io(window.location.origin + '/socket/tracking-vehicle');
const controlLightPath = io(window.location.origin + '/socket/control-light');

var idVehicle = "5ec239e9ea7819180537472e"

var RTLocation;
var isPriority = false;
var idIntersections = [];
var locIntersections = [];

/** Repeat again with every 5 seconds **/

setInterval(function() {
    getGeoLocation()

    trackingVehiclePath.emit('test', 'Socket is running')
    if (isPriority) {
        onPriority()
    }
}, 5000)


/** Get the geolocation of vehicle in realtime **/

function getGeoLocation() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000
    };
    navigator.geolocation.getCurrentPosition(emitLocation, onGeoError, options);
}

function emitLocation(position) {
    RTLocation = [ position.coords.longitude, position.coords.latitude ];
    trackingVehiclePath.emit('room', idVehicle)
    trackingVehiclePath.emit('[vehicle]-realtime-location', RTLocation)
}

function onGeoError(error) {
    if (error.code === error.PERMISSION_DENIED) {
        detailError = "User denied the request for Geolocation.";
    }
    else if (error.code === error.POSITION_UNAVAILABLE) {
        detailError = "Location information is unavailable.";
    }
    else if (error.code === error.TIMEOUT) {
        detailError = "The request to get user location timed out."
    }
    else if (error.code === error.UNKNOWN_ERROR) {
        detailError = "An unknown error occurred."
    }
}


/** This function will run when the vehicle get a navigation **/

function extraFunction(steps) {
    var data = [];
    console.log(steps)
    for (var step of steps) {
        for (var intersection of step.intersections) {
            if (intersection.in) {
                data.push({
                    location: intersection.location,
                    bearing: intersection.bearings[intersection.in]
                });
            }
        }
    }

    axios({
        method: 'put',
        url: window.location.origin + '/api/vehicle/journey',
        data: data,
    })
    .then(function(res) {
        isPriority = true;
        for (var intersection of res.data) {
            idIntersections.push(intersection._id);
            locIntersections.push(intersection.location.coordinates)
        }
    })
}

/** Check whether the vehicle is approaching intersection or not **/

function onPriority() {
    console.log('On priority...')
    var isApproach = false;
    var idIntersection = idIntersections[0]
    var locIntersection = locIntersections[0]
    var dist = distanceCalculation(locIntersection[0], locIntersection[1],
                                    RTLocation[0], RTLocation[1]);
    
    console.log(dist);
    trackingVehiclePath.emit('distance', dist);
    if (0.5 >= dist) {
        isApproach = true;
        controlLightPath.emit('[vehicle]-set-priority', { id: idIntersection, mode: 'emergency' });
    }
    else if ((0.2 < dist) && isApproach) {
        isApproach = false;
        controlLightPath.emit('[vehicle]-set-priority', { id: idIntersection, mode: 'automatic' });
        idIntersections.shift();
        locIntersections.shift();
    }
    else;
}

/** Calculate the distance between vehicle and intersection equipped smart traffic light system **/

function distanceCalculation(lon1, lat1, lon2, lat2) {
    var dLat = deg2rad((lat2 - lat1)/2);
    var dLon = deg2rad((lon2 - lon1)/2);
    var a = Math.sin(dLat) * Math.sin(dLat) + 
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon) * Math.sin(dLon)
    
    return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}