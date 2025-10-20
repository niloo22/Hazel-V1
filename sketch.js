//===========================================//

let mic;
let micLevel = 0;
let micMultiplier = 20;
let threshold = 0.10;

let puppyGif;
let puppyX, puppyY;
let puppyScale = 2;

let state = "idle"; // idle, Main, SlideLeft, SlideRight
let timer = 0;
let SlideRightDuration = 1000; // 1Sec SlideRight
let SlideRightStartX = 0;

function preload() {
  puppyGif = loadImage('gifs/puppy.gif');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();
  mic.start();

  puppyX = width / 2;
  puppyY = height / 2;

  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(22);

  
    // Lock mobile gestures
    //lockGestures();
}

function draw() {
  background(30, 30, 40); 

  micLevel = mic.getLevel() * micMultiplier;

  switch (state) {

    case "idle":
      if (micLevel > threshold) {
        state = "Main";
        puppyX = width / 2;
        puppyY = height / 2;
        timer = millis();
        puppyGif.play();
      }
      break;

    case "Main":
      image(puppyGif, puppyX, puppyY, 200 * puppyScale, 200 * puppyScale);

      // if still loud, keep holding
      if (millis() - timer > 4000) {
        state = "SlideLeft";
        timer = millis();
      }
      break;

    case "SlideLeft":
      // If new sound detected, start SlideRight
      if (micLevel > threshold) {
        state = "SlideRight";
        SlideRightStartX = puppyX; // start from current X
        timer = millis();
      } else {
        // SlideLeft left over 2 seconds
        let elapsed = millis() - timer;
        let duration = 2000;
        puppyX = map(elapsed, 0, duration, width / 2, -200);
        image(puppyGif, puppyX, puppyY, 200 * puppyScale, 200 * puppyScale);

        if (elapsed > duration) {
          state = "idle";
          puppyGif.pause();
        }
      }
      break;

    case "SlideRight":
      let elapsed = millis() - timer;
      puppyX = lerp(SlideRightStartX, width / 2, constrain(elapsed / SlideRightDuration, 0, 1));
      image(puppyGif, puppyX, puppyY, 200 * puppyScale, 200 * puppyScale);

      if (elapsed >= SlideRightDuration) {
        // Back at center, hold for 4 seconds
        state = "Main";
        timer = millis();
      }
      break;
  }

  // debug mic info
  fill(255);
  textSize(18);
  text("Mic Level: " + nf(micLevel, 1, 3), width / 2, height - 40);
  text("Threshold: " + threshold, width / 2, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
