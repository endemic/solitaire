class Card {
  faceUp = false;
  x = 0;
  y = 0;
  width = 75;
  height = 100;
  backImg = null;
  frontImg = null;
  suit = null;
  rank = null;

  parent = null;
  child = null;

  constructor(rank, suit, images) {
    this.rank = rank;
    this.suit = suit;

    this.backImg = images['backs_one'];
    this.frontImg = images[`${this.suit}_${this.rank}`];
  }

  get image() {
    if (this.faceUp) {
      return this.frontImg;
    }

    return this.backImg;
  }

  toString() {
    return `${this.rank} ${this.suit}`;
  }
}
