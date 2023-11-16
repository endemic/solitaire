export default class StatusBar {
  score = 0;
  time = 0;

  // internal sizing var that get set in `resize`
  width = null;

  borderSize = 1;

  constructor(canvas) {
    // dunno if we need both or not
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.timer = window.setInterval(() => {
      this.time += 1;
      this.draw();
    }, 1000);
  }

  draw() {
    // TODO: dynamically adjust font size; base height of status bar off minimum font size
    // make minimum font size readable on portrait phone
    let fontSize = this.width * 0.025;
    const minFontSize = 16;
    const windowMargin = (this.canvas.width - this.width) / 2;
    const text = `Score: ${this.score}  Time: ${this.time}`;
    const textSize = this.context.measureText(text);

    fontSize = fontSize < minFontSize ? minFontSize : fontSize;

    const height = fontSize * 1.2; // height of status bar
    const margin = height * 0.25; // used for some margin on the right side of the score/timer

    // draw top border
    this.context.fillStyle = 'black';
    this.context.fillRect(0, this.canvas.height - height, this.canvas.width, this.borderSize);

    // draw white stats bar background
    this.context.fillStyle = 'white';
    this.context.fillRect(0, this.canvas.height - height + this.borderSize, this.canvas.width, height);

    // set text style
    this.context.font = `${fontSize}px Arial, sans-serif`;
    this.context.fillStyle = 'black';

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
    this.context.fillText(text, windowMargin + this.width - textSize.width - margin, this.canvas.height - textSize.fontBoundingBoxDescent);
  }

  stopTimer() {
    window.clearInterval(this.timer);
  }

  updateScore(diff) {
    this.score += diff;

    if (this.score < 0) {
      this.score = 0;
    }

    this.draw();
  }

  resize(tableauWidth) {
    this.width = tableauWidth;

    this.draw();
  }
}
