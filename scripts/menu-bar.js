export default class MenuBar {
  // internal sizing var that get set in `resize`
  width = null;
  height = null;

  borderSize = 1;
  minFontSize = 16;

  constructor(canvas) {
    // dunno if we need both or not
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    // add event listeners to listen for menu events

    // todo: might have to pass these options in as arguments to the constructor
    // each top level menu item needs to calculate its own dimensions (with padding, etc) to allow
    // for easy collision detection
    // each top menu item also needs to calculate the overall size of its child menu dropdown
    this.items = [
      {
        text: 'Game',
        items: [
          { text: 'Deal', callback: () => {/* deal new game */} },
          { text: 'Draw Three', selected: true, callback: () => {/* toggle between draw 1/3 */} },
          { text: 'Sound', selected: true, callback: () => {/* toggle playing sound */} },
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'How to Play', callback: () => {/* go to wiki */} },
          { text: 'About...', callback: () => {/* somewhere */} },
        ]
      }
    ];
  }

  draw() {
    // need to account for scaling when displayed on HiDPI screens
    const scaledCanvasWidth = parseInt(this.canvas.style.width, 10);
    // const scaledCanvasHeight = parseInt(this.canvas.style.height, 10);

    const windowMargin = (scaledCanvasWidth - this.width) / 2;

    // draw bottom border
    this.context.fillStyle = 'black';
    this.context.fillRect(0, this.height + this.borderSize, scaledCanvasWidth, this.borderSize);

    // draw white background
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, scaledCanvasWidth, this.height);

    // set text style
    this.context.font = `${this.fontSize}px "Generic Mobile System", monospace`;
    this.context.fillStyle = 'black';

    // TODO determine which menu item is open, based on clix
    const text = this.items.map(item => item.text).join(' ');
    const textSize = this.context.measureText(text);

    console.log(textSize);

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
    this.context.fillText(text, windowMargin, textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent);
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
}
