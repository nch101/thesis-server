var lineTool = document.getElementById('line-tool');
var locationConfig = document.getElementById('location-config');
var deleteTool = document.getElementById('delete-tool');

var infoStreet = document.getElementById('infoStreet');

mapboxgl.accessToken = 'pk.eyJ1IjoiaHV5bmd1eWVuY29uZyIsImEiOiJjazN6N3VrOG0wNWJqM29vOGtsanNzd2pnIn0.5QK7L0ZSRMvtyrE08PZGMA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.66008, 10.763512],
    zoom: 10
});

var inStreet = [];

var geojson = {
    'type': 'FeatureCollection',
    'features': []
};
     
var linestring = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }   
};

map.on('load' , function() {
    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });

    map.addLayer({
        id: 'point-draw',
        type: 'circle',
        source: 'geojson',
        paint: {
            'circle-radius': 5,
            'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
    });

    map.addLayer({
        id: 'line-draw',
        type: 'line',
        source: 'geojson',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#000',
            'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
    });

    lineTool.addEventListener('click', function() {
        map.getCanvas().style.cursor = 'crosshair'
        map.on('click', onAdd);
    });
});

function onAdd(e) {
    var point = {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]
        },
        'properties': {
            'id': String(new Date().getTime())
        }
    };
    geojson.features.push(point);
    if (geojson.features.length > 1) {
        linestring.geometry.coordinates = geojson.features.map(function(point) {
            return point.geometry.coordinates;
        });
        geojson.features.push(linestring);
    }
    map.getSource('geojson').setData(geojson);
    
    if (geojson.features.length > 2) {
        findStreetLocation();
        map.off('click', onAdd);
        map.getCanvas().style.cursor = '';
        lineTool.disabled = true;
    }
}

function findStreetLocation() {
    var directionsLocation = linestring.geometry.coordinates[0].join() + ';' 
                            + linestring.geometry.coordinates[1].join();
    var directionURL = 'https://api.mapbox.com/directions/v5/mapbox/driving/'
                        + directionsLocation
                        + '?steps=true'
                        + '&access_token=' + mapboxgl.accessToken;
    axios({
        method: 'get',
        url: directionURL,
    })
    .then(showLocation)
}

function showLocation(res) {
    var intersectionData = res.data.routes[0].legs[0].steps[0].intersections
    intersectionData.forEach(function(marker) {
        var el = document.createElement('div');
        el.className = 'street-location';

        var streetMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.location)
        .addTo(map);

        locationConfig.addEventListener('click', function() {
            el.addEventListener('click', function(marker) {
                var pointStreet = {
                    'type': 'Point',
                    'coordinates': [marker.location]
                };
                inStreet.push(pointStreet);
                console.log(inStreet);
            });
        });
        deleteTool.addEventListener('click', function() {
            streetMarker.remove();
            inStreet = [];
            geojson.features = [];
            map.getSource('geojson').setData(geojson);
            lineTool.disabled = false;
        })
    });
}

// function createInfoStreet() {
//     infoStreet.innerHTML
// }