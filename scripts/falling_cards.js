export const fallingCards = (canvas, foundations) => {
  const context = canvas.getContext('2d');

  // local variables used to hold reference to moving card,
  // as well as its speed (cards normally only store their (x,y) position)
  let movingCard;

  // not truly "random" -- weighted to negative, so cards have a
  // tendancy to fall to the left (where they can be visible for longer)
  const randomSign = () => Math.random() > 0.7 ? 1 : -1;

  // assign a random speed to a falling card
  const randomVelocity = () => {
    let v = {
      x: (Math.random() * 4 + 1) * randomSign(),
      y: -Math.random() * 4 + 3
    };

    // TODO: figure out best velocity range
    console.log(v);

    return v;
  };

  const getNextFallingCard = () => {
    // randomly choose foundation
    // pick top card off it
    // TODO: ensure that each foundation is picked fairly equally
    let f = foundations[Math.floor(Math.random() * foundations.length)];

    let card = f.lastCard;

    // detatch card
    card.parent.child = null;
    card.parent = null;

    // give random speed; `card` is an Object, so can assign
    // arbitrary properties
    card.velocity = randomVelocity();

    return card;
  };

  const animate = () => {
    // start a new card if one hasn't been set
    // start a new card if the existing one goes off screen
    if (!movingCard || movingCard.x + movingCard.width < 0 || movingCard.x > canvas.width) {
      movingCard = getNextFallingCard();
    }

    context.drawImage(movingCard.image, movingCard.x, movingCard.y, movingCard.width, movingCard.height);

    // determine next position
    movingCard.x += movingCard.velocity.x;
    movingCard.y += movingCard.velocity.y;

    // don't let the card go below the bottom edge of the screen
    if (movingCard.y + movingCard.height > canvas.height) {
      movingCard.y = canvas.height - movingCard.height;

      // "bounce" the card
      movingCard.velocity.y = -movingCard.velocity.y * 0.8;
    }

    // update card velocity w/ "gravity" acceleration
    movingCard.velocity.y += 0.75;
  };

  return window.setInterval(animate, 16);
};
