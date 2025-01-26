let depthSlider, offsetSlider, noiseSlider, eraseSlider;
let curveGlobalSlider, curveInvertSlider, curveLocalSlider;
let xFactorSlider, yFactorSlider;
let modeRadio;
let invertCheck; // For global invert
let orbitDisabled = false;
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  textFont('sans-serif');

  // Position the canvas behind all HTML elements
  canvas.style('position', 'absolute');
  canvas.style('top', '0px');
  canvas.style('left', '0px');
  // Put the canvas behind the UI
  canvas.style('z-index', '-1');

  // 1. Recursion Depth
  depthSlider = createSlider(0, 200, 60, 1);
  placeUI('Recursion Depth', depthSlider, 20, 20);

  // 2. Base Offset (deg)
  offsetSlider = createSlider(0, 45, 10, 1);
  placeUI('Base Offset (deg)', offsetSlider, 20, 60);

  // 3. Perlin Noise Factor
  noiseSlider = createSlider(0, 0.05, 0.01, 0.001);
  placeUI('Noise Factor', noiseSlider, 20, 100);

  // 4. Negative Space
  eraseSlider = createSlider(0, 1, 0.2, 0.01);
  placeUI('Negative Space', eraseSlider, 20, 140);

  // 5. Curve Global
  curveGlobalSlider = createSlider(0, 1, 0.0, 0.01);
  placeUI('Curve Global', curveGlobalSlider, 20, 180);

  // 6. Curve Invert
  curveInvertSlider = createSlider(-1, 1, 1, 0.01);
  placeUI('Curve Invert', curveInvertSlider, 20, 220);

  // 7. Curve Local
  curveLocalSlider = createSlider(0, 1, 0, 0.01);
  placeUI('Curve Local', curveLocalSlider, 20, 260);

  // 8. X Factor
  xFactorSlider = createSlider(0, 2, 1, 0.01);
  placeUI('X Factor', xFactorSlider, 20, 300);

  // 9. Y Factor
  yFactorSlider = createSlider(0, 2, 1, 0.01);
  placeUI('Y Factor', yFactorSlider, 20, 340);

  // 10. Mode Radio (SWAPPED)
  modeRadio = createRadio();
  modeRadio.option('Mode 1');
  modeRadio.option('Mode 2');
  modeRadio.selected('Mode 1');
  placeRadio('Mode Select', modeRadio, 20, 380);

  // 11. Global Invert
  invertCheck = createCheckbox(' Global Invert', false);
  invertCheck.position(20, 420);

  // Group all controls to disable orbit on hover
  const uiElements = [
    depthSlider, offsetSlider, noiseSlider, eraseSlider,
    curveGlobalSlider, curveInvertSlider, curveLocalSlider,
    xFactorSlider, yFactorSlider, modeRadio, invertCheck
  ];
  uiElements.forEach((elt) => {
    elt.mouseOver(() => orbitDisabled = true);
    elt.mouseOut(() => orbitDisabled = false);
  });
}

function draw() {
  let invertOn = invertCheck.checked();

  // -- Invert the entire HTML document, including UI --
  if (invertOn) {
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
  } else {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
  }

  // For the canvas background
  if (invertOn) {
    background(0);
  } else {
    background(255);
  }

  // Only orbit if mouse not over UI
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
 * Helper: place label + slider at (x,y).
 */
function placeUI(labelText, slider, x, y) {
  let label = createSpan(labelText);
  // The label text color will flip if invertOn is set, because we flip body color globally
  label.position(x, y - 20);
  slider.position(x, y);
}

/**
 * Helper: place label + radio at (x,y).
 */
function placeRadio(labelText, radio, x, y) {
  let label = createSpan(labelText);
  label.position(x, y - 20);
  radio.position(x, y);
}

/**
 * Recursively draws squares with partial edges (fade-based negative space),
 * plus advanced curve transformations, X/Y factors, and global invert.
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

  // Rotate Z each recursion
  rotateZ(baseOffset + level + noiseRotation);

  // SWAPPED modes:
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
 * Draws a 'square' with four bezier edges, fading line segments for negative space.
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
 * Subdivides a cubic bezier, fading line segments by alpha. 
 * If eraseFactor=0 => no fade (alpha=255).
 */
function drawRubbedBezier(p0, p1, p2, p3, segments, eraseFactor, invertOn) {
  for (let i = 0; i < segments; i++) {
    let t1 = i / segments;
    let t2 = (i + 1) / segments;
    let v1 = getCubicPoint(p0, p1, p2, p3, t1);
    let v2 = getCubicPoint(p0, p1, p2, p3, t2);

    if (eraseFactor <= 0.001) {
      // No negative space => fully opaque
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
