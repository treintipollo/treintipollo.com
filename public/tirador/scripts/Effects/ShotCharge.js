ShotCharge.ON  = 0;
ShotCharge.OFF = 1;

ShotCharge.ParticleArguments = [null, null, null, null, null, null, null, null];

function ShotCharge(parent, xOffset, yOffset, startAngle, endAngle, radius) {
	this.startAngle = startAngle;
	this.endAngle   = endAngle;
	this.radius     = radius;
	this.parent     = parent;
	this.xOffset    = xOffset;
	this.yOffset    = yOffset;

	this.state 	   = -1;
	this.lastState = -1;
	this.particles = [];

	this.particleTimer = TimeOutFactory.getTimeOut(0, -1, this, function(){
		for(var i=0; i<this.particlesInCycle; i++){
			this.createParticles(this.parent, this.xOffset, this.yOffset, this.radius, this.startAngle, this.endAngle, this.particleColor, this.particleSize);	
		}
	});
}

ShotCharge.prototype.init = function(container, particleInterval, particleColor, particleSize, particleType, particlesInCycle) {
	this.container = container;
	
	this.particleInterval = particleInterval ? particleInterval : 50;
	this.particleColor    = particleColor    ? particleColor    : "#FFFFFF";
	this.particleSize     = particleSize     ? particleSize     : 2.5;
	this.particleType     = particleType     ? particleType     : "ShotChargeParticle";
	this.particlesInCycle = particlesInCycle ? particlesInCycle : 1;	

	this.particleTimer.delay = this.particleInterval;
}

ShotCharge.prototype.on  = function(startAngle, endAngle)  { 
	if(startAngle != null){ this.startAngle = startAngle; }
	if(endAngle != null)  { this.endAngle = endAngle;     }

	this.state = ShotCharge.ON;  
}
ShotCharge.prototype.off = function()  { 
	this.state = ShotCharge.OFF; 
}

ShotCharge.prototype.update = function() {
	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.clearAllIntervals();

	if(this.state == ShotCharge.ON){ 
		this.particleTimer.start();
	}
	
	this.lastState = this.state;
}

ShotCharge.prototype.clearAllIntervals = function() {
	this.particleTimer.stop();
}

ShotCharge.prototype.destroy = function() {
	this.clearAllIntervals();

	for(var i=0; i<this.particles.length; i++){
		this.particles[i].setDestroyMode(GameObject.NO_CALLBACKS);
	}

	DestroyUtils.destroyAllProperties(this);
}

ShotCharge.prototype.createParticles = function(parent, xOffset, yOffset, radius, startAngle, endAngle, particleColor, particleSize) {
	ShotCharge.ParticleArguments[0] = parent;
	ShotCharge.ParticleArguments[1] = xOffset;
	ShotCharge.ParticleArguments[2] = yOffset;
	ShotCharge.ParticleArguments[3] = radius;
	ShotCharge.ParticleArguments[4] = startAngle;
	ShotCharge.ParticleArguments[5] = endAngle;
	ShotCharge.ParticleArguments[6] = particleColor;
	ShotCharge.ParticleArguments[7] = particleSize;

	var particle = this.container.add(this.particleType, ShotCharge.ParticleArguments, 0);
	
	if(particle != null){
		this.particles.push(particle);

		particle.addOnDestroyCallback(this, function(obj){
			this.particles.splice(this.particles.indexOf(obj), 1);
		});
	}
}