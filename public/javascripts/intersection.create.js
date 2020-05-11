var infoStreets = document.getElementById('info-street');

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
                +         '<input type="text" name="bearings" placeholder="Góc" required>'
                +     '</div>'
                +     '<div class="input-container">'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #FF1B1C;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="text" name="timeReds" required>'
                +         '</div>'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #e8aa14;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="text" name="timeYellows" required>'
                +         '</div>'
                +         '<div class="input-box i-box">'
                +             '<span class="icon" style="color: #00c88b;">'
                +                 '<i class="fas fa-clock"></i>'
                +             '</span>'
                +             '<input type="text" name="timeGreens" required>'
                +         '</div>'
                +     '</div>'
                + '</div>'

function renderFormStreet() {
    var numStreet = document.getElementById('numStreet').value;
    infoStreets.innerHTML = '';
    for (let i = 0; i < numStreet; i++) {
        infoStreets.innerHTML += formStreet;
    }
}