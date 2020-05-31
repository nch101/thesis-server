var renderInteract = document.getElementById('render-interact');
var renderControl = document.getElementById('render-control');
var renderAlert = document.getElementById('render-alert');

var intersectionNameHTML = document.getElementById('intersection-name');
var delta = document.getElementById('delta');
var stateControl = document.getElementById('state-control');
var isManual = document.getElementById('isManual');

var topStreet = document.getElementById('top-street');
var rightStreet = document.getElementById('right-street');
var bottomStreet = document.getElementById('bottom-street');
var leftStreet = document.getElementById('left-street');

var topStreetTime = document.getElementById('top-street-time');
var rightStreetTime = document.getElementById('right-street-time');
var bottomStreetTime = document.getElementById('bottom-street-time');
var leftStreetTime = document.getElementById('left-street-time');

var topStreetLight = document.getElementById('top-street-light');
var rightStreetLight = document.getElementById('right-street-light');
var bottomStreetLight = document.getElementById('bottom-street-light');
var leftStreetLight = document.getElementById('left-street-light');

var btnChange = document.getElementById('btn-change');
var btnUpdate = document.getElementById('btn-update');

const stateLightSocket = io(window.location.host + '/socket/state-light');
const controlLightSocket = io(window.location.host + '/socket/control-light');

var idIntersection;

/* mapboxgl.accessToken = 'pk.eyJ1IjoiaHV5bmd1eWVuY29uZyIsImEiOiJjazN6N3VrOG0wNWJqM29vOGtsanNzd2pnIn0.5QK7L0ZSRMvtyrE08PZGMA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.66008, 10.763512],
    zoom: 12
});

axios.get(window.location.origin + '/api/intersection')
    .then(renderIntersection)

function renderIntersection(res) {
    var intersectionsData = res.data;
    for (var intersectionData of intersectionsData) {
        var popupContent = '';
        var popupInfos = {
            'Tên giao lộ': intersectionData.intersectionName,
            'Trạng thái điều khiển': intersectionData.modeControl
        }

        for (var popupInfo in popupInfos) {
            popupContent += '<strong>' + popupInfo + '</strong>' 
                            + '<p style="text-transform: capitalize;">' + popupInfos[popupInfo] + '</p>'
        };

        var popup = new mapboxgl.Popup({ closeOnClick: false })
                                .setLngLat(intersectionData.location.coordinates)
                                .setHTML(popupContent)
                                .addTo(map);

        var el = document.createElement('div');
        el.className = 'intersection';
        el.addEventListener('click', getInfoIntersection);
        el.params = intersectionData._id;
        new mapboxgl.Marker(el)
        .setLngLat(intersectionData.location.coordinates)
        .setPopup(popup)
        .addTo(map);
    }
} */

getInfoIntersection();

function getInfoIntersection() {
    // @params: event -------^
    // stateLightSocket.emit('leave-room', idIntersection)
    // controlLightSocket.emit('leave-room', idIntersection)
    // idIntersection = event.currentTarget.params;
    idIntersection = '5eb90fe69f1398273bba559a';
    getStateLight()
    axios({
        method: 'get',
        url: window.location.origin + '/api/intersection/' + idIntersection
    })
    .then(renderInfoIntersection)
}

function renderInfoIntersection(res) {
    var intersectionName = res.data.intersectionName;
    var modeControl = res.data.modeControl;
    var deltaTime = res.data.delta;
    var streetInfo = res.data.trafficLights;
    var streetArray = [rightStreet, bottomStreet, leftStreet, topStreet];

    renderInteract.style.display = 'flex';

    for (var index in streetInfo) {
        streetArray[index].innerHTML = streetInfo[index].streetName;
    }

    intersectionNameHTML.innerHTML = intersectionName;
    stateControl.innerHTML = modeControl;
    delta.value = deltaTime;

    if (modeControl === 'automatic') {
        isManual.checked = false;
        automaticControl(streetInfo);
    }
    else if (modeControl === 'manual') {
        isManual.checked = true;
        manualControl();
    }
    else if (modeControl === 'emergency') {
        isManual.disabled = true;
    }
    else;

}

function updateStateControl() {
    if (isManual.checked) {
        controlLightSocket.emit('[center]-change-mode', { mode: 'manual' });
        manualControl()
    }
    else {
        controlLightSocket.emit('[center]-change-mode', { mode: 'automatic' });
        axios({
            method: 'get',
            url: window.location.origin + '/api/intersection/' + idIntersection
        })
        .then(function(res) {
            trafficLights = res.data.trafficLights;
            automaticControl(trafficLights);
        })
    }
}

function manualControl() {
    var manualControlHTML = '<div class="control-item">' +
                                '<label for="btn-change">Thay đổi trạng thái</label>' +
                                '<button id="btn-change" class="btn-change">' +
                                    '<i class="fas fa-sync-alt"></i>Thay đổi' +
                                '</button>' +
                            '</div>'

    renderControl.innerHTML = '';
    renderControl.innerHTML = manualControlHTML;

    var btnChange = document.getElementById('btn-change');
    stateControl.classList.remove('automatic-control');
    stateControl.classList.add('manual-control');
    stateControl.innerText = '';
    stateControl.innerText = 'manual';

    btnChange.addEventListener('click', changeLight);
}

