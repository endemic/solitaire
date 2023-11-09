export default class StatusBar {
  score = 0;
  time = 0;

  constructor(canvas) {
    // dunno if we need both or not
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.timer = window.setInterval(() => {
      this.time += 1;
      this.draw();
    }, 1000);
  }

  // Standard scoring rules:

  // – Waste pile to tableau: 5 points
  // – Waste pile to foundation: 10 points
  // – Tableau to foundation: 10 points
  // – Turn over tableau card: 5 points
  // – Foundation back to tableau: -15 points
  // – Recycling/finishing the draw pile when playing by flipping over one card at a time: -100 (minimum score cannot go below zero).

  draw() {
    const x = 0;
    const y = 0;
    const width = 200;
    const height = 50;
    // update the canvas 2d context with score/timer here
    this.context.clearRect(x, y, width, height);

    // also needs a top border
    this.context.fillStyle = 'white';

    this.context.fillRect(x, y, width, height);
    this.context.fillStyle = 'black';
    this.context.font = '20px Arial, sans-serif';

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
    console.log(`Score: ${this.score} Time: ${this.time}`);
    this.context.fillText(`Score: ${this.score} Time: ${this.time}`, x, y + 20);
  }

  resize() {
    // update the internal width/height values here

    // figure out how wide the text is with current styling
    //ctx.measureText("foo")

    this.draw();
  }
}
