export default class MenuBar {
  // internal sizing var that get set in `resize`
  width = null;

  borderSize = 1;

  constructor(canvas) {
    // dunno if we need both or not
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    // add event listeners to listen for menu events

    this.items = [
      'Menu',
      'Game'
    ];
  }

  draw() {
    return;
    // TODO: dynamically adjust font size; base height of status bar off minimum font size
    // make minimum font size readable on portrait phone
    let fontSize = this.width * 0.025;
    const minFontSize = 16;
    const windowMargin = (this.canvas.width - this.width) / 2;
    const text = 'Menu  Game';
    const textSize = this.context.measureText(text);

    fontSize = fontSize < minFontSize ? minFontSize : fontSize;

    const height = fontSize * 1.2; // height of status bar
    const margin = height * 0.25; // used for some margin on the right side of the score/timer

    // draw top border
    this.context.fillStyle = 'black';
    this.context.fillRect(0, height + this.borderSize, this.canvas.width, this.borderSize);

    // draw white stats bar background
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, height);

    // set text style
    // https://en.wikipedia.org/wiki/System_(typeface)
    // https://www.dafont.com/w95fa.font
    // https://www.dafont.com/generic-mobile-system.font
    this.context.font = `${fontSize}px Arial, sans-serif`;
    this.context.fillStyle = 'black';

    //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
    this.context.fillText(text, windowMargin + margin, textSize.fontBoundingBoxAscent);
  }

  resize(tableauWidth) {
    this.width = tableauWidth;

    // TODO: move sizing nonsense in here so height can be accessed externally

    this.draw();
  }
}
