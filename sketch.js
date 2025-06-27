let logo, recoloredLogo, customFont;
let x = 100, y = 100;
let dx = 3, dy = 2;
let logoSize = 150;
let currentColor;
let logoColor;
let textColor = '#FFFFFF';
let hearts = [];

let heartRainActive = false;
let heartRainStart = 0;
let heartRainDuration = 3000;

function preload() {
  logo = loadImage("JAM_BW.png");
  customFont = loadFont("Pacifico-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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

  // Use margin-based corner detection for more frequent corner hits
  if ((nearLeft && nearTop) || (nearRight && nearTop) ||
      (nearLeft && nearBottom) || (nearRight && nearBottom)) {
    hitCorner = true;
  }

  if (x <= 0 || x + logoSize >= width) {
    dx = -dx;
    dy += random(-0.5, 0.5);  // small vertical nudge
    bounced = true;
  }
  if (y <= 0 || y + logoSize >= height) {
    dy = -dy;
    dx += random(-0.5, 0.5);  // small horizontal nudge
    bounced = true;
  }

  // Keep speed within reasonable bounds so it doesn't speed up too much
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
  textSize(40);
  fill(0, 100);
  text("Jared & Maddy", width / 2 + 2, 62);
  fill(textColor);
  text("Jared & Maddy", width / 2, 60);

  textSize(60);
  fill(textColor);
  text("The Sweetest JAM", width / 2, height / 2);

  textSize(30);
  fill(0, 100);
  text("June 29th, 2025", width / 2 + 2, height - 38);
  fill(textColor);
  text("June 29th, 2025", width / 2, height - 40);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}
