// A pseudo random number generator based on Alexander Klimov and
// Adi Shamer's paper "A New Class of Invertible Mappings".
var PRNG = (function () {
'use strict';

var rng = {}
  , max = Math.pow(2, 32)
  , state = undefined

// Call seed with "null" to start in a random state.
rng.seed = function (value) {
  if (value !== undefined) {
    state = parseInt(value, 10)
  }
  if (isNaN(state)) {
    state = Math.floor(Math.random() * max)
  }
  return state
}

rng.random = function () {
  state += (state * state) | 5
  return (state >>> 32) / max
}

rng.shuffle = function (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(this.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

return rng
}())

var Chips = (function () {
'use strict';

var chips = {}
  , stack = []
  , grip = []
  , heap = []
  , dirty = 0

chips.reset = function () {
  var i = 0
    , suit = null
    , suits = ['moons', 'suns', 'waves', 'leaves', 'wyrms', 'knots']

  // Reset and suffle the stack
  stack = []

  for (i = suits.length - 1; i >= 0; i -= 1) {
    stack.push({suit1: suit, suit2: suit, value: 1})
    stack.push({suit1: suit, suit2: suit, value: 10})
  }

  stack.push({suit1: 'moons', suit2: 'knots', value: 2})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 2})
  stack.push({suit1: 'suns', suit2: 'wyrms', value: 2})

  stack.push({suit1: 'moons', suit2: 'waves', value: 3})
  stack.push({suit1: 'suns', suit2: 'knots', value: 3})
  stack.push({suit1: 'leaves', suit2: 'wyrms', value: 3})

  stack.push({suit1: 'moons', suit2: 'suns', value: 4})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 4})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 4})

  stack.push({suit1: 'moons', suit2: 'leaves', value: 5})
  stack.push({suit1: 'suns', suit2: 'waves', value: 5})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 5})

  stack.push({suit1: 'moons', suit2: 'waves', value: 6})
  stack.push({suit1: 'suns', suit2: 'wyrms', value: 6})
  stack.push({suit1: 'leaves', suit2: 'knots', value: 6})

  stack.push({suit1: 'moons', suit2: 'leaves', value: 7})
  stack.push({suit1: 'suns', suit2: 'knots', value: 7})
  stack.push({suit1: 'waves', suit2: 'wyrms', value: 7})

  stack.push({suit1: 'moons', suit2: 'suns', value: 8})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 8})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 8})

  stack.push({suit1: 'moons', suit2: 'suns', value: 9})
  stack.push({suit1: 'leaves', suit2: 'knots', value: 9})
  stack.push({suit1: 'waves', suit2: 'wyrms', value: 9})

  PRNG.shuffle(stack)

  // Top three chips on the stack form the grip
  grip = []

  grip.push(stack.pop())
  grip.push(stack.pop())
  grip.push(stack.pop())

  // Make sure the grip rerenders
  dirty = 1
}

chips.render = function () {
}

return chips
}())

;(function (Game) {
'use strict';

function render () {
  requestAnimationFrame(render)

  Chips.render()
}

function startGame (callback) {
  Chips.reset()

  requestAnimationFrame(callback)
}

Game.play = function () {
  var $ = window.jQuery
    , html = ''
    , x = 0
    , y = 0

  for (x = 0; x < 4; x += 1) {
    html += '<div class="sockets">'
    for (y = 0; y < 4; y += 1) {
      html += '<p class="socket"></p>'
    }
    html += '</div>'
  }

  $('#fab').html(html)

  html = ''
  for (x = 0; x < 3; x += 1) {
    html += '<p class="chip"></p>'
  }
  $('#chips').html(html)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
