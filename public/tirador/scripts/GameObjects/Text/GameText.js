function GameText() {};

GameText.inheritsFrom( GameObject );

GameText.prototype.init  = function(x, y) {
	this.x = x;
	this.y = y;	

	if(!this.align) 	this.align 		 = "start";
	if(!this.baseline) 	this.baseline 	 = "top";
	if(!this.lineWidth) this.lineWidth 	 = 1;
	if(!this.fill) 		this.fillColor 	 = "#000000";
	if(!this.stroke) 	this.strokeColor = "#FFFFFF";	
	if(!this.text) 		this.text 		 = "Needs More Text";
	if(!this.size) 		this.size 		 = 10;

	if(!this.font){
		this.font = this.size + "px" + " " + "Arial";
	}else{
		this.font = this.size + "px" + " " + this.font;
	}
}

GameText.prototype.draw  = function(context) {	
	context.font 		 = this.font;
    context.textBaseline = this.baseline;
	context.textAlign 	 = this.align;

	if(this.fill){
		context.lineWidth = this.lineWidth;
		context.fillStyle = this.fill;
    	context.fillText(this.text, 0, 0);
	}

	if(this.stroke){
		context.strokeStyle = this.stroke;
    	context.strokeText(this.text, 0, 0);
	}
}

function ConcreteText() {}

ConcreteText.inheritsFrom( GameText );

ConcreteText.prototype.init = function(x, y) {	
	this.tProto.init.call(this, x, y);
}

function PowerUpText() {}

PowerUpText.inheritsFrom( GameText );

PowerUpText.prototype.init = function(x, y) {
	GameText.prototype.init.call(this, x, y);
	this.y -= 40;
	TweenMax.to(this, 0.7, {y:this.y-40, ease:Back.easeOut, onCompleteScope:this, onComplete:function(){
		this.alive = false;
	}});
}

function WarningText() {}

WarningText.inheritsFrom( GameText );

WarningText.prototype.init = function(x, y) {
	GameText.prototype.init.call(this, x, y);
	
	TweenMax.to(this, this.introSpeed, {x:TopLevel.canvas.width/2, ease:Back.easeOut, onCompleteScope:this, onComplete:function(){
		TweenMax.to(this, this.introSpeed, {delay:1, x:TopLevel.canvas.width*2, ease:Back.easeIn, onCompleteScope:this, onComplete:function(){
			this.alive = false;
		}});
	}});
}
