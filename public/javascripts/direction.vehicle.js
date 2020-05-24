var menu = document.getElementById('menu-container');
var menuIcon = document.getElementById('menu-icon');
var menuBox = document.getElementById('menu-box')


menu.addEventListener('click', function() {
    menuIcon.classList.toggle('menu-icon-active');
    menuBox.classList.toggle('menu-box-active');
});

const controlLightPath = io(window.location.origin + '/socket/control-light');
const trackingVehiclePath = io(window.location.origin + '/socket/tracking-vehicle');

var idVehicle = "5ec7347810544b26da694606";
var idLocation = "5ec7e0f52913da1974a3c481";

const stateMachine = {
    'approaching': 0,
    'passed': 1
}

var RTLocation;
var isPriority = true;
var state = 'passed';
var dist = 1.5;

var idIntersections = ["5eb90fe69f1398273bba559a", "5ec4a21420768c3fcd9b1665", "5ec4a35020768c3fcd9b166f"]
var idTrafficLights = ["5eb90fe69f1398273bba55a3", "5ec4a21420768c3fcd9b166d", "5ec4a35020768c3fcd9b1677"];
var locIntersections = [[ 106.658104, 10.770378 ], [ 106.659889, 10.763996 ], [ 106.660973, 10.760356 ] ];

/**
 * Fake realtime location
 */

var locationArray = [[106.654468139664, 10.783468490755808],
                    [106.65570689756106, 10.779379680688479],
                    [106.65619066882232, 10.77705004421442], 
                    [106.6567738552294, 10.775544662709436],
                    [106.6571227257113, 10.774058481530545], 
                    [106.65799127244799, 10.770915860631249],
                    [106.65835270769622, 10.769392066316485],
                    [106.65918808208619, 10.766333652596884], 
                    [106.659768951236, 10.764320224086276], 
                    [106.66038521117173, 10.762196568282349],
                    [106.66102103491181, 10.760015125290167],
                    [106.66098239291574, 10.758314301738267]]

var i = 0;

/** 
 * Repeat again with every 5 seconds 
 */

setInterval(function() {
    // getGeoLocation()
    
    if (locationArray[i] !== undefined && isPriority) {
        axios({
            method: 'put',
            url: window.location.origin + '/vehicle/' + idVehicle + '/location/' + idLocation,
            data: {
                coordinates: locationArray[i]
            }
        })
        if (isPriority) {
            onPriority()
        }
        i++;
    }
}, 5000)


/** 
 * Get the geolocation of vehicle in realtime 
 */

/* function getGeoLocation() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000
    };
    navigator.geolocation.getCurrentPosition(emitLocation, onGeoError, options);
}

function emitLocation(position) {
    RTLocation = [ position.coords.longitude, position.coords.latitude ];

    trackingVehiclePath.emit('[vehicle]-realtime-location', { idVehicle: idVehicle, location: RTLocation, vehicleType: vehicleType })
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
} */

/** 
 * This function will run when the vehicle get a navigation 
 */

/* function extraFunction(steps) {
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
        for (var trafficLight of res.data) {
            idTrafficLights.push(trafficLight._id);
            idIntersections.push(trafficLight.intersectionId)
            locIntersections.push(trafficLight.location.coordinates);
        }
    })
} */

/** 
 * Check whether the vehicle is approaching intersection or not 
 */

function onPriority() {
    console.log('On priority...')
    if (idTrafficLights.length > 0) {
        var idTrafficLight = idTrafficLights[0];
        var idIntersection = idIntersections[0];
        var locIntersection = locIntersections[0];
        var preDist = dist;
        dist = distanceCalculation(locIntersection[0], locIntersection[1],
                                        locationArray[i][0], locationArray[i][1]);
            
        trackingVehiclePath.emit('distance', dist);
    }
    else {
        isPriority = false;
    }

    switch (stateMachine[state]) {
        case stateMachine['passed']:
            if ((0.28 >= dist) && (preDist > dist)) {
                state = 'approaching';
                controlLightPath.emit('room', idIntersection)
                controlLightPath.emit('[vehicle]-set-priority', { 
                    id: idTrafficLight,
                    mode: 'emergency',
                    priority: true
                });
            }
            break;
        case stateMachine['approaching']:
            if ((0.08 < dist) && (preDist < dist)) {
                state = 'passed';
                controlLightPath.emit('[vehicle]-set-priority', {
                    id: idTrafficLight,
                    mode: 'automatic',
                    priority: false
                });
                controlLightPath.emit('leave-room', idIntersection);
                idTrafficLights.shift();
                idIntersections.shift();
                locIntersections.shift();
            }
            break;
        default:
            break;
    }
}

/** 
 * Calculate the distance between vehicle and intersection equipped smart traffic light system 
 */

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