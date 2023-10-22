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
