function ExhaustParticle() {}

ExhaustParticle.inheritsFrom( GameObject );

ExhaustParticle.prototype.init = function(type, parentContext, bezierPoints, color, life, side) {
	this.parentContext = parentContext;
	this.bezierPoints  = bezierPoints;
	this.type 		   = type;
	this.color 		   = color;

	this.life = 0;
	this.step = 1.0/life;
	this.side = side;

	var pos = BezierCurve.getPoint(0.001, this.bezierPoints.call(this.parentContext, this.side, this.type));
	this.x = pos.x;
	this.y = pos.y;
}

ExhaustParticle.prototype.draw = function(context) { 
	context.strokeStyle = this.color;

	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();

	context.stroke();
}

ExhaustParticle.prototype.update = function(delta) { 	
	this.life += this.step * (delta * 50);

	if(this.life >= 1.0){
		this.alive = false;
	}else{
		var pos = BezierCurve.getPoint(this.life, this.bezierPoints.call(this.parentContext, this.side, this.type));
		this.x = pos.x;
		this.y = pos.y;	
	}
}

function ShotChargeParticle() {}

ShotChargeParticle.inheritsFrom( GameObject );

ShotChargeParticle.prototype.init = function(parent, xOffset, yOffset, radius, startAngle, endAngle) { 
    this.parent  = parent;
	this.radius  = Random.getRandomArbitary(radius/2, radius);
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.speed   = Random.getRandomArbitary(150, 300);

	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
	this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
}

ShotChargeParticle.prototype.draw = function(context) { 
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();

	context.stroke();
}

ShotChargeParticle.prototype.update = function(delta) { 	
	this.radius -= this.speed * delta;

	if(this.radius <= 0){
		this.alive = false;	
	}else{
		this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
		this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
	}
}

function RadialParticle() {}

RadialParticle.inheritsFrom( GameObject );

RadialParticle.prototype.init = function(user, color, radius, life, startAngle, endAngle) { 
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

RadialParticle.prototype.draw = function(context) { 
	context.strokeStyle = this.color;

	context.beginPath();
	context.rect(-2.5/2, -2.5/2, 2.5, 2.5);
	context.closePath();

	context.stroke();
}

RadialParticle.prototype.update = function(delta) { 	
	this.life -= delta * 100;

	if(this.life < 0){
		this.alive = false;	
	}
}