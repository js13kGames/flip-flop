# flip-flop #

flip-flop is a glitchy game about chip installation and sucking the last
possible volt out of a PCB. Built for an iPhone, it should run in most
browsers. High scores are sharable and accessibility is baked in. There
are blinky lights when you win, tributes when you lose, and the difficulty
is as hard as you make it. Have fun.

Made on a Mac for the [2016 js13kGames competition][js13k].

## Features ##

flip-flop has the following bits of awesomeness:

* play on any device with sweet scaling graphics
* get social bragging rights with tweetable high scores
* choose your own difficulty with dynamic starting layouts

## Credits ##

flip-flop is based on the solitaire variant of P.D. Magnus and Jack Neal's
[Decktet][] game [Jacynth][]. Chips function as cards, with colored LEDs for
the suits. The starting layout is left up to the player and the probability of
a chip changing when played is shown. Every fourth chip is automatically powered,
adding tension and removing a decision point.

### Technology ###

flip-flop uses a pseudo random number generator based on the one described in
the paper, _A New Class of Invertible Mappings_, by Alexander Klimov and Adi
Shamer.

### Graphics ###

All the graphics for flip-flop, with the exception of the GitHub Octocat and
Twitter Bird, are created with HTML5 and CSS3. The background graph paper is a
recolor of [Lea Verou's blueprint grid pattern][paper]. The PCB background is a
recolor of [Paul Salentiny's honeycomb pattern][hex]. The LEDs are based on
[F. Stephen Kirschbaum's CSS LED lights][leds]. The buttons are based on
[Sara Soueidan's soft button][button]. The sticky notes come from
[Chris Heilmann's tutorial][notes]. The glowing numbers are done in the
same neon that [Dudley Storey uses for his bar sign][neon]. The chips are my own
design.

### Colors ###

Colors for the LEDs where chosen from [Martin Krzywinski's notes on palettes for
color blindness][cbm]. You can switch them to letters by holding down the power
button until the LED blinks, then letting go.

### Help ###

[Sarah Mitchell][] provided useful feedback on color choices and pushed me to
make the reset button work all the time. She's the reason there's a delightful
ghost chip when you select an empty spot on the circuit board.

## Compatibility ##

flip-flop works in the following browsers:

* Firefox 48.0.2
* Chrome 53.0.2785
* Safari 9.1.3
* iOS Safari 9.3.5

## License ##

All code for flip-flop is licensed under a MIT license. See the LICENSE file for
more details. The game, text, and graphics are licensed under the same [CC BY-NC-SA 3.0][cc]
license as the Decktet.


[js13k]: http://js13kgames.com/ "Andrzej Mazur (Enclave Games): HTML5 and JavaScript game development competition in just 13 kB"
[Decktet]: http://www.decktet.com/ "P.D. Magnus (The Decktet): A unique deck of cards"
[Jacynth]: http://wiki.decktet.com/game:jacynth "P.D. Magnus and Jack Neal (The Decktet Wiki): Jacynth"
[cc]: https://creativecommons.org/licenses/by-nc-sa/3.0/ "Creative Commons - Attribution-NonCommercial-ShareAlike 3.0 Unported"
[leds]: https://codepen.io/fskirschbaum/pen/MYJNaj "F. Stephen Kirschbaum (CodePen): CSS LED Lights"
[button]: http://cssdeck.com/labs/lexr27qf "Sara Soueidan (CSS Deck): Soft Button"
[paper]: http://lea.verou.me/css3patterns/#blueprint-grid "Lea Verou (CSS3 Patterns Gallery): Blueprint Grid"
[hex]: http://lea.verou.me/css3patterns/#honeycomb "Paul Salentiny (CSS3 Patterns Gallery): HoneyComb"
[notes]: http://code.tutsplus.com/tutorials/create-a-sticky-note-effect-in-5-easy-steps-with-css3-and-html5--net-13934 "Chris Heilmann (Tuts+): Create a Sticky Note Effect in 5 Easy Steps with CSS3 and HTML5"
[neon]: http://thenewcode.com/610/Create-A-Flickering-Neon-Bar-Sign-With-CSS "Dudley Storey (thenewcode.com): Create a Flickering Neon Bar Sign with CSS"
[Sarah Mitchell]: https://github.com/thesmitchell "Sarah Mitchell (GitHub): TheSmitchell"
[cbm]: http://mkweb.bcgsc.ca/colorblind/ "Martin Krzywinski (Genome Sciences Center): Color Palettes for Color Blindness"
