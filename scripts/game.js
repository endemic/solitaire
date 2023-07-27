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
  let grabbed = null;

  // record the cursor offset where the card was picked up,
  // so clicking the card doesn't cause it to "jump" to the cursor
  let grabOffset = {x: 0, y: 0};

  // initialize all places where a card can be placed - https://en.wikipedia.org/wiki/Glossary_of_patience_terms

  // "talon" (draw pile)
  // placed in the upper left hand corner
  let talon = new Stack('talon', margin, margin);

  // "waste" (play stack)
  // placed relative to the talon
  let waste = new Stack('waste', talon.x + cardWidth + margin, talon.y);

  // 4 "foundations"
  // aligned vertically with talon/waste, on right side of tableau
  let foundations = [];
  for (let i = 0; i < 4; i += 1) {
    foundations.push(new Stack('foundation', width - (cardWidth * (i + 1)) - (margin * (i + 1)), margin));
  }

  // 7 "piles"
  // spans the width of the tableau, under the talon/waste/foundations
  let piles = [];
  for (let i = 0; i < 7; i += 1) {
    piles.push(new Stack('pile', cardWidth * i + (margin * (i + 1)), cardHeight + margin * 2));
  }

  // given a "card" object with properties {x, y, child},
  // draw the card and all the cards under it
  const drawCardStack = (card, x, y) => {
    card.x = x;
    card.y = y;

    context.drawImage(card.image, card.x, card.y);

    let offset = overlapOffset;

    // if cards in play piles are still face down, draw them closer together
    if (!card.faceUp) {
      // TODO: extract this magic number
      offset = 3;
    }

    if (card.child) {
      drawCardStack(card.child, x, y + offset);
    }
  };


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

    let lastCard = getLastCard(piles[j]);

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
    let parent = getLastCard(talon);

    parent.child = card;
    card.parent = parent;
  }

  // TODO: probably change this function name to `draw`
  const update = () => {
    // clear previous contents
    context.clearRect(0, 0, width, height);

    // draw card piles
    drawTalon();
    drawWaste();
    foundations.forEach(f => drawFoundation(f));
    piles.forEach(p => drawPile(p));

    // draw any cards currently being moved by player
    drawGrabbed();
  };

  const drawTalon = () => {
    if (!talon.hasCards) {
      context.drawImage(IMAGES['backs_target'], talon.x, talon.y);

      return;
    }

    let card = talon.child;
    let drawnCards = 0;
    let cardCount = 0;
    let offset = {x: 0, y: 0};

    while (card) {
      // go thru list of cards; for each 8, draw the next one at an offset
      if (Math.floor(cardCount / 8) === drawnCards) {
        drawnCards += 1;

        // ensure card has correct coordinates
        card.x = talon.x + offset.x;
        card.y = talon.y + offset.y;

        context.drawImage(card.image, card.x, card.y);

        // update offset for next card
        offset.x += 2;
        offset.y += 1;
      }

      cardCount += 1;
      card = card.child;
    }
  };

  const drawWaste = () => {
    if (!waste.hasCards) {
      context.drawImage(IMAGES['backs_target'], waste.x, waste.y);

      return;
    }

    let card = waste.child;
    let drawnCards = 0;
    let cardCount = 0;
    let offset = {x: 0, y: 0};

    while (card) {
      // ensure each card has correct coordinates
      card.x = waste.x + offset.x;
      card.y = waste.y + offset.y;

      // go thru list of cards; for each 8, draw the next one at an offset
      if (Math.floor(cardCount / 8) > drawnCards) {
        drawnCards += 1;

        context.drawImage(card.image, card.x, card.y);

        // update offset for next card
        offset.x += 2;
        offset.y += 1;
      }

      // ensure the last card on the stack is drawn
      if (!card.child) {
        context.drawImage(card.image, card.x, card.y);
      }

      cardCount += 1;
      card = card.child;
    }
  };

  const drawFoundation = f => {
    if (!f.hasCards) {
      context.drawImage(IMAGES['backs_target'], f.x, f.y);

      return;
    }

    let card = getLastCard(f);

    card.x = f.x;
    card.y = f.y;

    // only draw the top-most card
    context.drawImage(card.image, card.x, card.y);
  };

  const drawPile = p => {
    if (!p.hasCards) {
      context.drawImage(IMAGES['backs_target'], p.x, p.y);

      return;
    }

    let card = p.child;

    card.x = p.x;
    card.y = p.y

    drawCardStack(card, card.x, card.y);
  };

  const drawGrabbed = () => {
    if (!grabbed) {
      return;
    }

    // position of top grabbed card is updated in the `onMove` handler

    drawCardStack(grabbed, grabbed.x, grabbed.y);
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
  update();

  // Event handlers
  const onDown = e => {
    e.preventDefault();

    let point = getCoords(e);

    // if player clicks the talon
    if (touchedCard(point, talon)) {
      if (talon.hasCards) {
        let card = getLastCard(talon);
        let target = getLastCard(waste);

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
          let card = getLastCard(waste);
          let target = getLastCard(talon);

          card.faceUp = false;

          card.parent.child = null;
          card.parent = target;
          target.child = card;

          // TODO: possible to undo this operation?
        }
      }
    }

    // if player clicks the waste pile
    // "grab" the top-most card
    if (touchedCard(point, waste) && waste.hasCards) {
      canvas.style.cursor = 'grabbing';

      grabbed = getLastCard(waste);

      // remove card from "waste" list
      grabbed.parent.child = null;

      grabOffset = {
        x: point.x - grabbed.x,
        y: point.y - grabbed.y
      };
    }

    // allow player to pick cards back up off the foundations if needed
    foundations.forEach(f => {
      if (touchedCard(point, f) && f.hasCards) {
        grabbed = getLastCard(f);

        // remove card from "foundation" list
        grabbed.parent.child = null;

        grabOffset = {
          x: point.x - grabbed.x,
          y: point.y - grabbed.y
        };
      }
    });

    // check for picking up cards on play piles
    piles.forEach(p => {
      let card = touchedStack(point, p);

      // if player touched a card
      if (card) {
        canvas.style.cursor = 'grabbing';

        if (!card.faceUp) {
          card.faceUp = true;
        }

        grabbed = card;

        // break the parent -> child connection so the card(s) are no longer drawn at the source
        // but keep the parent <- child connection until card(s) are dropped
        grabbed.parent.child = null;

        grabOffset = {
          x: point.x - grabbed.x,
          y: point.y - grabbed.y
        };
      }
    });

    // this should really be called `draw`
    update();
  };

  const onMove = e => {
    e.preventDefault();

    if (!grabbed) {
      return;
    }

    let {x, y} = getCoords(e);

    // move the card along with the touch/cursor
    grabbed.x = x - grabOffset.x;
    grabbed.y = y - grabOffset.y;

    update();
  };

  const onUp = e => {
    e.preventDefault();

    let point = getCoords(e);

    // if not holding a card, then there's nothing to do
    if (!grabbed) {
      return;
    }

    canvas.style.cursor = 'grab';

    // check if current position of card overlaps
    // any playable area; if so, move to that location

    let valid = false;

    // check to see if card can be played on foundations
    foundations.forEach(f => {
      if (touchedCard(point, f)) {
        let target = getLastCard(f);

        valid = validFoundationPlay(grabbed, target)

        if (valid) {
          undoStack.push({
            card: grabbed,
            target: target,
            parent: grabbed.parent
          });

          target.child = grabbed;
          grabbed.parent = target;
        }
      }
    });

    // check to see if card can be played on piles
    piles.forEach(p => {
      if (touchedStack(point, p)) {
        let target = getLastCard(p);

        valid = validPilePlay(grabbed, target);

        if (valid) {
          undoStack.push({
            card: grabbed,
            target: target,
            parent: grabbed.parent
          });

          target.child = grabbed;
          grabbed.parent = target;
        }
      }
    });

    // if no valid play was made
    if (!valid) {
      // put the card back where it was
      // we do this by re-establishing the link from the parent -> child,
      // so the parent object (waste, pile, etc.) will have a link to the child again
      grabbed.parent.child = grabbed;
    }

    // "release" reference to card
    grabbed = null;

    update();

    if (checkWin()) {
      interval = fallingCards(canvas, foundations);
    }
  };

  // allow double click/tap to auto-play cards
  const onDouble = e => {
    e.preventDefault();

    let point = getCoords(e);

    // play directly from the waste pile
    if (touchedCard(point, waste) && waste.hasCards) {
      let card = getLastCard(waste);

      // determine if card can be played on one of the foundation stacks
      for (let i = foundations.length - 1; i >= 0; i -= 1) {
        let f = foundations[i];
        let target = getLastCard(f);
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
        let card = getLastCard(p);

        // determine if that same card can be played on one of the foundation stacks
        for (let i = foundations.length - 1; i >= 0; i -= 1) {
          let f = foundations[i];
          let target = getLastCard(f);
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

    update();

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

  canvas.addEventListener('dblclick', onDouble);

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

    update();
  });
};
