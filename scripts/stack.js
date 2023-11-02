export default class Stack {
  child = null;

  constructor(type, x, y) {
    this.type = type
    this.x = x;
    this.y = y;
  }

  get hasCards() {
    return this.child !== null;
  }

  get lastCard() {
    let last = this;
    let count = 0;

    while (last?.child) {
      last = last.child;

      // TODO: remove this eventually
      if (count++ > 50) {
        throw new Error('Invalid parent/child card link.');
      }
    }

    return last;
  }

  toString() {
    return `${this.type} stack`;
  }

  draw(context) {
    if (!this.hasCards) {
      return;
    }

    let card = this.child;
    let x = this.x;
    let y = this.y;

    do {
      // ensure correct location
      card.x = x;
      card.y = y;

      context.drawImage(card.image, card.x, card.y, card.width, card.height);

      // if cards in play piles are still face down, draw them closer together
      let offset = card.faceUp ? this.cardOffset : this.cardOffset / 4;

      // set up for next card (if necessary)
      y = y + offset;
      card = card.child;
    } while (card);
  }

  touched(point) {
    return point.x > this.x &&
        point.x < this.x + this.width &&
        point.y > this.y &&
        point.y < this.y + this.height;
  }

  // return the card in a stack of cards that was touched
  // this method is also used for general collision detection
  // (e.g. if player dropped card[s] over a stack)
  touchedStack(point) {
    if (!this.hasCards) {
      return this.touched(point);
    }

    let card = this;

    do {
      // cards under other cards only have `cardOffset` of touchable space
      let height = card.child ? this.cardOffset : card.height;

      if (point.x > card.x && point.x < card.x + card.width &&
          point.y > card.y && point.y < card.y + height &&
          // only allow face up cards, or face down cards with no cards on top
          (card.faceUp || !card.child)) {
          return card;
      }

      // look at the next card
      card = card.child;
    } while (card);

    return false;
  }
}
