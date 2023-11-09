import Stack from './stack.js';

export default class Foundation extends Stack {
  constructor(targetImage) {
    super('foundation');

    this.image = targetImage;
  }

  draw(context) {
    if (!this.hasCards) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);

      return;
    }

    let card = this.lastCard;

    card.x = this.x;
    card.y = this.y;

    // only draw the top-most card
    context.drawImage(card.image, card.x, card.y, card.width, card.height);
  }

  validPlay(card) {
    const target = this.lastCard;

    // no other cards in the foundation, so (any suit) ace is allowed
    if (!target.parent && card.rank === 'ace') {
      return true;
    }

    // if there are cards already played, ensure they are the same suit
    // and the card rank is one higher than the target
    if (card.suit === target.suit && card.diff(target) === 1) {
      return true;
    }

    return false;
  }

  get size() {
    let height = this.height;
    let width = this.width;

    return { width, height };
  }
}
