var features = [];
var popupArray = [];
var url = window.location.origin + '/api/vehicle/location';

mapboxgl.accessToken = 'pk.eyJ1IjoiaHV5bmd1eWVuY29uZyIsImEiOiJjazN6N3VrOG0wNWJqM29vOGtsanNzd2pnIn0.5QK7L0ZSRMvtyrE08PZGMA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.66008, 10.763512],
    zoom: 13
});

map.on('load', async function() {
    var res = await axios.get(url);
    
    processLocationData(res.data);

    map.addSource('vehicles', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    map.addLayer({
        'id': 'vehicle',
        'type': 'symbol',
        'source': 'vehicles',
        'layout': {
            'icon-image': 'car-15',
            'icon-size': 1.2
        },
    });

    window.setInterval(async function() {
        var res = await axios.get(url);

        for (var popup of popupArray) {
            popup.remove();
        }
        popupArray = [];
        processLocationData(res.data);
        
        map.getSource('vehicles').setData({
            'type': 'FeatureCollection',
            'features': features
        });

        features.forEach(function(feature) {
            var vehicleNumber = feature.properties.license_plate;

            var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false })
            .setLngLat(feature.geometry.coordinates)
            .setText(vehicleNumber)
            .addTo(map);

            popupArray.push(popup);

            map.on('click', 'vehicle', function(e) {
                map.flyTo({
                    center: e.features[0].geometry.coordinates,
                    speed: 0.8
                })
            })
        })
    }, 5000)
})

function processLocationData(vehicles) {
    features = [];
    for (var vehicle of vehicles) {
        for (var feature of vehicle.journey) {
            if (feature.properties.name === 'Current-position') {
                feature.properties.license_plate = vehicle.license_plate;
                delete feature._id;
                features.push(feature);
            }
        }
    }
}