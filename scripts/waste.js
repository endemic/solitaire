import Stack from './stack.js';

export default class Waste extends Stack {
  visibleCards = 3;

  constructor(x, y) {
    super('waste', x, y);
  }

  draw(context) {
    if (!this.hasCards) {
      return;
    }

    let card = this.child;
    let drawnCards = 0;
    let count = 0;
    let offset = {x: 0, y: 0};

    // to handle 3 card draw, we can't just show the last three;
    // it has to be the _n_ most recent cards off the talon
    // the player can play down that number, and then they
    // see a regular 1 card wide waste

    // perhaps set an instance variable on the waste, based on how many cards
    // were flipped from the talon

    // this could be decremented as the player plays down visible cards

    // note that we need to only allow the top card to be selected/played

    card = this.lastCard;

    // go back up the stack _n_ cards
    for (let i = 0; i < this.visibleCards - 1; i += 1) {
      card = card.parent
    }

    // now can draw
    while (card) {
      card.x = this.x + offset.x;
      card.y = this.y + offset.y;

      context.drawImage(card.image, card.x, card.y);

      // update offset for the next card
      offset.x += 16;
      offset.y += 1;

      card = card.child;
    }

    // TODO: draw blank cards underneath the pile
    // based on how many cards are currently in the waste

    return;

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
}
