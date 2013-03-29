function GameText() {};

GameText.inheritsFrom( GameObject );

GameText.prototype.init  = function(x, y, text, font, size, fillColor, strokeColor, lineWidth, align, baseline) {
	this.fill   = fillColor ? true : false;
	this.stroke = strokeColor ? true : false;

	this.align     = align ? align : "start";
	this.baseline  = baseline ? baseline : "top";
	this.lineWidth = lineWidth ? lineWidth : 1;

	this.x = x;
	this.y = y;	

	this.fillColor   = fillColor;
	this.strokeColor = strokeColor;

	this.text = text;
	this.font = size + "px" + " " + font;
}

GameText.prototype.draw  = function(context) {	
	context.font 		 = this.font;
    context.textBaseline = this.baseline;
	context.textAlign 	 = this.align;

	if(this.fill){
		context.lineWidth = this.lineWidth;
		context.fillStyle = this.fillColor;
    	context.fillText(this.text, 0, 0);
	}

	if(this.stroke){
		context.strokeStyle = this.strokeColor;
    	context.strokeText(this.text, 0, 0);
	}
}

function PowerUpText() {}

PowerUpText.inheritsFrom( GameText );

PowerUpText.prototype.init = function(args) {
	this.parent.init.call(this, args.x, args.y, args.text, args.font, args.size, args.fillColor, args.strokeColor, args.lineWidth, args.align, args.baseline);
	this.y -= 40;
	TweenMax.to(this, 0.7, {y:this.y-40, ease:Back.easeOut, onCompleteScope:this, onComplete:function(){
		this.alive = false;
	}});
}

