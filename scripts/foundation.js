class Foundation extends Stack {
  constructor(x, y) {
    super('foundation', x, y);
  }

  draw(context) {
    if (!this.hasCards) {
      context.drawImage(IMAGES['backs_target'], this.x, this.y);

      return;
    }

    let card = this.lastCard;

    card.x = this.x;
    card.y = this.y;

    // only draw the top-most card
    context.drawImage(card.image, card.x, card.y);
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
  };

}
