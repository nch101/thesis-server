//Interactive menu
var menu = document.getElementById('menu-container');
var menuIcon = document.getElementById('menu-icon');
var menuBox = document.getElementById('menu-box')

//ID
var idVehicle = cookiesParser('vehicleId');
var idLocation = cookiesParser('locId');
mapboxgl.accessToken = cookiesParser('mapToken');


const controlLightPath = io(window.location.origin + '/socket/control-light');
const trackingVehiclePath = io(window.location.origin + '/socket/tracking-vehicle');
const stateMachine = {
    'approaching': 0,
    'passed': 1
}


menu.addEventListener('click', function() {
    menuIcon.classList.toggle('menu-icon-active');
    menuBox.classList.toggle('menu-box-active');
});

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.658188, 10.770398],
    zoom: 13
});

var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    profile: 'mapbox/driving',
    controls: {
        profileSwitcher: false,
    },
    unit: 'metric',
    placeholderOrigin: 'Điểm đi',
    placeholderDestination: 'Điểm đến',
    language: 'vi',
})
map.addControl(directions, 'top-left');

var RTLocation;
var isPriority = true;
var state = 'passed';
var dist = 1.5;

var idIntersections = []
var idTrafficLights = []
var locIntersections = []

// var idIntersections = ["5eb90fe69f1398273bba559a", "5ec4a21420768c3fcd9b1665", "5ec4a35020768c3fcd9b166f"]
// var idTrafficLights = ["5eb90fe69f1398273bba55a3", "5ec4a21420768c3fcd9b166d", "5ec4a35020768c3fcd9b1677"];
// var locIntersections = [[ 106.658104, 10.770378 ], [ 106.659889, 10.763996 ], [ 106.660973, 10.760356 ] ];

/**
 * Fake realtime location
 */

var locationArray = [[106.656680, 10.775478],
                    [106.656986, 10.774867],
                    [106.657168, 10.774119],
                    [106.657383, 10.773413],
                    [106.657555, 10.772717],
                    [106.657791, 10.772032],
                    [106.657973, 10.771284],
                    [106.658230, 10.770578],
                    [106.658412, 10.769882],
                    [106.658594, 10.769165],
                    [106.658680, 10.768353],
                    [106.658980, 10.767678],
                    [106.659162, 10.766961],
                    [106.659344, 10.766213],
                    [106.659623, 10.765528],
                    [106.659773, 10.764822],
                    [106.659966, 10.764105],
                    [106.660170, 10.763357],
                    [106.660363, 10.762609],
                    [106.660588, 10.761861],
                    [106.660835, 10.761165],
                    [106.660996, 10.760459],
                    [106.661189, 10.759690],
                    [106.661393, 10.759005],
                    [106.661586, 10.758278]]

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
        url: window.location.origin + '/vehicle/journey',
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
}

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
                    mode: 'automatic-flexible-time',
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

/**
 * Cookies parser
 */

function cookiesParser(cookieName) {
    var cookieName = cookieName + "=";
    var cookiesArray = document.cookie.split('; ');
    for (var cookie of cookiesArray) {
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}