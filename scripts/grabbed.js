import Stack from './stack.js';

// Object attached to mouse/point move events,
// models holding & moving cards
export default class Grabbed extends Stack {
  // record the offset where the card was picked up,
  // so clicking/touching the card doesn't cause it to "jump"
  pointOffset = {x: 0, y: 0};

  constructor(targetImage) {
    super('grabbed');
  }

  setOffset(point) {
    const card = this.child;

    this.pointOffset.x = point.x - card.x;
    this.pointOffset.y = point.y - card.y;

    // ensure the top-most card is in the right position
    card.x = this.x;
    card.y = this.y;
  }

  move(point) {
    this.x = point.x - this.pointOffset.x;
    this.y = point.y - this.pointOffset.y;
  }
}
