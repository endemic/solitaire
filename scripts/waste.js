import Stack from './stack.js';

export default class Waste extends Stack {
  constructor() {
    super('waste');
  }

  draw(context) {
    if (!this.hasCards) {
      return;
    }

    let card = this.child;
    let drawnCards = 0;
    let count = 0;
    let offset = {x: 0, y: 0};

    while (card) {
      // ensure each card has correct coordinates
      card.x = this.x + offset.x;
      card.y = this.y + offset.y;

      // go thru list of cards; for each 8, draw the next one at an offset
      if (Math.floor(count / 8) > drawnCards) {
        drawnCards += 1;

        context.drawImage(card.image, card.x, card.y, card.width, card.height);

        // update offset for next card
        offset.x += this.cardOffset / 8;
        offset.y += this.cardOffset / 12;
      }

      // ensure the last card on the stack is drawn
      if (!card.child) {
        context.drawImage(card.image, card.x, card.y, card.width, card.height);
      }

      count += 1;
      card = card.child;
    }
  }

  get size() {
    let height = this.height;
    let width = this.width;

    return { width, height };
  }
}
