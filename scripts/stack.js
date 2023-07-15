class Stack {
  x = 0;
  y = 0;
  width = 75;
  height = 100;
  child = null;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get hasCards() {
    return !!this.child;
  }
}
