class Stack {
  x = 0;
  y = 0;
  width = 75;
  height = 100;
  child = null;
  type = 'stack';

  constructor(type, x, y) {
    this.type = type
    this.x = x;
    this.y = y;
  }

  get hasCards() {
    return !!this.child;
  }

  toString() {
    return `${this.type} stack`;
  }
}
