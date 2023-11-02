export default class Card {
  faceUp = false;
  backImg = null;
  frontImg = null;
  suit = null;
  rank = null;

  parent = null;
  child = null;

  allRanks = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];

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

  get color() {
    if (this.suit === 'hearts' || this.suit === 'diamonds') {
      return 'red';
    }

    return 'black';
  }

  // returns this - b; e.g. 5 - 2 = 3
  // used to ensure sequential card placement
  diff(b) {
    return this.allRanks.indexOf(this.rank) - this.allRanks.indexOf(b.rank);
  }
}
