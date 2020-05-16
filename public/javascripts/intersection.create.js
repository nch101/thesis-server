var infoStreets = document.getElementById('info-street');
var numStreet = document.getElementById('num-street');
var formItemArray = document.getElementsByClassName('i-form-item');
var bearingsArray = document.getElementsByName('bearings');

var intersectionName = document.getElementsByName('intersectionName');
var locations = document.getElementsByName('locations');
var timeDelta = document.getElementsByName('delta');
var timeReds = document.getElementsByName('timeReds');
var timeYellows = document.getElementsByName('timeYellows');
var timeGreens = document.getElementsByName('timeGreens');



var btnCreate = document.getElementById('btn-create');

var formStreet = '<div class="i-form-item">'
                +    '<div class="input-box i-box">'
                +        '<span class="icon">'
                +            '<i class="fas fa-road"></i>'
                +        '</span>'
                +        '<input type="text" name="streetNames" placeholder="Tên đường" required>'
                +     '</div>'
                +     '<div class="input-box i-box">'
                +         '<span class="icon" style="color: #6eeb83;">'
                +             '<i class="fas fa-map-marker-alt"></i>'
                +         '</span>'
                +         '<input type="text" name="locations" placeholder="Tọa độ" required>'
                +     '</div>'
                +     '<div class="input-box i-box">'
                +         '<span class="icon" style="color: #6cd4ff;">'
                +             '<i class="fas fa-angle-left"></i>'
                +         '</span>'
                +         '<input type="number" name="bearings" placeholder="Góc" onchange="sortFormStreet()" required>'
                +     '</div>'
                +     '<div class="input-container">'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #FF1B1C;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="number" name="timeReds" required>'
                +         '</div>'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #e8aa14;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="number" name="timeYellows" required>'
                +         '</div>'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #00c88b;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="number" name="timeGreens" required>'
                +         '</div>'
                +     '</div>'
                + '</div>'

function renderFormStreet() {
    infoStreets.style.display = '-webkit-inline-box';
    infoStreets.innerHTML = '';
    for (let i = 0; i < numStreet.value; i++) {
        infoStreets.innerHTML += formStreet;
    }
}

function sortFormStreet() {
    for (var i = 0; i < numStreet.value-1; i++) {
        var min = i;
        for (var j = i+1; j < numStreet.value; j++) {
            if (parseInt(bearingsArray[j].value) > parseInt(bearingsArray[min].value))
                min = j;
        }
        if (min != i) {
            infoStreets.insertBefore(formItemArray[min], formItemArray[i]);
        }
    }
}

btnCreate.addEventListener('click', postData)

function postData() {
    var formData = new FormData();
    formData.append('intersectionName', intersectionName.value)
    formData.append('delta', timeDelta.value)
    for (var i = 0; i < numStreet; i++) {
        formData.append('locations', locations[i].value)
        formData.append('bearings', bearingsArray[i].value)
        formData.append('timeReds', timeReds[i].value)
        formData.append('timeYellows', timeYellows[i].value)
        formData.append('timeGreens', timeGreens[i].value)
    }

    axios({
        method: 'post',
        url: 'http://localhost:3000/api/test',
        data: formData
    })
}