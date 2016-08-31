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

function makeChipHTML (chip) {
  var html = ''

  html += '<div class="dip">'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '<p class="chip">'
  html += '<span class="led '+chip.suit1+'"></span>'
  html += chip.percent
  html += '<span class="led '+chip.suit2+'"></span>'
  html += '</p>'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '</div>'

  return html
}

var Sockets = (function () {
'use strict';

var sockets = {}
  , chipped = {}
  , powered = {}
  , dirty = 0
  , picked = null

sockets.reset = function () {
  chipped = {}
  dirty |= 1

  picked = null
  dirty |= 2

  powered = {}
  dirty |= 4
}

sockets.render = function () {
  var $ = window.jQuery
    , x = 0
    , y = 0
    , html = ''

  if (dirty & 1) {
    Object.keys(chipped).forEach(function (id) {
      $('#'+id).html(makeChipHTML(chipped[id])).add('chipped')
    })
  }

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

  if (dirty & 4) {
    Object.keys(powered).forEach(function (id) {
      $('#'+id).add('powered')
    })
  }

  dirty = 0
}

sockets.pick = function (id) {
  if (picked !== id && !(id in powered)) {
    picked = id
    dirty |= 2
  }
}

sockets.canInsert = function () {
  var chipped_count = Object.keys(chipped).length
    , powered_count = Object.keys(powered).length
    , needs_more_power = false
    , i = 0

  for (i = 1; !needs_more_power && i <= 4; i += 1) {
    if (powered_count < i && chipped_count >= i * 4) {
      needs_more_power = true
    }
  }

  return picked && !(picked in chipped) && !needs_more_power
}

sockets.canPower = function () {
  return picked && (picked in chipped) && !(picked in powered)
}

sockets.insert = function (chip, glitch) {
  if (glitch.value >= chip.value &&
      chip.value > 1 && chip.value < 10 &&
      glitch.value > 1 && glitch.value < 10)
  {
    glitch.percent = chip.percent
    chip = glitch
  }

  chipped[picked] = chip
  chipped[picked].id = picked
  dirty |= 1

  this.pick(null)
}

sockets.power = function () {
  powered[picked] = chipped[picked]
  powered[picked].id = picked
  dirty |= 4

  this.pick(null)
}

// Collect a list of adjacent sockets with the same suit
function collectAdjacent (suit, socket) {
  var x = 0
    , y = 0
    , seen = []
    , possible = []
    , collected = []

  possible.push(socket)

  while (possible.length > 0) {
    socket = possible.pop()

    if (seen.indexOf(socket) < 0) {
      seen.push(socket)

      if (socket in chipped) {
        if (chipped[socket].suit1 === suit || chipped[socket].suit2 === suit) {
          collected.push(socket)

          x = parseInt(socket.slice(6)[0], 10)
          y = parseInt(socket.slice(6)[1], 10)

          if (x-1 >= 0) { possible.push('socket'+(x-1)+''+y) }
          if (x+1 <= 3) { possible.push('socket'+(x+1)+''+y) }
          if (y-1 >= 0) { possible.push('socket'+x+''+(y-1)) }
          if (y+1 <= 3) { possible.push('socket'+x+''+(y+1)) }
        }
      }
    }
  }

  return collected
}

sockets.base = function () {
  var id = null
    , chip = null
    , totals = {}
    , adjacent = []
    , score = 0

  for (id in powered) {
    chip = powered[id]

    adjacent = collectAdjacent(chip.suit1, chip.id)
    totals[chip.suit1+':'+adjacent.sort().join('')] = adjacent.length

    adjacent = collectAdjacent(chip.suit2, chip.id)
    totals[chip.suit2+':'+adjacent.sort().join('')] = adjacent.length
  }

  for (id in totals) {
    score += totals[id]
  }

  return score
}

sockets.bonus = function () {
  return 0
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
    stack.push({suit1: suits[i], suit2: suits[i], value: 1})
    stack.push({suit1: suits[i], suit2: suits[i], value: 10})
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
        if (stack[j].value < grip[i].value) {
          possible += 1
        }
      }
      grip[i].percent = (possible / stack.length).toFixed(1)
    } else {
      grip[i].percent = (1.0).toFixed(1)
    }
  }

  dirty |= 1
}

chips.cycle = function () {
  var index = null

  if (picked) {
    index = parseInt(picked.slice(4), 10)
    grip[index] = stack.pop()

    this.compute()
    this.pick(null)
  }
}

chips.render = function () {
  var $ = window.jQuery
    , i = 0
    , html = ''

  if (dirty & 1) {
    for (i = 0; i < 3; i += 1) {
      $('#chip'+i).html(makeChipHTML(grip[i]))
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

chips.pop = function () {
  return stack.pop()
}

chips.get = function () {
  var index = 0

  if (picked) {
    index = parseInt(picked.slice(4), 10)
    return grip[index]
  }

  return null
}

return chips
}())

var Score = (function () {
'use strict';

var score = {}
  , base = 0
  , bonus = 0
  , dirty = 0

score.reset = function () {
  base = 0
  bonus = 0
  dirty |= 1
}

score.render = function () {
  var $ = window.jQuery

  if (dirty & 1) {
    $('#score').html(bonus+'.'+((base < 10) ? ('0'+base) : base))
  }

  dirty = 0
}

score.compute = function () {
  var new_base = Sockets.base()
    , new_bonus = Sockets.bonus()

  if (base !== new_base) {
    base = new_base
    dirty |= 1
  }

  if (bonus !== new_bonus) {
    bonus = new_bonus
    dirty |= 1
  }
}

return score
}())

;(function (Game) {
'use strict';

var color = undefined

function onSocket (target, e) {
  Sockets.pick(target.unwrap().id)
}

function offSocket (target, e) {
}

function onPower (target, e) {
}

function offPower (target, e) {
  if (Sockets.canPower()) {
    Sockets.power()
    Score.compute()
  }
}

function onChip (target, e) {
  if (Sockets.canInsert()) {
    Chips.pick(target.unwrap().id)
  }
}

function offChip (target, e) {
  var chip = Chips.get()

  if (Sockets.canInsert()) {
    Sockets.insert(chip, Chips.pop())
    Chips.cycle()
    Score.compute()
  }
}

function render () {
  requestAnimationFrame(render)

  Sockets.render()
  Chips.render()
  Score.render()
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
  Score.reset()
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
      $('#socket'+x+''+y).touch(onSocket, offSocket)
    }
  }

  $('#power').touch(onPower, offPower)
  for (x = 0; x < 3; x += 1) {
    $('#chip'+x).touch(onChip, offChip)
  }

  $(window).on('hashchange', onHashChange)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
