# Solitaire

HTML/CSS(?)/JS implementation of Solitaire. Using the classic Windows version as inspiration.

![falling cards](https://github.com/endemic/solitaire/blob/1fbe19005b8a621961f3402878898fdda7ccd470/images/falling_cards.gif)

## Implementation brainstorm

* The main decision is whether to render the entire game using a `<canvas>` element, or render using the DOM
* Considerations: I _need_ to make the "falling card" ending for when you win the game. The best way to do that would be to draw images to a `<canvas>` without clearing it on each frame, which would result in the trail of cards. I can't think of a way to re-create the effect in the DOM without generating a shitload of nodes, which would be terrible for performance.
* ~~Probably my first step is to make the falling card ending as a demo, as that is what I consider the most important feature.~~ I could try to tweak the end result to get the graphics to look as sharp as I want. Perhaps using SVG instead of bitmap graphics would work.
* if using `<canvas>`, one primary consideration would be how to scale the game table for various viewports; perhaps allowing pan/scroll/zoom.


- [x] I have a falling card demo, but the movement doesn't look quite right; have to play the actual game and record the real thing in order to compare
- [x] View the demo on an actual phone -- looks OK, aspect ratio in landscape isn't quite right, so the user would have to pan in order to see the whole


## TODO

- [x] Create a card dragging demo -- set up the game board with seven action piles and four play piles; simulate dragging a card between these areas and having it "snap" in place
- [x] get the proportions right, and see how playable it is on a smaller phone in portrait mode
  * can possibly make the cards a bit larger (currently 75x100)
- [ ] placeholder images for card fronts
- [ ] draw cards in piles offset
- [ ] allow picking up cards in piles
