const SUITS = ['hearts', 'diamonds', 'spades', 'clubs'];
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];

const IMG_SRC = [
  'images/backs/one.png',
  'images/backs/target.png',

  'images/hearts/ace.png',
  'images/hearts/two.png',
  'images/hearts/three.png',
  'images/hearts/four.png',
  'images/hearts/five.png',
  'images/hearts/six.png',
  'images/hearts/seven.png',
  'images/hearts/eight.png',
  'images/hearts/nine.png',
  'images/hearts/ten.png',
  'images/hearts/jack.png',
  'images/hearts/queen.png',
  'images/hearts/king.png',

  'images/diamonds/ace.png',
  'images/diamonds/two.png',
  'images/diamonds/three.png',
  'images/diamonds/four.png',
  'images/diamonds/five.png',
  'images/diamonds/six.png',
  'images/diamonds/seven.png',
  'images/diamonds/eight.png',
  'images/diamonds/nine.png',
  'images/diamonds/ten.png',
  'images/diamonds/jack.png',
  'images/diamonds/queen.png',
  'images/diamonds/king.png',

  'images/spades/ace.png',
  'images/spades/two.png',
  'images/spades/three.png',
  'images/spades/four.png',
  'images/spades/five.png',
  'images/spades/six.png',
  'images/spades/seven.png',
  'images/spades/eight.png',
  'images/spades/nine.png',
  'images/spades/ten.png',
  'images/spades/jack.png',
  'images/spades/queen.png',
  'images/spades/king.png',

  'images/clubs/ace.png',
  'images/clubs/two.png',
  'images/clubs/three.png',
  'images/clubs/four.png',
  'images/clubs/five.png',
  'images/clubs/six.png',
  'images/clubs/seven.png',
  'images/clubs/eight.png',
  'images/clubs/nine.png',
  'images/clubs/ten.png',
  'images/clubs/jack.png',
  'images/clubs/queen.png',
  'images/clubs/king.png',
];

const margin = 10;
const width = 605;
const height = 454;
const cardWidth = 75;
const cardHeight = 100;
const overlapOffset = 18;
