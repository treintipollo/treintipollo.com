function WhiteFlash() {}

WhiteFlash.inheritsFrom( GameObject );

WhiteFlash.prototype.init = function(onMidPoint, onComplete, scaleToX, scaleToY, origin) {
	this.x = Math.floor(origin.x);
	this.y = Math.floor(origin.y);

	this.gradient = TopLevel.context.createLinearGradient(0,0,0,5);
	this.gradient.addColorStop(0,"rgba(255, 255, 255, 1)");
	this.gradient.addColorStop(1,"rgba(0, 0, 0, 0)");

	this.blockFill    = false;
	this.drawGradient = true;
	this.alpha        = 0;

	this.scaleX = 1;
	this.scaleY = 1;

	TweenMax.to(this, 1, {scaleX:scaleToX, scaleY:scaleToY, ease:Back.easeIn.config(1), onCompleteScope:this, onComplete:function(){
		this.blockFill = true;		
		TweenMax.to(this, 0.3, {alpha:1, onCompleteScope:this, onComplete:function(){
			this.drawGradient = false;

			if(onMidPoint)
				onMidPoint();

			TweenMax.to(this, 1, {alpha:0, ease:Linear.ease, onCompleteScope:this, onComplete:function(){
				this.alive = false;

				if(onComplete)
					onComplete();
			}});
		}});
	}});
}

WhiteFlash.prototype.draw = function(context) { 	
	if(this.drawGradient){
		context.fillStyle = this.gradient;
		
		context.beginPath();
		context.fillRect(-this.x, 0, TopLevel.canvas.width, 1);	
		context.closePath();

		context.fill();
	}

	if(this.blockFill){
		context.fillStyle = "rgba(255, 255, 255," + this.alpha.toString() + ")";		
		
		context.beginPath();
		context.fillRect(-this.x, 0, TopLevel.canvas.width, 1);	
		context.closePath();

		context.fill();
	}
}

WhiteFlash.prototype.destroy = function() { 	
	TweenMax.killTweensOf(this);
}

WhiteFlashContainer.Arguments = [];

function WhiteFlashContainer() {}

WhiteFlashContainer.prototype.on = function(onMidPoint, onComplete, origin) {
	WhiteFlashContainer.Arguments[0] = onMidPoint;
	WhiteFlashContainer.Arguments[1] = onComplete;
	WhiteFlashContainer.Arguments[2] = 1;
	WhiteFlashContainer.Arguments[3] = 1000;
	WhiteFlashContainer.Arguments[4] = origin;

	TopLevel.container.add("WhiteFlash", WhiteFlashContainer.Arguments, 0);
	
	WhiteFlashContainer.Arguments[0] = null;
	WhiteFlashContainer.Arguments[1] = null;
	WhiteFlashContainer.Arguments[2] = 1;
	WhiteFlashContainer.Arguments[3] = -1000;
	WhiteFlashContainer.Arguments[4] = origin;

	TopLevel.container.add("WhiteFlash", WhiteFlashContainer.Arguments, 0);
}