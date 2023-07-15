class Card {
  faceUp = false;
  x = 0;
  y = 0;
  width = 75;
  height = 100;
  backImg = null;
  frontImg = null;
  suite = null;
  rank = null;

  // TODO: figure out a way to link stacked cards together
  parent = null;
  child = null;

  constructor(rank, suite, images) {
    this.rank = rank;
    this.suite = suite;

    this.backImg = images['backs_one'];
    this.frontImg = images[`${this.suite}_${this.rank}`];
  }

  get image() {
    if (this.faceUp) {
      return this.frontImg;
    }

    return this.backImg;
  }
}
