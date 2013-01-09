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

PowerUpText.UpArguments      = [null ,null ,"POWER UP!", "Russo One", 20, "#FFFFFF", "#FFFF00", null, "center", "middle"];
PowerUpText.DownArguments    = [null ,null ,"POWER DOWN", "Russo One", 20, "#FFFFFF", "#777777", null, "center", "middle"];
PowerUpText.ShotArguments    = [null ,null ,"SHOT!", "Russo One", 20, "#FFFFFF", "#FF0000", null, "center", "middle"];
PowerUpText.RocketsArguments = [null ,null ,"ROCKETS!", "Russo One", 20, "#FFFFFF", "#0000FF", null, "center", "middle"];

PowerUpText.inheritsFrom( GameText );

PowerUpText.prototype.init = function(x, y, text, font, size, fillColor, strokeColor, lineWidth, align, baseline) {
	this.parent.init.call(this, x, y, text, font, size, fillColor, strokeColor, lineWidth, align, baseline);

	this.y -= 40;

	var inst = this;

	TweenMax.to(inst, 0.7, {y:this.y-40, ease:Back.easeOut, onComplete:function(){
		inst.alive = false;
	}});
}

