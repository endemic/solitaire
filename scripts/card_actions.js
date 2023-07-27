// Various helper functions that handle user interaction

// returns `true` if touch/mouse event is over a card
const touchedCard = (point, card) => {
  return point.x > card.x &&
      point.x < card.x + card.width &&
      point.y > card.y &&
      point.y < card.y + card.height;
};

// return the card in a stack of cards that was touched
const touchedStack = (point, stack) => {
  let card = stack;

  do {
    // cards under other cards only have 18px (`overlapOffset`) of touchable space
    let height = card.child ? overlapOffset : card.height;

    if (point.x > card.x && point.x < card.x + card.width &&
        point.y > card.y && point.y < card.y + height &&
        // only allow face up cards, or face down cards with no cards on top
        (card.faceUp || !card.child)) {
        return card;
      }

    // look at the next card
    card = card.child;
  } while (card);
};

// convert global browser coordinates to canvas coordinates
const getCoords = event => {
  // need to scale the touches by the actual size of the canvas;
  // e.g. the canvas still thinks it is 605px wide even if it is
  // scaled to 400px by CSS rules
  const scale = event.target.width / event.target.clientWidth;

  if (event.changedTouches && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX * scale,
      y: event.changedTouches[0].clientY * scale
    };
  }

  // this seems to translate to <canvas> coordinates
  return {
    x: event.x * scale,
    y: event.y * scale
  }
};

// expect the argument passed to be a Card or Stack
// returns the last child card object
const getLastCard = card => {
  let last = card;
  let count = 0;

  while (last.child) {
    last = last.child;

    // TODO: remove this eventually
    if (count++ > 50) {
      throw new Error('Invalid parent/child card link.');
    }
  }

  return last;
};

// returns a - b; e.g. 5 - 2 = 3
// used to ensure sequential card placement
const rankDiff = (a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);

// returns true if (a, b) have different colors
const colorDiff = (a, b) => {
  return (['hearts', 'diamonds'].indexOf(a.suit) > -1 && ['clubs', 'spades'].indexOf(b.suit) > -1) ||
  (['hearts', 'diamonds'].indexOf(b.suit) > -1 && ['clubs', 'spades'].indexOf(a.suit) > -1);
}

const validFoundationPlay = (card, target) => {
  // no other cards in the foundation, so (any suit) ace is allowed
  if (!target.parent && card.rank === 'ace') {
    return true;
  }

  // if there are cards already played, ensure they are the same suit
  // and the card rank is one higher than the target
  if (card.suit === target.suit && rankDiff(card, target) === 1) {
    return true;
  }

  return false;
};

const validPilePlay = (card, target) => {
  // if no other cards in the pile, only kings are allowed
  if (!target.parent && card.rank === 'king') {
    return true;
  }

  // if there are cards already played, ensure they are alternating suits
  // and the card rank is one lower than the target
  // (and the target has to be face up, too)
  if (colorDiff(card, target) && rankDiff(card, target) === -1 && target.faceUp) {
    return true;
  }

  return false;
};
