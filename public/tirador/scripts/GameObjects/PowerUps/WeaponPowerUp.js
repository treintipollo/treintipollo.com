WeaponPowerUp.SHOT   = 0;
WeaponPowerUp.ROCKET = 1;

function WeaponPowerUp() {
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 0);
}

WeaponPowerUp.inheritsFrom( GameObject );

WeaponPowerUp.prototype.init = function(x, y) {
	this.x      = x;
	this.y      = y; 
	this.speed  = 40;
	this.radius = 15;
	
	this.color; 
	this.state;

	this.collider.r = this.radius;

	var inst = this;

	var startTweens = function (color, state) {
		inst.color = color;
		inst.state = state;

		var colorTween = TweenMax.to(inst, 0.7, {colorProps:{color:"#000000"}, yoyo:true, repeat:-1});

		TweenMax.to(inst, 3, {onComplete:function(){
			colorTween.kill();

			if(inst.state == WeaponPowerUp.SHOT){
				inst.color = "#0000FF";
				inst.state = WeaponPowerUp.ROCKET;
			}
			else if(inst.state == WeaponPowerUp.ROCKET){
				inst.color = "#FF0000";
				inst.state = WeaponPowerUp.SHOT;
			}

			startTweens(inst.color, inst.state);
		}});
	}

	TweenMax.fromTo(inst, 1, {startAt:{x:inst.x}, x:inst.x-20, ease:Sine.easeInOut, yoyo:true, repeat:-1}, {x:inst.x+20, ease:Sine.easeInOut, yoyo:true, repeat:-1});
	
	var startState = Random.getRandomInt(WeaponPowerUp.SHOT, WeaponPowerUp.ROCKET);

	if(startState == WeaponPowerUp.SHOT){
		startTweens("#FF0000", WeaponPowerUp.SHOT);
		return;
	}
	if(startState == WeaponPowerUp.ROCKET){
		startTweens("#0000FF", WeaponPowerUp.ROCKET);
		return;
	}
}

WeaponPowerUp.prototype.draw = function(context) { 	
	
	if(this.state == WeaponPowerUp.SHOT){
		context.strokeStyle = "#FFFFFF";
		context.lineWidth = 2;

		context.beginPath();
		context.arc(0, 0, this.radius, 0, Math.PI*2, false);
		context.closePath();

		context.stroke();

		context.strokeStyle = "#FFFFFF";
		context.lineWidth   = 2;
		context.fillStyle   = this.color;

		context.beginPath();
		context.arc(0, 0, this.radius/2, 0, Math.PI*2, false);
		context.closePath();

		context.fill();
		context.stroke();	
	}
	else if(this.state == WeaponPowerUp.ROCKET){
		context.strokeStyle = "#FFFFFF";
		context.lineWidth = 2;

		context.beginPath();
		context.rect(-this.radius, -this.radius, this.radius*2, this.radius*2);
		context.closePath();

		context.stroke();

		context.strokeStyle = "#FFFFFF";
		context.lineWidth   = 2;
		context.fillStyle   = this.color;

		context.beginPath();
		context.rect(-this.radius/2, -this.radius/2, this.radius, this.radius);
		context.closePath();

		context.fill();
		context.stroke();
	}
}

WeaponPowerUp.prototype.update = function(delta) {
	this.y += this.speed*delta;

	if(this.y > 720){
		this.alive = false;
	}
}

WeaponPowerUp.prototype.destroy = function() {
	TweenMax.killTweensOf(this);
}

WeaponPowerUp.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

WeaponPowerUp.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;

	return this.collider;
}

WeaponPowerUp.prototype.onCollide = function(other){
	this.alive = false;
}