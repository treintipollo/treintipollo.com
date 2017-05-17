function Target() {};

Target.inheritsFrom( GameObject );

Target.prototype.init = function(parentShip, offSetX, offSetY) {	
	this.p 		 = parentShip;
	this.offSetX = offSetX;
	this.offSetY = offSetY;

	this.enable();
}

Target.prototype.enable = function() {
	this.scaleX = 7;
	this.scaleY = 7;
	
	this.color = "rgba(255,0,0,0)";
	TweenMax.to(this, 0.3, {scaleX:1, scaleY:1, colorProps:{color:"rgba(255,0,0,1)"}});
}

Target.prototype.disable = function() {
	if(this.disableTween) return;

	this.disableTween = TweenMax.to(this, 0.3, { scaleX:3, scaleY:3, colorProps:{color:"rgba(255,0,0,0)"}, onCompleteScope:this, onComplete:function(){
		this.alive 		  = false;
		this.disableTween = null;
	}});
}

Target.prototype.draw = function(context) {
	context.strokeStyle = this.color;

	for(var i=0; i<4; i++){
		var a = (45 * (i+1)) + (45*i);

		var x = Math.cos(a*(Math.PI/180)) * 20;
		var y = Math.sin(a*(Math.PI/180)) * 20;

		context.beginPath();
		
		context.moveTo(x, y);
		context.arc(0, 0, 30, (a-7.5)*(Math.PI/180), (a+7.5)*(Math.PI/180));
		context.closePath();	

		context.stroke();
	}

	context.strokeStyle = this.color;

	context.beginPath();
	context.arc(0, 0, 7, 0, Math.PI*2, true);
	context.closePath();

	context.stroke();
}

Target.prototype.update  = function(delta) {
	this.x = this.p.x + this.offSetX;
	this.y = this.p.y + this.offSetY;
	
	this.rotation += 3;
}

Target.prototype.destroy  = function() {
	TweenMax.killTweensOf(this);
}

Target.prototype.setOffSet = function(p, x, y) {
	TweenMax.to(this, 0.5, {offSetX:x, offSetY:y} );
}

function HomingTarget() {}

HomingTarget.inheritsFrom( Target );

HomingTarget.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

HomingTarget.prototype.init = function() {
	Target.prototype.init.apply(this, arguments);
	CircleCollider.prototype.init.call(this, 25);
}

HomingTarget.prototype.enable = function() {
	this.scaleX = 7;
	this.scaleY = 7;
	
	this.color = "rgba(255,255,0,0)";
	TweenMax.to(this, 0.3, {scaleX:1, scaleY:1, colorProps:{color:"rgba(255,255,0,1)"}});
}

HomingTarget.prototype.disable = function() {
	if(this.disableTween) return;

	this.disableTween = TweenMax.to(this, 0.3, { scaleX:3, scaleY:3, colorProps:{color:"rgba(255,255,0,0)"}, onCompleteScope:this, onComplete:function(){
		this.alive 		  = false;
		this.disableTween = null;
	}});
}

HomingTarget.prototype.draw = function(context) {
	context.strokeStyle = this.color;

	for(var i=0; i<6; i++){
		var a = (90/(6/2) * (i+1)) + (90/(6/2)*i);

		var x = Math.cos(a*(Math.PI/180)) * 20;
		var y = Math.sin(a*(Math.PI/180)) * 20;

		context.beginPath();
		
		context.moveTo(x, y);
		context.arc(0, 0, 30, (a-7.5)*(Math.PI/180), (a+7.5)*(Math.PI/180));
		context.closePath();	

		context.stroke();
	}

	context.strokeStyle = this.color;

	context.beginPath();
	context.rect(-3.5, -3.5, 7, 7);
	context.closePath();

	context.stroke();
}

HomingTarget.prototype.update  = function(delta) {
	if(!this.lockOnTarget){
		this.x = this.p.x + this.offSetX;
		this.y = this.p.y + this.offSetY;
	}else{
		this.x = this.lockOnTarget.x + this.lockOnTarget.centerX;
		this.y = this.lockOnTarget.y + this.lockOnTarget.centerY;
	}

	this.rotation += 3;
}

HomingTarget.prototype.onCollide  = function(other) {
	if(!this.lockOnTarget){
		this.lockOnTarget = other;

		other.addOnRecicleCallback(this, function(obj){
			this.lockOnTarget = null;
		});
	}
}

HomingTarget.prototype.destroy  = function() {
	Target.prototype.destroy.call(this);
	this.lockOnTarget = null;
}

HomingTarget.prototype.isLocked = function() {
	if(this.lockOnTarget){
		return true;
	}
	return false;
}

HomingTarget.prototype.setOffSet = function(p, x, y) {
	if(this.lockOnTarget){
		this.offSetX = x;
		this.offSetY = y;
	}else{
		TweenMax.to(this, 0.5, {offSetX:x, offSetY:y} );
	}
}