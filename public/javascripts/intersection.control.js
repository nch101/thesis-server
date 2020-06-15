var renderInteract = document.getElementById('render-interact');
var renderControl = document.getElementById('render-control');
var renderAlert = document.getElementById('render-alert');

var intersectionNameHTML = document.getElementById('intersection-name');
var trafficDensityEle = document.getElementById('traffic-density-state');
var delta = document.getElementById('delta');

var modeBtn = document.getElementById('mode-control');
var flexibleTime = document.getElementById('flexible-time');
var fixedTime = document.getElementById('fixed-time');
var manual = document.getElementById('manual');

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

const stateLightSocket = io(window.location.origin + '/socket/state-light');
const controlLightSocket = io(window.location.origin + '/socket/control-light');
const camSocket = io(window.location.origin + '/socket/camera');

axios.defaults.baseURL = window.location.origin;
// axios.defaults.headers.common['Authorization'] = ;

var idIntersection;

mapboxgl.accessToken = cookiesParser('mapToken');

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [106.66008, 10.763512],
    zoom: 12
});

axios.get('/intersection')
.then(renderIntersectionsOnMap)

function renderIntersectionsOnMap(res) {
    var intersectionsData = res.data;

    for (var intersectionData of intersectionsData) {
        var el = document.createElement('div');
        el.className = 'intersection';
        el.addEventListener('click', getInfoIntersection);
        el.id = intersectionData._id;
        el.coordinates = intersectionData.location.coordinates;

        new mapboxgl.Marker(el)
        .setLngLat(intersectionData.location.coordinates)
        .addTo(map);
    }
}

// getInfoIntersection();

async function getInfoIntersection(event) {
    // @params: event --------------^

    /**
     * Fly to intersection has been clicked
     */

    var coordinates = event.currentTarget.coordinates;
    map.flyTo({
        center: coordinates,
        speed: 0.8,
        zoom: 17
    })
    
    /**
     * Unsubscribe intersection was clicked before and subscribe new intersection
     */
    
    unsubscribeIntersection();
    idIntersection = event.currentTarget.id;
    subscribeIntersection();

    // DEBUG
    //idIntersection = '5eb90fe69f1398273bba559a';

    /**
     * Get and render information of intersection
     */

    var res = await axios.get({
        method: 'get',
        url: window.location.origin + '/intersection/' + idIntersection
    })
    .then(renderInfoIntersection)
}

function unsubscribeIntersection() {
    stateLightSocket.emit('leave-room', idIntersection);
    controlLightSocket.emit('leave-room', idIntersection);
    camSocket.emit('leave-room', idIntersection);
}

function subscribeIntersection() {
    stateLightSocket.emit('room', idIntersection);
    controlLightSocket.emit('room', idIntersection);
    camSocket.emit('room', idIntersection);

    stateLightSocket.on('[center]-time-light', renderTimeLight);
    stateLightSocket.on('[center]-light-state', renderStateLight);

    camSocket.on('[center]-camera', renderCanvas);
}

function renderInfoIntersection(res) {
    var intersectionName = res.data.intersectionName;
    var trafficDensity = res.data.trafficDensity;
    var modeControl = res.data.modeControl;
    var deltaTime = res.data.delta;
    var streetInfo = res.data.trafficLights;
    var streetArray = [rightStreet, bottomStreet, leftStreet, topStreet];
    var trafficDensityClass = trafficDensityEle.classList;

    renderInteract.style.display = 'flex';

    for (var index in streetInfo) {
        streetArray[index].innerHTML = streetInfo[index].streetName;
    }

    intersectionNameHTML.innerHTML = intersectionName;
    delta.value = deltaTime;

    if (trafficDensity === 'very-low') {
        trafficDensityEle.innerHTML = 'Rất thấp';
        trafficDensityClass.remove(trafficDensityClass.item(1));
        trafficDensityClass.add('vl-badge');
    }
    else if (trafficDensity === 'low') {
        trafficDensityEle.innerHTML = 'Thấp';
        trafficDensityClass.remove(trafficDensityClass.item(1));
        trafficDensityClass.add('l-badge');
    }
    else if (trafficDensity === 'medium') {
        trafficDensityEle.innerHTML = 'Trung bình';
        trafficDensityClass.remove(trafficDensityClass.item(1));
        trafficDensityClass.add('m-badge');
    }
    else if (trafficDensity === 'high') {
        trafficDensityEle.innerHTML = 'Cao';
        trafficDensityClass.remove(trafficDensityClass.item(1));
        trafficDensityClass.add('h-badge');
    }
    else if (trafficDensity === 'very-high') {
        trafficDensityEle.innerHTML = 'Rất cao';
        trafficDensityClass.remove(trafficDensityClass.item(1));
        trafficDensityClass.add('vh-badge');
    }

    if (modeControl === 'automatic-fixed-time') {
        
        automaticControl(streetInfo);
    }
    else if (modeControl === 'automatic-flexible-time') {

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

function trafficDensity()

function updateStateControl() {
    if (isManual.checked) {
        controlLightSocket.emit('[center]-change-mode', { mode: 'manual' });
        manualControl()
    }
    else {
        controlLightSocket.emit('[center]-change-mode', { mode: 'automatic' });
        // Update time light
        axios({
            method: 'get',
            url: window.location.origin + '/intersection/' + idIntersection
        })
        .then(function(res) {
            automaticControl(res.data.trafficLights);
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
    // stateControl.innerText = '';
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
    btnUpdate.addEventListener('click', updateData);
    btnUpdate.params = streetInfo;
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
        resetColor(timeLightArray[i], colorLightArray[i]);
        if (stateLight[i] == 'red') {
            timeLightArray[i].classList.add('red-number');            
            colorLightArray[i].children[0].classList.add('red-light');
        }
        else if (stateLight[i] == 'yellow') {
            timeLightArray[i].classList.add('yellow-number');
            colorLightArray[i].children[1].classList.add('yellow-light');
        }
        else if (stateLight[i] == 'green') {
            timeLightArray[i].classList.add('green-number');
            colorLightArray[i].children[2].classList.add('green-light')
        }
    }
}

function changeLight() {
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
        url: window.location.origin + '/intersection/' + idIntersection,
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

function renderCanvas(base64Image) {
    parser = new JpegDecoder();
    parser.parse(convertDataURIToUint8(base64Image));
    width = parser.width;
    height = parser.height;
    numComponents = parser.numComponents;
    decoded = parser.getData(width, height);

    var canvas = document.getElementById('image');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(width, height);
    var imageBytes = imageData.data;
    for (var i = 0, j = 0, ii = width * height * 4; i < ii; ) {
      imageBytes[i++] = decoded[j++];
      imageBytes[i++] = numComponents === 3 ? decoded[j++] : decoded[j - 1];
      imageBytes[i++] = numComponents === 3 ? decoded[j++] : decoded[j - 1];
      imageBytes[i++] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
}

function convertDataURIToUint8(dataURI) {
    // Validate input data
    if(!dataURI) return;

    var raw = window.atob(dataURI);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    // Return a array binary data
    return array;
}



function resetColor(timeLightArray ,colorLightArray) {
    timeLightArray.classList.remove('red-number', 'yellow-number', 'green-number');

    colorLightArray.children[0].classList.remove('red-light');
    colorLightArray.children[1].classList.remove('yellow-light');
    colorLightArray.children[2].classList.remove('green-light');
}


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