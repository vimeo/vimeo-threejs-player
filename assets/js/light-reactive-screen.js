var canvas;

window.onload = function () {
  canvas = document.getElementById('dominent-color').getContext('2d');
}

function getFloorColor(videoElm) {
  canvas.drawImage(videoElm, 0, 10, 10, 11);
  var frame = canvas.getImageData(0, 10, 10, 11);
  return getDominentColorFromFrame(frame);
}

function getDominentColorFromFrame(_frame) {
  var rSum = 0;
  var gSum = 0;
  var bSum = 0;

  for(var i = 0; i < _frame.data.length / 4; i++) {
    rSum += _frame.data[i * 4];
    gSum += _frame.data[i * 4 + 1];
    bSum += _frame.data[i * 4 + 2];
  }

  // Get the avrage per channel color from the pixel strip
  rSum /= _frame.data.length / 4;
  gSum /= _frame.data.length / 4;
  bSum /= _frame.data.length / 4;

  // Return a three.js color object
  return new THREE.Color(`rgb(${Math.round(rSum)}, 
                              ${Math.round(gSum)}, 
                              ${Math.round(bSum)})`);
}