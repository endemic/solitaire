class StatusBar {
  score = 0;
  time = 0;

  constructor(canvas) {
    this.canvas = canvas;
  }

  draw() {
    // update the canvas 2d context with score/timer here
  }

  resize() {
    // update the internal width/height values here

    this.draw();
  }
}
