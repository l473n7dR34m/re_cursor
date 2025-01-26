let depthSlider, offsetSlider, noiseSlider, eraseSlider;
let curveGlobalSlider, curveInvertSlider, curveLocalSlider;
let xFactorSlider, yFactorSlider;
let modeRadio;
let invertCheck; // For global invert
let orbitDisabled = false;
let canvas;

// We'll also create a label for the export key, e.g., "[E] Export"
let exportLabel;

function setup() {
  // CREATE CANVAS
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  textFont('sans-serif');

  // Position the canvas behind the UI
  canvas.style('position', 'absolute');
  canvas.style('top', '0px');
  canvas.style('left', '0px');
  canvas.style('z-index', '-1');

  // BUILD UI
  depthSlider = createSlider(0, 200, 60, 1);
  placeUI('Recursion Depth', depthSlider, 20, 20);

  offsetSlider = createSlider(0, 45, 10, 1);
  placeUI('Base Offset (deg)', offsetSlider, 20, 60);

  noiseSlider = createSlider(0, 0.05, 0.01, 0.001);
  placeUI('Noise Factor', noiseSlider, 20, 100);

  eraseSlider = createSlider(0, 1, 0.2, 0.01);
  placeUI('Negative Space', eraseSlider, 20, 140);

  curveGlobalSlider = createSlider(0, 1, 0.0, 0.01);
  placeUI('Curve Global', curveGlobalSlider, 20, 180);

  curveInvertSlider = createSlider(-1, 1, 1, 0.01);
  placeUI('Curve Invert', curveInvertSlider, 20, 220);

  curveLocalSlider = createSlider(0, 1, 0, 0.01);
  placeUI('Curve Local', curveLocalSlider, 20, 260);

  xFactorSlider = createSlider(0, 2, 1, 0.01);
  placeUI('X Factor', xFactorSlider, 20, 300);

  yFactorSlider = createSlider(0, 2, 1, 0.01);
  placeUI('Y Factor', yFactorSlider, 20, 340);

  modeRadio = createRadio();
  modeRadio.option('Mode 1');
  modeRadio.option('Mode 2');
  modeRadio.selected('Mode 1');
  placeRadio('Mode Select', modeRadio, 20, 380);

  invertCheck = createCheckbox(' Global Invert', false);
  invertCheck.position(20, 420);

  // ADD A LABEL FOR [E] EXPORT
  exportLabel = createSpan('[E] Export');
  exportLabel.position(20, 460);

  // DISABLE ORBIT ON HOVER
  const uiElements = [
    depthSlider, offsetSlider, noiseSlider, eraseSlider,
    curveGlobalSlider, curveInvertSlider, curveLocalSlider,
    xFactorSlider, yFactorSlider, modeRadio, invertCheck, exportLabel
  ];
  uiElements.forEach((elt) => {
    elt.mouseOver(() => orbitDisabled = true);
    elt.mouseOut(() => orbitDisabled = false);
  });
}

function draw() {
  let invertOn = invertCheck.checked();

  // Invert entire doc background + text
  if (invertOn) {
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
    background(0);
  } else {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
    background(255);
  }

  if (!orbitDisabled) {
    orbitControl();
  }

  let depth       = depthSlider.value();
  let offset      = offsetSlider.value();
  let noiseFactor = noiseSlider.value();
  let eraseFactor = eraseSlider.value();
  let curveGlobal = curveGlobalSlider.value();
  let curveInvert = curveInvertSlider.value();
  let curveLocal  = curveLocalSlider.value();
  let xFactor     = xFactorSlider.value();
  let yFactor     = yFactorSlider.value();
  let currentMode = modeRadio.value(); // 'Mode 1' or 'Mode 2'

  push();
  translate(0, 0, 0);

  let shapeSize = min(width, height) * 0.5;
  if (shapeSize > 0) {
    drawRecursiveSquare(
      shapeSize,
      depth,
      offset,
      0,
      noiseFactor,
      eraseFactor,
      curveGlobal,
      curveInvert,
      curveLocal,
      xFactor,
      yFactor,
      currentMode,
      invertOn
    );
  }
  pop();
}

/**
 * Press 'e' to export the canvas
 */
function keyPressed() {
  if (key === 'e' || key === 'E') {
    saveCanvas(canvas, 'myFractal', 'png');
  }
}

/**
 * placeUI(): Create a label + slider
 */
function placeUI(labelText, slider, x, y) {
  let label = createSpan(labelText);
  label.position(x, y - 20);
  slider.position(x, y);
}

/**
 * placeRadio(): Create a label + radio
 */
function placeRadio(labelText, radio, x, y) {
  let label = createSpan(labelText);
  label.position(x, y - 20);
  radio.position(x, y);
}

/**
 * Recursively draws squares with partial edges (fade-based negative space),
 * plus advanced curve transformations, X/Y factors, and invert mode.
 */
