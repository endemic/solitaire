class Talon extends Stack {
  constructor(x, y) {
    super('talon', x, y);
  }

  draw(context) {
    if (!this.hasCards) {
      context.drawImage(IMAGES['backs_target'], this.x, this.y);

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

        context.drawImage(card.image, card.x, card.y);

        // update offset for next card
        // TODO: extract these magic numbers
        offset.x += 2;
        offset.y += 1;
      }

      count += 1;
      card = card.child;
    }
  }
}