const IMAGES = {};
let loadedImageCount = 0;

const onImageLoad = e => {
  // TODO: display a progress bar or something
  loadedImageCount += 1;

  // this means we've got all our images in memory
  if (loadedImageCount === IMG_SRC.length) {
    // TODO: initialize the canvas before this, so a "loading" progress bar can be
    // displayed (or "Loading..." text)
    klondike();
  }
}

// enumerate over image sources, and load them into memory
IMG_SRC.forEach(src => {
  // key is in format `suit_rank` -- probably a better way to do this
  let key = src.match(/(?<=images\/)\w+\/\w+/)[0].replace('/','_');

  IMAGES[key] = new Image();
  IMAGES[key].src = src;
  IMAGES[key].addEventListener('load', onImageLoad);
});

const klondike = e => {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');

  const undoStack = [];

  // var to hold reference to grabbed card(s)
  const grabbed = new Stack('grabbed', 0, 0);

  // record the cursor offset where the card was picked up,
  // so clicking the card doesn't cause it to "jump" to the cursor
  const grabOffset = {x: 0, y: 0};

  // used for custom double-click/tap implementation
  // this val is set in `onDown` function; if it is called again rapidly
  // (e.g. within 500ms) then the interaction counts as a double-click
  let lastOnDownTimestamp = Date.now();

  // initialize all places where a card can be placed - https://en.wikipedia.org/wiki/Glossary_of_patience_terms

  // "talon" (draw pile)
  // placed in the upper left hand corner
  const talon = new Talon(margin, margin);

  // "waste" (play stack)
  // placed relative to the talon
  const waste = new Waste(talon.x + cardWidth + margin, talon.y);

  // 4 "foundations"
  // aligned vertically with talon/waste, on right side of tableau
  const foundations = [];
  for (let i = 0; i < 4; i += 1) {
    foundations.push(new Foundation(width - (cardWidth * (i + 1)) - (margin * (i + 1)), margin));
  }

  // 7 "piles"
  // spans the width of the tableau, under the talon/waste/foundations
  const piles = [];
  for (let i = 0; i < 7; i += 1) {
    piles.push(new Pile(cardWidth * i + (margin * (i + 1)), cardHeight + margin * 2));
  }

  // initialize deck
  const DECK = [];

  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      DECK.push(new Card(rank, suit, IMAGES));
    });
  });

  DECK.shuffle();

  // TEMP: put cards in foundations in order to test falling card demo
  // for (let i = 0; i < foundations.length; i += 1) {
  //   let target = foundations[i];

  //   for (let j = 0; j < 13; j += 1) {
  //     let card = DECK.shift();

  //     card.faceUp = true;
  //     card.x = target.x;
  //     card.y = target.y;

  //     card.parent = target;
  //     target.child = card;

  //     target = card;
  //   }
  // }

  // populate the playing piles
  // This is super janky -- there is probably a better way to do this
  // TODO: 100ms delay (or similar) between placing cards
  let faceUpIndex = 0;
  for (let i = 0; i < Math.pow(piles.length, 2); i += 1) {
    let j = i % piles.length;

    let lastCard = piles[j].lastCard;

    if (lastCard.faceUp) {
      continue;
    }

    let card = DECK.pop();

    if (i === faceUpIndex) {
      card.faceUp = true;
      faceUpIndex += piles.length + 1;
    }

    lastCard.child = card;
    card.parent = lastCard;
  }

  // put the rest of the cards in the talon
  while (DECK.length) {
    let card = DECK.pop();
    let parent = talon.lastCard;

    parent.child = card;
    card.parent = parent;
  }

  const draw = () => {
    // clear previous contents
    context.clearRect(0, 0, width, height);

    // draw card piles
    talon.draw(context);
    waste.draw(context);
    foundations.forEach(f => f.draw(context));
    piles.forEach(p => p.draw(context));

    // draw any cards currently being moved by player
    grabbed.draw(context);
  };

  const checkWin = () => {
    // ensure that each foundation has 13 cards; we
    // don't check for matching suit or ascending rank because
    // those checks are done when the card is laid down
    return foundations.every(f => {
      let count = 0;
      let parent = f;

      while (parent.child) {
        count += 1;
        parent = parent.child;
      }

      return count === 13;
    });
  };

  // initial draw
  draw();

  // Event handlers
  const onDown = e => {
    e.preventDefault();

    // let delta = Date.now() - lastOnDownTimestamp;
    // console.log(delta)
    // lastOnDownTimestamp = Date.now();

    // if (delta < DOUBLE_CLICK_MS) {
    //   onDouble(e);
    //   return;
    // }

    let point = getCoords(e);

    if (talon.touched(point)) {
      if (talon.hasCards) {
        let card = talon.lastCard;
        let target = waste.lastCard;

        card.faceUp = true;

        // TODO: perhaps extract this kinda weird logic?
        // break from the previous "parent" card
        card.parent.child = null;

        // set the new parent
        card.parent = target;
        target.child = card;

        undoStack.push({
          card: card,
          target: target,
          parent: card.parent
        });
      } else {
        // move waste back onto the talon
        // last child card in the waste is the first child card in the talon
        while (waste.hasCards) {
          // note this is inverse of previous condition
          let card = waste.lastCard;
          let target = talon.lastCard;

          card.faceUp = false;

          card.parent.child = null;
          card.parent = target;
          target.child = card;

          // TODO: possible to undo this operation?
        }
      }
    }

    // if player clicks the waste pile
    if (waste.touched(point) && waste.hasCards) {
      canvas.style.cursor = 'grabbing';

      // "grab" the top-most card
      let card = waste.lastCard;

      // remove card from "waste" list
      card.parent.child = null;

      // add to stack which player is "holding"
      grabbed.child = card;

      grabOffset.x = point.x - card.x;
      grabOffset.y = point.y - card.y;

      // move the card along with the touch/cursor
      grabbed.x = point.x - grabOffset.x;
      grabbed.y = point.y - grabOffset.y;
    }

    // allow player to pick cards back up off the foundations if needed
    foundations.forEach(f => {
      if (f.touched(point) && f.hasCards) {
        canvas.style.cursor = 'grabbing';

        let card = f.lastCard;

        // remove card from "foundation" list
        card.parent.child = null;

        // add to stack which player is "holding"
        grabbed.child = card;

        grabOffset.x = point.x - card.x;
        grabOffset.y = point.y - card.y;

        // move the card along with the touch/cursor
        grabbed.x = point.x - grabOffset.x;
        grabbed.y = point.y - grabOffset.y;
      }
    });

    // check for picking up cards on play piles
    piles.forEach(p => {
      let card = p.touchedStack(point);

      // if player touched a card
      if (card) {
        canvas.style.cursor = 'grabbing';

        if (!card.faceUp) {
          card.faceUp = true;
        }

        // break the parent -> child connection so the card(s) are no longer drawn at the source
        // but keep the parent <- child connection until card(s) are dropped
        card.parent.child = null;

        // add to stack which player is "holding"
        grabbed.child = card;

        grabOffset.x = point.x - card.x;
        grabOffset.y = point.y - card.y;

        // move the card along with the touch/cursor
        grabbed.x = point.x - grabOffset.x;
        grabbed.y = point.y - grabOffset.y;
      }
    });

    // this should really be called `draw`
    draw();
  };

  const onMove = e => {
    e.preventDefault();

    if (!grabbed.hasCards) {
      return;
    }

    let {x, y} = getCoords(e);

    // move the card along with the touch/cursor
    grabbed.x = x - grabOffset.x;
    grabbed.y = y - grabOffset.y;

    draw();
  };

  const onUp = e => {
    e.preventDefault();

    let point = getCoords(e);

    // if not holding a card, then there's nothing to do
    if (!grabbed.hasCards) {
      return;
    }

    canvas.style.cursor = 'grab';

    // check if current position of card overlaps
    // any playable area; if so, move to that location

    let valid = false;

    // check to see if card can be played on foundations
    foundations.forEach(f => {
      if (f.touched(point)) {
        let target = f.lastCard;
        let card = grabbed.child;

        valid = f.validPlay(card);

        if (valid) {
          undoStack.push({
            card,
            target,
            parent: card.parent
          });

          target.child = card;
          card.parent = target;
        }
      }
    });

    // check to see if card can be played on piles
    piles.forEach(p => {
      if (p.touchedStack(point)) {
        let target = p.lastCard;
        let card = grabbed.child;

        valid = p.validPlay(card);

        if (valid) {
          undoStack.push({
            card,
            target,
            parent: card.parent
          });

          target.child = card;
          card.parent = target;
        }
      }
    });

    // if no valid play was made
    if (!valid) {
      // put the card back where it was
      // we do this by re-establishing the link from the parent -> child,
      // so the parent object (waste, pile, etc.) will have a link to the child again
      let card = grabbed.child;

      card.parent.child = card;
    }

    // "release" reference to card
    grabbed.child = null;

    draw();

    if (checkWin()) {
      interval = fallingCards(canvas, foundations);
    }
  };

  // allow double click/tap to auto-play cards
  const onDouble = e => {
    let point = getCoords(e);

    // play directly from the waste pile
    if (touchedCard(point, waste) && waste.hasCards) {
      let card = waste.lastCard;

      // determine if card can be played on one of the foundation stacks
      for (let i = foundations.length - 1; i >= 0; i -= 1) {
        let f = foundations[i];
        let target = f.lastCard;
        let valid = validFoundationPlay(card, target);

        if (valid) {
          undoStack.push({
            card: card,
            target: target,
            parent: card.parent
          });

          // remove card from waste
          card.parent.child = null;

          // add to foundation stack
          target.child = card;
          card.parent = target;

          // made a valid play, no longer need to loop checking other foundation stacks
          break;
        }
      }
    }

    // after double click, check each pile
    for (let i = 0; i < piles.length; i += 1) {
      let p = piles[i];

      // if pile was double-clicked
      if (touchedStack(point, p)) {
        // find the last card on the pile
        let card = p.lastCard;

        // determine if that same card can be played on one of the foundation stacks
        for (let i = foundations.length - 1; i >= 0; i -= 1) {
          let f = foundations[i];
          let target = f.lastCard;
          let valid = validFoundationPlay(card, target);

          if (valid) {
            undoStack.push({
              card: card,
              target: target,
              parent: card.parent
            });

            // remove card from pile
            card.parent.child = null;

            // add to foundation stack
            target.child = card;
            card.parent = target;

            // made a valid play, no longer need to loop checking other foundation stacks
            break;
          }
        }
      }
    }

    draw();

    if (checkWin()) {
      interval = fallingCards(canvas, foundations);
    }
  };

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);

  canvas.addEventListener('touchstart', onDown);
  canvas.addEventListener('touchmove', onMove);
  canvas.addEventListener('touchend', onUp);

  window.addEventListener('keydown', e => {
    // return unless the keypress is meta/contrl + z (for undo)
    if (!(e.metaKey || e.ctrlKey) || e.key !== 'z') {
      return;
    }

    if (undoStack.length < 1) {
      console.log("Can't undo!");
      return;
    }

    // get card state _before_ the most recent move
    let {card, parent, target} = undoStack.pop();

    // remove destination
    target.child = null;

    // reset the original parent <-> child card link
    card.parent = parent;
    parent.child = card;

    draw();
  });
};
