const SUITES = ['hearts', 'diamonds', 'spades', 'clubs'];
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];

const IMG_SRC = [
  'images/backs/one.png',
  'images/backs/target.png',

  // 'images/hearts/ace.png',
  // 'images/hearts/two.png',
  // 'images/hearts/three.png',
  'images/hearts/four.png',
  // 'images/hearts/five.png',
  // 'images/hearts/six.png',
  // 'images/hearts/seven.png',
  // 'images/hearts/eight.png',
  // 'images/hearts/nine.png',
  // 'images/hearts/ten.png',
  // 'images/hearts/jack.png',
  // 'images/hearts/queen.png',
  // 'images/hearts/king.png',

  // 'images/diamonds/ace.png',
  'images/diamonds/two.png',
  'images/diamonds/three.png',
  // 'images/diamonds/four.png',
  // 'images/diamonds/five.png',
  // 'images/diamonds/six.png',
  // 'images/diamonds/seven.png',
  // 'images/diamonds/eight.png',
  // 'images/diamonds/nine.png',
  'images/diamonds/ten.png',
  // 'images/diamonds/jack.png',
  // 'images/diamonds/queen.png',
  // 'images/diamonds/king.png',

  // 'images/spades/ace.png',
  'images/spades/two.png',
  // 'images/spades/three.png',
  // 'images/spades/four.png',
  // 'images/spades/five.png',
  // 'images/spades/six.png',
  // 'images/spades/seven.png',
  // 'images/spades/eight.png',
  // 'images/spades/nine.png',
  // 'images/spades/ten.png',
  // 'images/spades/jack.png',
  // 'images/spades/queen.png',
  // 'images/spades/king.png',

  // 'images/clubs/ace.png',
  'images/clubs/two.png',
  // 'images/clubs/three.png',
  // 'images/clubs/four.png',
  'images/clubs/five.png',
  // 'images/clubs/six.png',
  // 'images/clubs/seven.png',
  // 'images/clubs/eight.png',
  // 'images/clubs/nine.png',
  // 'images/clubs/ten.png',
  // 'images/clubs/jack.png',
  // 'images/clubs/queen.png',
  // 'images/clubs/king.png',
];

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
  // key is in format `suite_rank` -- probably a better way to do this
  let key = src.match(/(?<=images\/)\w+\/\w+/)[0].replace('/','_');

  IMAGES[key] = new Image();
  IMAGES[key].src = src;
  IMAGES[key].addEventListener('load', onImageLoad);
});