function automaticControl(streetInfo) {
    var btnUpdateHTML = '<button id="btn-update" class="btn-change btn-update">' +
                            '<i class="fas fa-sync-alt"></i>Cập nhật dữ liệu' +
                        '</button>';
    var trafficLightHTML = '';

    for (var trafficLight of streetInfo) {
        trafficLightHTML += '<div class="config-item">' +
                                '<div class="config-title">' +
                                    '<span>Đường</span>' +
                                    '<span> ' + trafficLight.streetName + '</span>' +
                                '</div>' +
                                '<div class="input-container">' +
                                    '<div class="input-box i-box">' +
                                       ' <span class="icon" style="color: #FF1B1C;">' +
                                            '<i class="fas fa-clock"></i>' +
                                        '</span>' +
                                        '<input type="number" name="timeReds" value="' + trafficLight.timeRed + '" required>' +
                                    '</div>' +
                                    '<div class="input-box i-box">' +
                                        '<span class="icon" style="color: #e8aa14;">' +
                                            '<i class="fas fa-clock"></i>' +
                                        '</span>' +
                                        '<input type="number" name="timeYellows" value="' + trafficLight.timeYellow + '" required>' +
                                    '</div>' + 
                                    '<div class="input-box i-box">' +
                                        '<span class="icon" style="color: #00c88b;">' +
                                            '<i class="fas fa-clock"></i>' +
                                        '</span>' +
                                        '<input type="number" name="timeGreens" value="' + trafficLight.timeGreen + '" required>' + 
                                    '</div>' +
                                '</div>' +
                            '</div>';
    }

    renderControl.innerHTML = '';
    renderControl.innerHTML = trafficLightHTML + btnUpdateHTML;

    stateControl.classList.remove('manual-control');
    stateControl.classList.add('automatic-control');
    stateControl.innerText = '';
    stateControl.innerText = 'automatic';
    var btnUpdate = document.getElementById('btn-update');
    btnUpdate.addEventListener('click', updateData)
    btnUpdate.params = streetInfo
}

function getStateLight() {
    stateLightSocket.emit('room', idIntersection)
    controlLightSocket.emit('room', idIntersection)
    stateLightSocket.on('[center]-time-light', renderTimeLight)
    stateLightSocket.on('[center]-light-state', renderStateLight)
}

function renderTimeLight(timeLight) {
    var timeLightArray = [rightStreetTime, bottomStreetTime, leftStreetTime, topStreetTime];
    for (var i in timeLight) {
        timeLightArray[i].innerHTML = timeLight[i]
    }

}

function renderStateLight(stateLight) {
    var timeLightArray = [rightStreetTime, bottomStreetTime, leftStreetTime, topStreetTime];
    var colorLightArray = [rightStreetLight, bottomStreetLight, leftStreetLight, topStreetLight];

    for (var i in stateLight) {
        if (stateLight[i] == 'red') {
            timeLightArray[i].classList.remove('yellow-number', 'green-number');
            timeLightArray[i].classList.add('red-number');
            
            colorLightArray[i].children[0].classList.add('red-light');
            colorLightArray[i].children[1].classList.remove('yellow-light');
            colorLightArray[i].children[2].classList.remove('green-light');
        }
        else if (stateLight[i] == 'yellow') {
            timeLightArray[i].classList.remove('red-number', 'green-number');
            timeLightArray[i].classList.add('yellow-number');

            colorLightArray[i].children[0].classList.remove('red-light');
            colorLightArray[i].children[1].classList.add('yellow-light');
            colorLightArray[i].children[2].classList.remove('green-light')
        }
        else if (stateLight[i] == 'green') {
            timeLightArray[i].classList.remove('yellow-number', 'red-number');
            timeLightArray[i].classList.add('green-number');

            colorLightArray[i].children[0].classList.remove('red-light');
            colorLightArray[i].children[1].classList.remove('yellow-light');
            colorLightArray[i].children[2].classList.add('green-light')
        }
    }
}

function changeLight() {
    console.log('Change light')
    controlLightSocket.emit('[center]-change-light', 'change-light');
}

function updateData(event) {
    var timeReds = []
    var timeYellows = []
    var timeGreens = []

    for (let index = 0; index < event.currentTarget.params.length; index++) {
        timeReds.push(document.getElementsByName('timeReds')[index].value);
        timeYellows.push(document.getElementsByName('timeYellows')[index].value);
        timeGreens.push(document.getElementsByName('timeGreens')[index].value);
    }

    axios({
        method: 'put',
        url: window.location.origin + '/api/intersection/' + idIntersection,
        data: {
            delta: delta.value,
            timeReds: timeReds,
            timeYellows: timeYellows,
            timeGreens: timeGreens
        }
    })
    .then(function(res) {
        if (res.data.status == 'success') {
            setTimeout(function() {
                renderAlert.classList.remove('alert', 'alert-success');
                renderAlert.innerHTML = '';
            }, 4800)
            renderAlert.classList.add('alert', 'alert-success');
            renderAlert.innerHTML = res.data.message;

        }
        else if (res.data.status == 'error') {
            setTimeout(function() {
                renderAlert.classList.remove('alert', 'alert-error');
                renderAlert.innerHTML = '';
            }, 4800)
            renderAlert.classList.add('alert', 'alert-error');
            renderAlert.innerHTML = res.data.message;
        }
    })
}