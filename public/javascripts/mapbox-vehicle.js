mapboxgl.accessToken = 'pk.eyJ1IjoiaHV5bmd1eWVuY29uZyIsImEiOiJjazN6N3VrOG0wNWJqM29vOGtsanNzd2pnIn0.5QK7L0ZSRMvtyrE08PZGMA';

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