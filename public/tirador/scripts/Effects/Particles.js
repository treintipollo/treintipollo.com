function ExhaustParticle(type, parentContext, bezierPoints, color, life, side) {
	this.parentContext = parentContext;
	this.bezierPoints  = bezierPoints;
	this.type 		   = type;
	this.color 		   = color;

	this.life = 0;
	this.step = 1.0/life;
	this.side = side;
}

ExhaustParticle.inheritsFrom( GameObject );

ExhaustParticle.prototype.setStyles = function(context) { 	
	context.strokeStyle = this.color;
}

ExhaustParticle.prototype.draw = function(context) { 
	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();
}

ExhaustParticle.prototype.setFills = function(context) {
	context.stroke();
}

ExhaustParticle.prototype.update = function() { 	
	this.life += this.step;

	if(this.life >= 1.0){
		this.alive = false;
	}else{
		var pos = BezierCurve.getPoint(this.life, this.bezierPoints.call(this.parentContext, this.side, this.type));
		this.x = pos.x;
		this.y = pos.y;	
	}
}

function ShotChargeParticle(parent, xOffset, yOffset, radius, startAngle, endAngle) {
	this.parent  = parent;
	this.radius  = Random.getRandomArbitary(radius/2, radius);
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.speed   = Random.getRandomArbitary(1, 3);

	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
	this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
}

ShotChargeParticle.inheritsFrom( GameObject );

ShotChargeParticle.prototype.setStyles = function(context) { 	
	context.strokeStyle = "#FFFFFF";
}

ShotChargeParticle.prototype.draw = function(context) { 
	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();
}

ShotChargeParticle.prototype.setFills = function(context) {
	context.stroke();
}

ShotChargeParticle.prototype.update = function() { 	
	this.radius -= this.speed;

	if(this.radius <= 0){
		this.alive = false;	
	}else{
		this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
		this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
	}
}

function RadialParticle(user, color, radius, life, startAngle, endAngle) {
	this.user   = user;
	this.radius = radius;
	this.color  = color;
	this.life   = life;
	
	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.user.x + this.dirX * this.radius;
	this.y = this.user.y + this.dirY * this.radius;
}

RadialParticle.inheritsFrom( GameObject );

RadialParticle.prototype.setStyles = function(context) { 	
	context.strokeStyle = this.color;
}

RadialParticle.prototype.draw = function(context) { 
	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();
}

RadialParticle.prototype.setFills = function(context) {
	context.stroke();
}

RadialParticle.prototype.update = function() { 	
	this.life--;

	if(this.life < 0){
		this.alive = false;	
	}
}