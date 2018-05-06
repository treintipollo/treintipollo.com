$(function() {
	var $pollos = $('.pollosCenter');

	var amount = 30;
	var speed = 120;

	for (var i = 0; i < amount; i++) {
		var d = $('<div></div>').appendTo($pollos);

		$('<img class="pollo" alt="pollo" src="/assets/pollo.png">')
			.hide()
			.appendTo(d)
			.delay(i * speed)
			.fadeIn(speed);
	}

	$('.title')
		.delay(amount * speed)
		.animate({
			'margin-top': '30px'
		},
		600,
		'easeOutBounce',
		function() {
			$('.games')
				.animate({
					'opacity': '1'
				}, 600, 'swing');
		});

	document.addEventListener("click", (e) => {
		$('<img class="pollo" alt="pollo" src="/assets/pollo.png">').stop();
		$('.title').stop();
	});
});
