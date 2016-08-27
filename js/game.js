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

var Sockets = (function () {
'use strict';

var sockets = {}
  , dirty = 0
  , picked = null

sockets.reset = function () {
  picked = null
  dirty |= 2
}

sockets.render = function () {
  var $ = window.jQuery
    , x = 0
    , y = 0

  if (dirty & 2) {
    for (x = 0; x < 4; x += 1) {
      for (y = 0; y < 4; y += 1) {
        if ('socket'+x+''+y !== picked) {
          $('#socket'+x+''+y).remove('picked')
        } else {
          $('#socket'+x+''+y).add('picked')
        }
      }
    }
  }

  dirty = 0
}

sockets.pick = function (id) {
  if (picked !== id) {
    picked = id
    dirty |= 2
  }
}

return sockets
}())

var Chips = (function () {
'use strict';

var chips = {}
  , stack = []
  , grip = []
  , heap = []
  , dirty = 0
  , picked = null

chips.reset = function () {
  var i = 0
    , j = 0
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

  this.compute()

  picked = null
  dirty |= 2
}

chips.compute = function () {
  var i = 0
    , j = 0
    , possible = 0

  for (i = 0; i < grip.length; i += 1) {
    if (grip[i].value > 1 && grip[i].value < 10) {
      possible = 0
      for (j = 0; j < stack.length; j += 1) {
        if (stack[j].value >= grip[i].value) {
          possible += 1
        }
      }
      grip[i].percent = (possible / stack.length).toFixed(1)
    }
    else {
      grip[i].percent = (1.0).toFixed(1)
    }
  }

  dirty |= 1
}

chips.render = function () {
  var $ = window.jQuery
    , i = 0

  if (dirty & 1) {
    for (i = 0; i < 3; i += 1) {
      $('#chip'+i).html(grip[i].percent)
    }
  }

  if (dirty & 2) {
    for (i = 0; i < 3; i += 1) {
      if ('chip'+i !== picked) {
        $('#chip'+i).remove('picked')
      } else {
        $('#chip'+i).add('picked')
      }
    }
  }

  dirty = 0
}

chips.pick = function (id) {
  if (picked !== id) {
    picked = id
    dirty |= 2
  }
}

return chips
}())

;(function (Game) {
'use strict';

var color = undefined

function onSocket (target, e) {
  Sockets.pick(target.unwrap().id)
}

function onChip (target, e) {
  Chips.pick(target.unwrap().id)
}

function render () {
  requestAnimationFrame(render)

  Sockets.render()
  Chips.render()
}

// Pick a random color out of the RGB color space.
// Don't use the PRNG, since it will be seeded with the color.
function newColor () {
  var hash = color

  do {
    hash = Math.floor(Math.random() * 16777216)
    hash = ('000000' + hash.toString(16)).substr(-6)
  } while (hash === color)

  color = hash
}

function resetGame () {
  Sockets.reset()
  Chips.reset()
}

function onHashChange () {
  var hash = window.location.hash.substring(1)
  if (/^[0-9A-F]{6}$/i.test(hash)) {
    color = hash
    PRNG.seed(parseInt(color, 16))
  }
  resetGame()
}

function startGame (callback) {
  var hash = window.location.hash.substring(1)
    , reloaded = false

  if (/^[0-9A-F]{6}$/i.test(hash)) {
    if (color === hash) {
      // Continuing saved game...
      reloaded = true
    } else {
      // Replaying a linked game...
      color = hash
      PRNG.seed(parseInt(color, 16))
    }
  } else {
    // Playing a new game...
    newColor()
    PRNG.seed(parseInt(color, 16))
  }

  if (window.location.hash.substring(1) !== color) {
    window.location.hash = color
  } else if (!reloaded) {
    resetGame()
  }

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
      html += '<p id="socket'+x+''+y+'" class="socket"></p>'
    }
    html += '</div>'
  }
  $('#fab').html(html)

  for (x = 0; x < 4; x += 1) {
    for (y = 0; y < 4; y += 1) {
      $('#socket'+x+''+y).touch(onSocket)
    }
  }

  html = ''
  for (x = 0; x < 3; x += 1) {
    html += '<p id="chip'+ x +'" class="chip"></p>'
  }
  $('#chips').html(html)

  for (x = 0; x < 3; x += 1) {
    $('#chip'+x).touch(onChip)
  }

  $(window).on('hashchange', onHashChange)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