const klondike = e => {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');

  // TODO: determine the necessary max width/height based on screenshots of the old game
  // cards are 71x96px
  // margin between cards horizontally is 16px
  // margin between cards vertically is 6px

  // we could do 75x100px cards
  // 10px margin both horizontally & vertically
  // 525px total width of all cards
  // 80px (8 * 10px) horizontal margin

  // 605px max width
  // at 4:3 aspect ratio, that makes height 454px
  // is that a viable size?

  const margin = 10;
  const width = 605;
  const height = 454;
  const cardWidth = 75;
  const cardHeight = 100;
  const overlapOffset = 18;

  // initialize all places where a card can be placed - https://en.wikipedia.org/wiki/Glossary_of_patience_terms

  // "talon" (draw pile)
  // placed in the upper left hand corner
  let talon = new Stack(margin, margin);

  // "waste" (play stack)
  // placed relative to the talon
  let waste = new Stack(talon.x + cardWidth + margin, talon.y);

  // 4 "foundations"
  // aligned vertically with talon/waste, on right side of tableau
  let foundations = [];
  for (let i = 0; i < 4; i += 1) {
    foundations.push(new Stack(width - (cardWidth * (i + 1)) - (margin * (i + 1)), margin));
  }

  // 7 "piles"
  // spans the width of the tableau, under the talon/waste/foundations
  let piles = [];
  for (let i = 0; i < 7; i += 1) {
    piles.push(new Stack(cardWidth * i + (margin * (i + 1)), cardHeight + margin * 2));
  }

  const touchedCard = (point, card) => {
    return point.x > card.x &&
        point.x < card.x + cardWidth &&
        point.y > card.y &&
        point.y < card.y + cardHeight;
  };

  // return the card in a stack of cards that was touched
  const touchedStack = (point, stack) => {
    if (!stack.hasCards) {
      return;
    }

    let card = stack.child;

    do {
      // cards under other cards only have 18px (`overlapOffset`) of touchable space
      let height = card.child ? overlapOffset : cardHeight;

      if (point.x > card.x && point.x < card.x + cardWidth &&
          point.y > card.y && point.y < card.y + height &&
          // only allow face up cards, or face down cards with no cards on top
          (card.faceUp || !card.child)) {
          return card;
        }

      // look at the next card
      card = card.child;
    } while (card);
  };


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
      x: event.x - event.target.offsetLeft,
      y: event.y - event.target.offsetTop
    }
  };

  // expect the argument passed to this function to be an
  // object with a `child` property
  const getLastCard = card => {
    let last = card;
    let count = 0;

    while (last.child) {
      last = last.child;

      // TODO: remove this eventually
      if (count++ > 100) {
        throw new Error('Invalid parent/child card link.');
      }
    }

    return last;
  };

  const countStack = stack => {
    let count = 0;
    let parent = stack;

    while (parent.child) {
      count += 1;
      parent = parent.child;
    }

    return count;
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
  // SUITES.forEach(suite => {
  //   RANKS.forEach(rank => {
  //     let card = new Card(rank, suite, IMAGES);

  //     // put all cards face down in the talon
  //     card.x = talon.x;
  //     card.y = talon.y;

  //     talon.cards.push(card);
  //   });
  // });


  // initialize deck
  const DECK = [];

  for (let i = 0; i < 52; i += 1) {
    DECK.push(new Card('four', 'hearts', IMAGES));
  }

  DECK.shuffle();

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
    let x = talon.x;
    let y = talon.y;
    let offset = {x: 0, y: 0};

    while (card) {
      // go thru list of cards; for each 8, draw the next one at an offset
      if (Math.floor(cardCount / 8) === drawnCards) {
        drawnCards += 1;

        // ensure card has correct coordinates
        card.x = x + offset.x;
        card.y = y + offset.y;

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

    let card = getLastCard(waste);
    let cardCount = countStack(waste);

    // console.log(`${cardCount} cards in waste`);

    card.x = waste.x;
    card.y = waste.y;

    // only need to draw the card on top; the rest are hidden underneath
    // TODO: with three card draw, we'll have to draw 3 cards offset
    context.drawImage(card.image, card.x, card.y);
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

  // bool whether a card has been picked up or not
  let grabbed = null;

  // record the cursor offset where the card was picked up,
  // so clicking the card doesn't cause it to "jump" to the cursor
  let grabOffset = {x: 0, y: 0};

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
        let newParent = getLastCard(waste);

        card.faceUp = true;

        // TODO: perhaps extract this kinda weird logic?
        // break from the previous "parent" card
        card.parent.child = null;

        // set the new parent
        card.parent = newParent;

        // set the new child
        newParent.child = card;
      } else {
        // move waste back onto the talon
        // last child card in the waste is the first child card in the talon
        // also need to set `card.faceUp = false`
        while (waste.hasCards) {
          // note this is inverse of previous condition
          let card = getLastCard(waste);
          let newParent = getLastCard(talon);

          card.faceUp = false;

          card.parent.child = null;
          card.parent = newParent;
          newParent.child = card;
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
        valid = true;

        let last = getLastCard(f);
        last.child = grabbed;
        grabbed.parent = last;
      }
    });

    // check to see if card can be played on piles
    piles.forEach(p => {
      if (touchedStack(point, p)) {
        let last = getLastCard(p);

        // card has to be face up to play on
        if (last.faceUp) {
          valid = true;
          last.child = grabbed;
          grabbed.parent = last;
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
  };

  canvas.addEventListener('mousedown', onDown);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onUp);

  canvas.addEventListener('touchstart', onDown);
  canvas.addEventListener('touchmove', onMove);
  canvas.addEventListener('touchend', onUp);
};
