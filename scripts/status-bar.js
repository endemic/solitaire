export default class StatusBar {
  score = 0;
  time = 0;

  // internal sizing var that get set in `resize`
  width = null;
  height = null;

  borderSize = 1;
  minFontSize = 16;

  constructor(canvas) {
    // dunno if we need both or not
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  draw() {
    // TODO: dynamically adjust font size; base height of status bar off minimum font size
    // make minimum font size readable on portrait phone

    const text = `Score: ${this.score}  Time: ${this.time}`;
    const textSize = this.context.measureText(text);
    const rightPadding = this.height * 0.25; // used for some padding on the right side of the score/timer

    // need to account for scaling when displayed on HiDPI screens
    const scaledCanvasWidth = parseInt(this.canvas.style.width, 10);
    const scaledCanvasHeight = parseInt(this.canvas.style.height, 10);

    const windowMargin = (scaledCanvasWidth - this.width) / 2;

    // draw top border
    this.context.fillStyle = 'black';
    this.context.fillRect(0, scaledCanvasHeight - this.height, scaledCanvasWidth, this.borderSize);

    // hidpi: 628px, 1884
    // alert(`${this.canvas.style.height}, ${this.canvas.height}`);

    // draw white stats bar background
    this.context.fillStyle = 'white';
    this.context.fillRect(0, scaledCanvasHeight - this.height + this.borderSize, scaledCanvasWidth, this.height);

    // set text style
    this.context.font = `${this.fontSize}px "Generic Mobile System", monospace`;
    this.context.fillStyle = 'black';

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
    this.context.fillText(text, windowMargin + this.width - textSize.width - rightPadding, scaledCanvasHeight - textSize.fontBoundingBoxDescent);
  }

  startTimer() {
    if (this.timer) {
      return;
    }

    this.timer = window.setInterval(() => {
      this.time += 1;
      this.draw();
    }, 1000);
  }

  stopTimer() {
    window.clearInterval(this.timer);
    this.timer = undefined;
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

    this.fontSize = this.width * 0.025;

    if (this.fontSize < this.minFontSize) {
      this.fontSize = this.minFontSize;
    }

    this.height = this.fontSize * 1.2;


    this.draw();
  }

  reset() {
    this.stopTimer();

    this.score = 0;
    this.time = 0;

    this.draw();
  }
}
