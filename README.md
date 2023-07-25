# Solitaire

JavaScript/`<canvas>` implementation of Klondike Solitaire. With apologies to Wes Cherry.

![falling cards](https://github.com/endemic/solitaire/blob/1fbe19005b8a621961f3402878898fdda7ccd470/images/falling_cards.gif)

## TODO

- [ ] Check for win condition
- [ ] Add "falling cards" after a win condition
- [ ] Complete card designs
- [x] Double-tap a card to automatically play it on a valid foundation
  * lol sorry mobile chrome
- [ ] Make a single card image sprite sheet, rather than loading 52 individual images
- [x] Add "undo" feature
  * basically have to store the card that was moved, and the previous parent/child values, in a list that can be popped
- [x] BUG: collision for grabbing a card extends too far to the right (x-axis); e.g. you can grab a card on a pile to the left even though it looks like you're on a different pile
- [ ] BUG: possible race condition when double-clicking the last card in a pile to play it
