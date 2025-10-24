//Group2 //Niloo//I started to design for our imaginary scenario which was a interactive puppy which reacts to the voice of user call it //
//started with 2 codes from DigitalFuturesOCADU P5-Phone-Interactions library on github

// also I used toturial from p5js Conditionals and Interactivity page. https://p5js.org/tutorials/conditionals-and-interactivity/ //

let mic;
let micLevel = 0;
let micMultiplier = 10;
let threshold = 0.15;

let puppyGif;
let puppyX, puppyY;
let puppyScale = 3;

let state = "idle"; // idle, Main, SlideLeft, SlideRight
let timer = 0;
let SlideRightDuration = 1000; // 1Sec SlideRight
let SlideRightStartX = 0;

// Name variables for on-screen input
let puppyName = "";
let nameInput, nameButton;
let nameEntered = false;

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
  
    lockGestures();
  
// 🐶 On-screen Name Your Puppy prompt
nameInput = createInput();
nameInput.position(width/2 - 80, height/2);
nameInput.size(160, 25);
nameInput.attribute("placeholder", "Enter puppy name");

nameButton = createButton("OK");
nameButton.position(width/2 + 90, height/2);
nameButton.mousePressed(setPuppyName);

textAlign(CENTER, CENTER);
textSize(22);
  
}

function draw() {
  
 if (!nameEntered) {
  background(30, 30, 40);

  // Draw cute card background
  fill(255, 230, 200, 220); // soft pastel color with slight transparency
  stroke(255, 180, 150);    // subtle border color
  strokeWeight(2);
  rectMode(CENTER);
  rect(width/2, height/2, 320, 120, 20); // x, y, width, height, corner radius

  // Card title text
  fill(50, 30, 80); // text color
  noStroke();
  textSize(26);
  text("Name your puppy", width / 2, height / 2 - 30);

  // Input and button already positioned in setup()
  return; // stops the rest of draw until name is entered
  }
  
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
  
  // Show hint after silence
  if (state === "idle") {
    if (millis() - timer > 4000) {
      fill(200);
      textSize(25);
      text("Try calling her name!", width / 2, height / 2 );
    }
  }

  // debug mic info
  fill(255);
  textSize(18);
  text("Mic Level: " + nf(micLevel, 1, 3), width / 2, height - 40);
  text("Threshold: " + threshold, width / 2, height - 20);
}

function setPuppyName() {
  puppyName = nameInput.value().trim();
  if (puppyName === "") {
    puppyName = "Hazel"; // fallback name
  }
 nameEntered = true;
  nameInput.remove();
  nameButton.remove();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
