function FadeToBlack() {}

FadeToBlack.inheritsFrom(GameObject);

FadeToBlack.prototype.init = function() {
	this.x = 0;
	this.y = 0;
	this.alpha = 0;
}

FadeToBlack.prototype.start = function(onFadeInComplete, onFadeOutComplete) {
	var mainDelay = 7;
	var fadeTime = 4;

	TopLevel.hudController.hide(fadeTime, mainDelay);

	TweenMax.to(this, fadeTime, {
		alpha: 1,
		delay: mainDelay,
		onCompleteScope: this,
		onComplete: function() {
			if (onFadeInComplete) {
				onFadeInComplete();
			}

			TopLevel.hudController.show(fadeTime, mainDelay);

			TweenMax.to(this, fadeTime, {
				alpha: 0,
				delay: mainDelay,
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