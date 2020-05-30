// const imageElement = document.getElementById('image');
const camSocket = io(window.location.host + '/socket/camera');
camSocket.on('[center]-camera', function(base64Image) {
    renderCanvas(base64Image);
})

function renderCanvas(abc) {
    parser = new JpegDecoder();
    parser.parse(convertDataURIToUint8(abc));
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