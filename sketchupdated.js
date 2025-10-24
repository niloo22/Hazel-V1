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
