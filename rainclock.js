let drops = [];
let waterLevel = 0;  // Water level height
let blockSize = 40;  // Size of each raindrop
let waterRiseSpeed;  // Speed at which the water rises
let waveOffset = 0;  // Offset for the wave animation

function setup() {
  createCanvas(400, 600);
  waterRiseSpeed = height / 60;  // Speed to fill the canvas in 60 seconds
  frameRate(60);  // 60 frames per second
}

function draw() {
  background(220, 240, 200);  // Sky background color

  // Draw the wavy water surface
  drawWaterSurface();

  // Generate a new raindrop every second
  if (frameCount % 60 === 0) {
    let x = random(width);  // Random x position for raindrop
    drops.push(new Drop(x, 0, blockSize));  // Raindrop starts at the top of the canvas
  }

  // Update and display all raindrops
  for (let i = drops.length - 1; i >= 0; i--) {
    drops[i].update();
    drops[i].display();

    // Remove raindrop if it reaches the water surface or bottom
    if (drops[i].y > height - waterLevel) {
      drops.splice(i, 1);
    }
  }

  // Update the water level
  waterLevel += waterRiseSpeed / 60;  // Water rises every second
  if (waterLevel >= height) {
    waterLevel = 0;  // Reset water level when it fills the canvas
    drops = [];  // Remove all existing raindrops
  }
}

// Draw the wavy water surface
function drawWaterSurface() {
  fill(70, 220, 190);
  noStroke();

  beginShape();
  let waveAmplitude = 10;  // Amplitude of the wave
  let waveFrequency = 0.02;  // Frequency of the wave
  for (let x = 0; x <= width; x += 10) {
    let y = sin((x + waveOffset) * waveFrequency) * waveAmplitude;
    vertex(x, height - waterLevel + y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Increase the wave offset to animate the waves
  waveOffset += 0.5;
}

// Define the raindrop class
class Drop {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = 5;  // Falling speed of the raindrop
  }

  // Update raindrop position
  update() {
    this.y += this.speed;
  }

  // Display the raindrop with a sharp top and round bottom
  display() {
    fill(70, 220, 190);
    noStroke();
    beginShape();
    
    // Sharp top of the raindrop
    vertex(this.x, this.y);

    // Left bezier curve (sharp top, round bottom)
    bezierVertex(this.x - this.size / 4, this.y + this.size / 4,  // Control point 1
                 this.x - this.size / 2, this.y + this.size,      // Control point 2
                 this.x, this.y + this.size);                    // Bottom left

    // Right bezier curve (sharp top, round bottom)
    bezierVertex(this.x + this.size / 2, this.y + this.size,      // Control point 3
                 this.x + this.size / 4, this.y + this.size / 4,  // Control point 4
                 this.x, this.y);                                // Back to the sharp top

    endShape(CLOSE);
  }
}
