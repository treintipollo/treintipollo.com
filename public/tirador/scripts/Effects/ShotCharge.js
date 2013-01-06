ShotCharge.ON  = 0;
ShotCharge.OFF = 1;

function ShotCharge(parent, xOffset, yOffset, startAngle, endAngle, radius, container) {
	this.container  = container;
	this.startAngle = startAngle;
	this.endAngle   = endAngle;
	this.radius     = radius;
	this.parent     = parent;
	this.xOffset    = xOffset;
	this.yOffset    = yOffset;

	this.onId  	   = -1;	
	this.state 	   = -1;
	this.lastState = -1;
	this.particles = [];
}

ShotCharge.prototype.on  = function()  { this.state = ShotCharge.ON;  }
ShotCharge.prototype.off = function()  { this.state = ShotCharge.OFF; }

ShotCharge.prototype.update = function() {
	if(!this.hasOwnProperty("state")){
		return;
	}

	if(this.state == this.lastState){
		return;
	}

	this.clearAllIntervals();
	var shotCharge = this;

	if(this.state == ShotCharge.ON){
		this.onId = setInterval(function() {
			shotCharge.createParticles(shotCharge.parent, shotCharge.xOffset, shotCharge.yOffset, shotCharge.radius, shotCharge.startAngle, shotCharge.endAngle);	
		} , 50);
	}
	
	this.lastState = this.state;
}

ShotCharge.prototype.clearAllIntervals = function() {
	if(this.onId != -1) { clearInterval(this.onId); }
}

ShotCharge.prototype.destroy = function() {
	this.clearAllIntervals();

	for(var i=0; i<this.particles.length; i++){
		this.particles[i].setDestroyMode(GameObject.NO_CALLBACKS);
	}

	DestroyUtils.destroyAllProperties(this);
}

ShotCharge.prototype.createParticles = function(parent, xOffset, yOffset, radius, startAngle, endAngle) {
	var particle = new ShotChargeParticle(parent, xOffset, yOffset, radius, startAngle, endAngle);

	particle.addOnDestroyCallback(this, function(obj){
		this.particles.splice(this.particles.indexOf(obj), 1);
	});

	this.container.add(particle, 1);
	this.particles.push(particle);
}