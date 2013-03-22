WeaponPowerUp.SHOT   = 0;
WeaponPowerUp.ROCKET = 1;

function WeaponPowerUp() {}

WeaponPowerUp.inheritsFrom( GameObject );

WeaponPowerUp.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

WeaponPowerUp.prototype.init = function(x, y) {
	this.x      = x;
	this.y      = y; 
	this.speed  = 40;
	this.radius = 15;

	CircleCollider.prototype.init.call(this, this.radius);

	this.color; 
	this.state;

	var startTweens = function (color, state) {
		this.color = color;
		this.state = state;

		var colorTween = TweenMax.to(this, 0.7, {colorProps:{color:"#000000"}, yoyo:true, repeat:-1});

		TweenMax.to(this, 3, {onCompleteScope:this, onComplete:function(){
			colorTween.kill();

			if(this.state == WeaponPowerUp.SHOT){
				startTweens.call(this, "#0000FF", WeaponPowerUp.ROCKET);
			}
			else if(this.state == WeaponPowerUp.ROCKET){
				startTweens.call(this, "#FF0000", WeaponPowerUp.SHOT);
			}

			startTweens.call(this, this.color, this.state);
		}});
	}

	TweenUtils.startValueOscilation.call(this, "x", 0.5, 20, -20, Sine.easeOut);

	var startState = Random.getRandomInt(WeaponPowerUp.SHOT, WeaponPowerUp.ROCKET);

	if(startState == WeaponPowerUp.SHOT){
		startTweens.call(this, "#FF0000", WeaponPowerUp.SHOT);
		return;
	}
	if(startState == WeaponPowerUp.ROCKET){
		startTweens.call(this, "#0000FF", WeaponPowerUp.ROCKET);
		return;
	}

}

WeaponPowerUp.prototype.gotoPosition = function(x, y) {
	TweenMax.to(this, 0.4, {x:x, y:y, onCompleteScope:this, onComplete:function(){
		this.init(x, y);
	}});
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

	if(this.y > 850){
		this.alive = false;
	}
}

WeaponPowerUp.prototype.destroy = function() {
	TweenMax.killTweensOf(this);
}

WeaponPowerUp.prototype.onCollide = function(other){
	this.alive = false;
}

function PowerUpFactory(container) {
	this.container = container;

	this.powerUpTypes = [];
	this.args = [];
}

PowerUpFactory.prototype.addPowerUpTypes = function(type){
	this.powerUpTypes.push(type);
}

PowerUpFactory.prototype.create = function(x, y, type, amount){
	var anlgeStep = (360/amount) * (Math.PI/180);

	for(var i=0; i<amount; i++){
		this.args[0] = x;
		this.args[1] = y;

		var p = this.container.add(type, this.args);	

		if(amount > 1){
			p.gotoPosition(p.x + Math.cos(anlgeStep*i)*50, p.y + Math.sin(anlgeStep*i)*50);
		}
	}
}

PowerUpFactory.prototype.createRandom = function(x, y, amount){
	var anlgeStep = (360/amount) * (Math.PI/180);

	for(var i=0; i<amount; i++){
		this.args[0] = x;
		this.args[1] = y;

		var p = this.container.add(this.powerUpTypes[Random.getRandomInt(0, this.powerUpTypes.length-1)], this.args);

		if(amount > 1){
			p.gotoPosition(p.x + Math.cos(anlgeStep*i)*50, p.y + Math.sin(anlgeStep*i)*50);
		}
	}
}