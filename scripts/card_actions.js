// Various helper functions that handle user interaction

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
    x: event.x - event.target.offsetLeft,
    y: event.y - event.target.offsetTop
  }
};

// returns a - b; e.g. 5 - 2 = 3
// used to ensure sequential card placement
const rankDiff = (a, b) => RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);

// returns true if (a, b) have different colors
const colorDiff = (a, b) => {
  return (['hearts', 'diamonds'].indexOf(a.suit) > -1 && ['clubs', 'spades'].indexOf(b.suit) > -1) ||
  (['hearts', 'diamonds'].indexOf(b.suit) > -1 && ['clubs', 'spades'].indexOf(a.suit) > -1);
}
