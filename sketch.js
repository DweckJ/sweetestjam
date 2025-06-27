let logo, recoloredLogo, customFont;
let x = 100, y = 100;
let dx = 3, dy = 2;
let logoSize;
let currentColor;
let logoColor;
let textColor = '#FFFFFF';
let hearts = [];

let heartRainActive = false;
let heartRainStart = 0;
let heartRainDuration = 3000;
let canvas;

function preload() {
  logo = loadImage("JAM_BW.png");
  customFont = loadFont("Pacifico-Regular.ttf");
}

function setup() {
  let dims = calculateCanvasSize();
  canvas = createCanvas(dims.w, dims.h);
  centerCanvas();

  imageMode(CORNER);
  textAlign(CENTER, CENTER);
  textFont(customFont || 'Georgia');

  currentColor = getWeddingPastel();
  logoColor = currentColor;
  recoloredLogo = recolorDarkPixels(logo, logoColor);

  noSmooth();
}

function draw() {
  background(120, 100, 110); // warm mauve-gray

logoSize = height * 0.18; // instead of 0.125

  if (heartRainActive && millis() - heartRainStart < heartRainDuration) {
    spawnHeartRain();
  } else if (millis() - heartRainStart >= heartRainDuration) {
    heartRainActive = false;
  }

  drawHearts();
  drawTextOverlay();
  image(recoloredLogo, x, y, logoSize, logoSize);

  x += dx;
  y += dy;

  let bounced = false;
  let hitCorner = false;

  let margin = 10;
  let nearLeft = x <= margin;
  let nearRight = x + logoSize >= width - margin;
  let nearTop = y <= margin;
  let nearBottom = y + logoSize >= height - margin;

  if ((nearLeft && nearTop) || (nearRight && nearTop) ||
      (nearLeft && nearBottom) || (nearRight && nearBottom)) {
    hitCorner = true;
  }

  if (x <= 0 || x + logoSize >= width) {
    dx = -dx;
    dy += random(-0.5, 0.5);
    bounced = true;
  }
  if (y <= 0 || y + logoSize >= height) {
    dy = -dy;
    dx += random(-0.5, 0.5);
    bounced = true;
  }

  dx = constrain(dx, -5, 5);
  dy = constrain(dy, -5, 5);

  if (bounced) {
    logoColor = getWeddingPastel();
    recoloredLogo = recolorDarkPixels(logo, logoColor);

    if (hitCorner) {
      heartRainActive = true;
      heartRainStart = millis();
    }
  }
}

function drawTextOverlay() {
  push();

  let scale = height / 800; // Reference scaling
  textAlign(CENTER, CENTER);
  textFont(customFont || 'Georgia');

  textSize(40 * scale);
  fill(0, 100);
  text("Jared & Maddy", width / 2 + 2, 62 * scale);
  fill(textColor);
  text("Jared & Maddy", width / 2, 60 * scale);

  textSize(60 * scale);
  fill(textColor);
  text("The Sweetest JAM", width / 2, height / 2);

  textSize(30 * scale);
  fill(0, 100);
  text("June 29th, 2025", width / 2 + 2, height - 38 * scale);
  fill(textColor);
  text("June 29th, 2025", width / 2, height - 40 * scale);

  pop();
}

function getWeddingPastel() {
  let pastels = [
    color(244, 194, 194), // dusty pink
    color(253, 233, 207), // peach
    color(255, 223, 229), // blush
    color(250, 250, 210), // soft yellow
    color(240, 210, 245), // lilac
    color(206, 246, 218)  // mint
  ];
  return random(pastels);
}

function recolorDarkPixels(srcImg, newColor) {
  let temp = createImage(srcImg.width, srcImg.height);
  temp.copy(srcImg, 0, 0, srcImg.width, srcImg.height, 0, 0, srcImg.width, srcImg.height);
  temp.loadPixels();

  let threshold = 60;
  let r1 = red(newColor);
  let g1 = green(newColor);
  let b1 = blue(newColor);

  for (let i = 0; i < temp.pixels.length; i += 4) {
    let r = temp.pixels[i];
    let g = temp.pixels[i + 1];
    let b = temp.pixels[i + 2];
    let a = temp.pixels[i + 3];
    if (r < threshold && g < threshold && b < threshold) {
      temp.pixels[i] = r1;
      temp.pixels[i + 1] = g1;
      temp.pixels[i + 2] = b1;
      temp.pixels[i + 3] = a;
    }
  }

  temp.updatePixels();
  return temp;
}

function spawnHeartRain() {
  for (let i = 0; i < random(2, 5); i++) {
    hearts.push({
      x: random(width),
      y: -20,
      size: random(0.6, 1.4),
      speed: random(1, 3),
      alpha: 255,
      color: logoColor
    });
  }
}

function drawHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    let h = hearts[i];
    push();
    translate(h.x, h.y);
    scale(h.size);
    noStroke();
    fill(h.color.levels[0], h.color.levels[1], h.color.levels[2], h.alpha);

    beginShape();
    vertex(0, -15);
    bezierVertex(-12, -30, -30, -5, 0, 10);
    bezierVertex(30, -5, 12, -30, 0, -15);
    endShape(CLOSE);
    pop();

    h.y += h.speed;
    h.alpha -= 3;

    if (h.alpha <= 0) {
      hearts.splice(i, 1);
    }
  }
}

function calculateCanvasSize() {
  let maxW = windowWidth * 0.98;
  let maxH = windowHeight * 0.98;

  let targetAspect = 4 / 3; // Taller than 16:9

  let w = maxW;
  let h = w / targetAspect;

  if (h > maxH) {
    h = maxH;
    w = h * targetAspect;
  }

  return { w, h };
}


function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  let dims = calculateCanvasSize();
  resizeCanvas(dims.w, dims.h);
  centerCanvas();
}

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}
