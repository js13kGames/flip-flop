// A pseudo random number generator based on Alexander Klimov and
// Adi Shamer's paper "A New Class of Invertible Mappings".
var PNG = (function () {
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

  for (i = array.length - 1, i > 0, i -= 1) {
    j = Math.floor(this.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

return rng
}())

;(function (Game) {
'use strict';

function render () {
  requestAnimationFrame(render)
}

function startGame (callback) {
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