function drawRecursiveSquare(
  shapeSize,
  depth,
  baseOffset,
  level,
  noiseFactor,
  eraseFactor,
  curveGlobal,
  curveInvert,
  curveLocal,
  xFactor,
  yFactor,
  currentMode,
  invertOn
) {
  let n = noise(level * 10 * noiseFactor);
  let noiseRotation = map(n, 0, 1, -15, 15);

  // Rotate around Z axis each recursion
  rotateZ(baseOffset + level + noiseRotation);

  // SWAPPED:
  // Mode 1 => tilt/rotate
  // Mode 2 => scale
  if (currentMode === 'Mode 1') {
    rotateX(xFactor * 10 * level);
    rotateY(yFactor * 10 * level);
  } else {
    scale(xFactor, yFactor, 1);
  }

  if (invertOn) {
    stroke(255);
  } else {
    stroke(0);
  }
  noFill();

  drawRubbedBezierSquare(
    shapeSize,
    eraseFactor,
    level,
    curveGlobal,
    curveInvert,
    curveLocal,
    invertOn
  );

  if (depth > 0) {
    push();
    drawRecursiveSquare(
      shapeSize * 0.95,
      depth - 1,
      baseOffset,
      level + 1,
      noiseFactor,
      eraseFactor,
      curveGlobal,
      curveInvert,
      curveLocal,
      xFactor,
      yFactor,
      currentMode,
      invertOn
    );
    pop();
  }
}

/**
 * Draw a 'square' with four bezier edges, fade line segments for negative space.
 */
function drawRubbedBezierSquare(
  s,
  eraseFactor,
  level,
  curveGlobal,
  curveInvert,
  curveLocal,
  invertOn
) {
  let seedVal = floor(
    level * 100 +
    eraseFactor * 9999 +
    curveGlobal * 8888 +
    curveInvert * 7777 +
    curveLocal * 6666
  );
  randomSeed(seedVal);

  let segments = 40;
  let effCurve = (curveGlobal + level * curveLocal) * curveInvert;
  let cOff = s * 0.5 * effCurve;

  let topP0 = createVector(-s / 2, -s / 2);
  let topP3 = createVector(s / 2, -s / 2);
  let topP1 = createVector(-s / 4, -s / 2 - cOff);
  let topP2 = createVector(s / 4, -s / 2 + cOff);

  let botP0 = createVector(-s / 2, s / 2);
  let botP3 = createVector(s / 2, s / 2);
  let botP1 = createVector(-s / 4, s / 2 + cOff);
  let botP2 = createVector(s / 4, s / 2 - cOff);

  let leftP0 = createVector(-s / 2, -s / 2);
  let leftP3 = createVector(-s / 2, s / 2);
  let leftP1 = createVector(-s / 2 - cOff, -s / 4);
  let leftP2 = createVector(-s / 2 + cOff, s / 4);

  let rightP0 = createVector(s / 2, -s / 2);
  let rightP3 = createVector(s / 2, s / 2);
  let rightP1 = createVector(s / 2 + cOff, -s / 4);
  let rightP2 = createVector(s / 2 - cOff, s / 4);

  drawRubbedBezier(topP0, topP1, topP2, topP3, segments, eraseFactor, invertOn);
  drawRubbedBezier(botP0, botP1, botP2, botP3, segments, eraseFactor, invertOn);
  drawRubbedBezier(leftP0, leftP1, leftP2, leftP3, segments, eraseFactor, invertOn);
  drawRubbedBezier(rightP0, rightP1, rightP2, rightP3, segments, eraseFactor, invertOn);
}

/**
 * Subdivides a cubic bezier, fade line segments if eraseFactor>0
 * If eraseFactor=0 => no fade.
 */
function drawRubbedBezier(p0, p1, p2, p3, segments, eraseFactor, invertOn) {
  for (let i = 0; i < segments; i++) {
    let t1 = i / segments;
    let t2 = (i + 1) / segments;
    let v1 = getCubicPoint(p0, p1, p2, p3, t1);
    let v2 = getCubicPoint(p0, p1, p2, p3, t2);

    if (eraseFactor <= 0.001) {
      line(v1.x, v1.y, v2.x, v2.y);
    } else {
      let fadeVal = random(1);
      let alphaMax = 255 * (1 - eraseFactor);
      let alphaVal = fadeVal * alphaMax;
      if (alphaVal > 2) {
        let c = (invertOn ? color(255, alphaVal) : color(0, alphaVal));
        stroke(c);
        line(v1.x, v1.y, v2.x, v2.y);
      }
    }
  }
}

/**
 * Cubic Bezier interpolation in 2D
 */
function getCubicPoint(p0, p1, p2, p3, t) {
  let mt = 1 - t;
  let x = mt * mt * mt * p0.x
        + 3 * mt * mt * t * p1.x
        + 3 * mt * t * t * p2.x
        + t * t * t * p3.x;
  let y = mt * mt * mt * p0.y
        + 3 * mt * mt * t * p1.y
        + 3 * mt * t * t * p2.y
        + t * t * t * p3.y;
  return createVector(x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
