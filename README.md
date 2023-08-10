# Solitaire

JavaScript/`<canvas>` implementation of Klondike Solitaire. With apologies to Wes Cherry.

![falling cards](https://github.com/endemic/solitaire/blob/1fbe19005b8a621961f3402878898fdda7ccd470/images/falling_cards.gif)

## TODO

- [x] Check for win condition
- [x] Add "falling cards" after a win condition
- [ ] Finalize falling cards such that game prompts for new game when it's over
  - [ ] TEMP: just re-initialize game after falling card ending
- [ ] Dynamically size the `<canvas>` such that it takes up all available width/height
- [ ] Complete card designs
- [ ] integrate double-click functionality into `onDown` handler, by setting an `isDouble` flag
  -> otherwise rapidly clicking on the talon registers a double-click, which isn't desired behavior
- [ ] Make a single card image sprite sheet, rather than loading 52 individual images
- [ ] BUG: `touchedStack` function will sometimes return the actual stack instead of child cards
  -> possibly fixed with guard
  ```javascript
  if (!stack.child) {
    return false;
  }
  ```
  ```
  Uncaught TypeError: grabbed.parent is undefined
    onDown http://localhost:8000/scripts/game.js:401
    onDown http://localhost:8000/scripts/game.js:386
    klondike http://localhost:8000/scripts/game.js:582
  ```
- [ ] add flipping cards from talon -> waste to the undo stack
- [ ] Add 3 card draw option
