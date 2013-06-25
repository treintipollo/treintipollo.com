function FadeToBlack() {}

FadeToBlack.inheritsFrom(GameObject);

FadeToBlack.prototype.init = function() {
	this.x = 0;
	this.y = 0;
	this.alpha = 0;
}

FadeToBlack.prototype.start = function(onFadeInComplete, onFadeOutComplete) {
	TopLevel.hudController.hide(2, 0.5);

	TweenMax.to(this, 2, {
		alpha: 1,
		delay: 0.5,
		onCompleteScope: this,
		onComplete: function() {
			if (onFadeInComplete)
				onFadeInComplete();

			TopLevel.hudController.show(2, 0.5);

			TweenMax.to(this, 2, {
				alpha: 0,
				delay: 0.5,
				onCompleteScope: this,
				onComplete: function() {
					if (onFadeOutComplete) {
						onFadeOutComplete();
					}
				}
			});
		}
	});
}

FadeToBlack.prototype.draw = function(context) {
	context.strokeStyle = "#000000";
	context.fillStyle = "#000000";

	context.beginPath();
	context.rect(0, 0, context.canvas.width, context.canvas.height);
	context.closePath();

	context.stroke();
	context.fill();
}