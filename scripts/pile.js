import Stack from './stack.js';

export default class Pile extends Stack {
  constructor(x, y) {
    super('pile', x, y);
  }

  validPlay (card) {
    const target = this.lastCard;

    // if no other cards in the pile, only kings are allowed
    if (!target.parent && card.rank === 'king') {
      return true;
    }

    // if there are cards already played, ensure they are alternating suits
    // and the card rank is one lower than the target
    // (and the target has to be face up, too)
    if (card.color !== target.color && card.diff(target) === -1 && target.faceUp) {
      return true;
    }

    return false;
  }
}
