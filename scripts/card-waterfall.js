export default class CardWaterfall {
  currentlyFallingCard = null;

  constructor(canvas, foundations, callback) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.foundations = foundations;
    this.callback = callback;

    // get the first card
    this.currentlyFallingCard = this.nextCard();

    this.start();
  }

  get randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
  }

  get randomVelocity() {
    const scaledCanvasWidth = parseInt(this.canvas.style.width, 10);
    const scaledCanvasHeight = parseInt(this.canvas.style.height, 10);

    let x = scaledCanvasWidth * 0.003;
    let y = scaledCanvasHeight * 0.005;

    let v = {
      x: ((Math.random() * x) + x) * this.randomSign,
      y: ((Math.random() * y) + y) * -1
    };

    console.log(v);

    return v;
  }

  nextCard() {
    const foundations = this.foundations;
    // randomly choose foundation & pick top card off it

    let randomFoundationIndex = Math.floor(Math.random() * foundations.length);
    let f = foundations[randomFoundationIndex];

    while (!f.hasCards) {
      randomFoundationIndex = Math.floor(Math.random() * foundations.length);
      f = foundations[randomFoundationIndex];

      // if no more cards left, return a falsy value
      if (!this.hasCards) {
        return;
      }
    }

    let card = f.lastCard;

    // detatch card
    card.parent.child = null;
    card.parent = null;

    // give random speed; `card` is an Object, so can assign
    // arbitrary properties
    card.velocity = this.randomVelocity;

    return card;
  }

  update() {
    const scaledCanvasWidth = parseInt(this.canvas.style.width, 10);
    const scaledCanvasHeight = parseInt(this.canvas.style.height, 10);

    // pick next card if the existing one goes off screen
    if (this.currentlyFallingCard.x + this.currentlyFallingCard.width < 0 || this.currentlyFallingCard.x > scaledCanvasWidth) {
      this.currentlyFallingCard = this.nextCard();
    }

    let currentlyFallingCard = this.currentlyFallingCard;

    // If we can't get the next card, that means we're out
    if (!currentlyFallingCard) {
      this.stop();

      return;
    }

    this.context.drawImage(currentlyFallingCard.image, currentlyFallingCard.x, currentlyFallingCard.y, currentlyFallingCard.width, currentlyFallingCard.height);

    // determine next position
    currentlyFallingCard.x += currentlyFallingCard.velocity.x;
    currentlyFallingCard.y += currentlyFallingCard.velocity.y;

    // don't let the card go below the bottom edge of the screen
    // TODO: this currently is broken for hidpi screens; canvas is actually 3x
    if (currentlyFallingCard.y + currentlyFallingCard.height > scaledCanvasHeight) {
      currentlyFallingCard.y = scaledCanvasHeight - currentlyFallingCard.height;

      // "bounce" the card
      currentlyFallingCard.velocity.y = -currentlyFallingCard.velocity.y * 0.85;
    }

    // update card velocity w/ "gravity" acceleration
    currentlyFallingCard.velocity.y += scaledCanvasHeight * 0.001; // 0.1%
  }

  get hasCards() {
    return this.foundations.some(f => f.hasCards);
  }

  start() {
    this.interval = window.setInterval(() => this.update(), 16);
  }

  stop() {
    window.clearInterval(this.interval);

    console.log('running waterfall callback');

    this.callback();
  }
}
