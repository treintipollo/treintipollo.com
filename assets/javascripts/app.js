$(function() {
  var $pollos = $('.pollos');
  for (var i = 0; i < 30; i++) {
    var $pollo = $('<img class="pollo" src="/assets/pollo.png">');
    $pollo
      .appendTo($pollos)
      .hide()
      .delay(i * 150)
      .fadeIn(150);
  }

  $('.title')
    .delay(4500)
    .prependTo($('body'))
    .animate({
      'margin-top': '1em'
    }, 200);
});
