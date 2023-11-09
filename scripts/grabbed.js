import Stack from './stack.js';

// Object attached to mouse/point move events,
// models holding & moving cards
export default class Grabbed extends Stack {
  // record the offset where the card was picked up,
  // so clicking/touching the card doesn't cause it to "jump"
  pointOffset = {x: 0, y: 0};

  constructor() {
    super('grabbed');
  }

  setOffset(point) {
    const card = this.child;

    this.pointOffset.x = point.x - card.x;
    this.pointOffset.y = point.y - card.y;
  }

  move(point) {
    this.x = point.x - this.pointOffset.x;
    this.y = point.y - this.pointOffset.y;
  }

  // returns true if the "grabbed" bounding box overlaps
  // the passed arg bounding box
  overlaps(stack) {
    // Calculate the sides of the boxes
    let left1 = stack.x;
    let right1 = stack.x + stack.size.width;
    let top1 = stack.y;
    let bottom1 = stack.y + stack.size.height;

    let left2 = this.x;
    let right2 = this.x + this.size.width;
    let top2 = this.y;
    let bottom2 = this.y + this.size.height;

    // Check for collisions
    if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
      return false; // No collision
    }

    return true; // Collision detected
  }
}
