import Stack from './stack.js';

export default class Talon extends Stack {
  constructor(targetImage) {
    super('talon');

    this.image = targetImage;
  }

  draw(context) {
    if (!this.hasCards) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);

      return;
    }

    let card = this.child;
    let drawnCards = 0;
    let count = 0;
    let offset = {x: 0, y: 0};

    while (card) {
      // go thru list of cards; for each 8, draw the next one at an offset
      if (Math.floor(count / 8) === drawnCards) {
        drawnCards += 1;

        // ensure card has correct coordinates
        card.x = this.x + offset.x;
        card.y = this.y + offset.y;

        context.drawImage(card.image, card.x, card.y, card.width, card.height);

        // update offset for next card
        offset.x += this.cardOffset / 8;
        offset.y += this.cardOffset / 12;
      }

      count += 1;
      card = card.child;
    }
  }
}
