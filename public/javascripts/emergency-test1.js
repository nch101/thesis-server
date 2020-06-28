var idIntersections = ["5ef5bd4d888fb71cd778a13c", "5ef5b6d4ef644c10a434686d", "5ef5b861ef644c10a4346877"];
var locIntersections = [[ 106.658104, 10.770378 ], [ 106.659889, 10.763996 ], [ 106.660973, 10.760356 ] ];
var indexOfStreets = [3, 3, 3];

var idVehicle = cookiesParser('vehicleId');
var idLocation = cookiesParser('locId');

const controlLightPath = io(window.location.origin + '/socket/control-light');
const trackingVehiclePath = io(window.location.origin + '/socket/tracking-vehicle');
const stateMachine = {
    'approaching': 0,
    'passed': 1
}

var RTLocation;
var isPriority = true;
var state = 'passed';
var dist = 1.5;

var idIntersections = []
var idTrafficLights = []
var locIntersections = []

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

setInterval(function() {
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
 * Check whether the vehicle is approaching intersection or not 
 */

function onPriority() {
    if (indexOfStreets.length > 0) {
        var indexOfStreet = indexOfStreets[0];
        var idIntersection = idIntersections[0];
        var locIntersection = locIntersections[0];
        var preDist = dist;
        dist = distanceCalculation(locIntersection[0], locIntersection[1],
                                        locationArray[i][0], locationArray[i][1]);

        trackingVehiclePath.emit('room', idIntersection);
        trackingVehiclePath.emit('distance', dist);
        trackingVehiclePath.emit('index', indexOfStreet);
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