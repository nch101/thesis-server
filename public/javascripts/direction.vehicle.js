var menu = document.getElementById('menu-container');
var menuIcon = document.getElementById('menu-icon');
var menuBox = document.getElementById('menu-box')


menu.addEventListener('click', function() {
    menuIcon.classList.toggle('menu-icon-active');
    menuBox.classList.toggle('menu-box-active');
});

const trackingVehiclePath = io(window.location.origin + '/socket/tracking-vehicle');
const controlLightPath = io(window.location.origin + '/socket/control-light');

var idVehicle = "5ec7347810544b26da694606";
var idLocation = "5ec7e0f52913da1974a3c481";

var RTLocation;
var isPriority = false;
var idIntersections = [];
var locIntersections = [];

/**
 * Fake realtime location
 */

var locationArray = [[106.65619066882232, 10.77705004421442], 
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
    
    if (locationArray[i] !== undefined) {
        axios({
            method: 'put',
            url: window.location.origin + '/vehicle/' + idVehicle + '/location/' + idLocation,
            data: {
                coordinates: locationArray[i++]
            }
        })
    }

    if (isPriority) {
        onPriority()
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