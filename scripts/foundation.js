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
}