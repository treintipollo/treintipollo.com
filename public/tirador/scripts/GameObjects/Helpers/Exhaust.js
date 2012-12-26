Exhaust.NEUTRAL = 0;
Exhaust.UP 		= 1;
Exhaust.DOWN 	= 2;

function Exhaust(particleBezierPoints, container) {
	this.container     		  = container;
	this.particleBezierPoints = particleBezierPoints;

	this.neutralSpeedId = -1;
	this.upSpeedId 		= -1;
	this.downSpeedId 	= -1;

	this.state 			= -1;
	this.lastState		= -1;
	this.particleSide   = true;
	this.particles      = [];

	this.colors = ["#F2A007", "#FF0000", "#A30808"];
}

Exhaust.prototype.neutral = function()  { this.state = Exhaust.NEUTRAL; }
Exhaust.prototype.speedUp = function()  { this.state = Exhaust.UP;      }
Exhaust.prototype.slowDown = function() { this.state = Exhaust.DOWN;    }

Exhaust.prototype.update = function(p) {
	if(!this.hasOwnProperty("state")){
		return;
	}

	if(this.state == this.lastState){
		return;
	}

	this.clearAllIntervals();
	var exhaust = this;

	if(this.state == Exhaust.NEUTRAL){
		this.neutralSpeedId = setInterval(function() {
			exhaust.createParticles(p, exhaust.state, 15.0);	
		} , 50);
	}
	if(this.state == Exhaust.UP){
		this.upSpeedId = setInterval(function() {
			exhaust.createParticles(p, exhaust.state, 15.0);	
		} , 40);	
	}
	if(this.state == Exhaust.DOWN){
		this.downSpeedId = setInterval(function() {
			exhaust.createParticles(p, exhaust.state, 20.0);	
		} , 70);
	}

	this.lastState = this.state;
}

Exhaust.prototype.clearAllIntervals = function() {
	if(this.neutralSpeedId != -1) { clearInterval(this.neutralSpeedId); }
	if(this.upSpeedId != -1) 	  { clearInterval(this.upSpeedId); 	    }
	if(this.downSpeedId != -1) 	  { clearInterval(this.downSpeedId);    }
}

Exhaust.prototype.destroy = function() {
	this.clearAllIntervals();

	for(var i=0; i<this.particles.length; i++){
		this.particles[i].setDestroyMode(GameObject.NO_CALLBACKS);
	}

	DestroyUtils.destroyAllProperties(this);
}

Exhaust.prototype.createParticles = function(parentContext, state, life) {
	this.particleSide = !this.particleSide;
	var particle = new ExhaustParticle(state, parentContext, this.particleBezierPoints, this.colors[state], life, this.particleSide);
	
	particle.addOnDestroyCallback(this, function(obj){
		this.particles.splice(this.particles.indexOf(obj), 1);
	});

	this.container.add(particle, 1);
	this.particles.push(particle);
}

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