$(function() {
  var $pollos = $('.pollos');

  for (var i = 0; i < 30; i++) {
    $('<img class="pollo" alt="pollo" src="/assets/pollo.png">')
      .hide()
      .appendTo($pollos)
      .delay(i * 150)
      .fadeIn(150);
  }

  $('.title')
    .delay(4500)
    .prependTo($('body'))
    .animate({
      'margin-top': '+60px'
    }, 600, 'easeOutBounce');
});
