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
    // TODO: generate these values based on width/height of overall canvas
    let v = {
      x: (Math.random() * 5 + 5) * this.randomSign,
      y: -Math.random() * 4 + 3
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
    // start a new card if one hasn't been set
    // start a new card if the existing one goes off screen
    if (this.currentlyFallingCard.x + this.currentlyFallingCard.width < 0 || this.currentlyFallingCard.x > this.canvas.width) {
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
    if (currentlyFallingCard.y + currentlyFallingCard.height > this.canvas.height) {
      currentlyFallingCard.y = this.canvas.height - currentlyFallingCard.height;

      // "bounce" the card
      currentlyFallingCard.velocity.y = -currentlyFallingCard.velocity.y * 0.8;
    }

    // update card velocity w/ "gravity" acceleration
    // TODO: base this on overall height of canvas
    currentlyFallingCard.velocity.y += 0.75;
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
