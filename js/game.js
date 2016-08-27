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
