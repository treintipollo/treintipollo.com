ParticleBeam.ON  = 0;
ParticleBeam.OFF = 1;

ParticleBeam.ParticleArguments = [null, null, null, null, null, null, null];

function ParticleBeam() {	
	this.state 	   = -1;
	this.lastState = -1;
	this.particles = [];

	this.particleTimer = TimeOutFactory.getTimeOut(0, -1, this, function(){
		for(var i=0; i<this.particlesInCycle; i++){
			
			var rand = Math.random();
			var x = NumberUtils.interpolate(rand, this.start.x, this.end.x); 
			var y = NumberUtils.interpolate(rand, this.start.y, this.end.y);
			this.createParticles(x, y, this.angle, this.particleColor, this.particleSize, this.maxParticleSpeed, this.particleLife);	
		}
	});
}

ParticleBeam.prototype.init = function(container, particleInterval, particleColor, particleSize, particleType, particlesInCycle, maxParticleSpeed, particleLife) {
	this.container = container;
	
	this.particleInterval = particleInterval ? particleInterval : 50;
	this.particleColor    = particleColor    ? particleColor    : "#FFFFFF";
	this.particleSize     = particleSize     ? particleSize     : 2.5;
	this.particleType     = particleType     ? particleType     : "StraightParticle";
	this.particlesInCycle = particlesInCycle ? particlesInCycle : 1;
	this.maxParticleSpeed = maxParticleSpeed ? maxParticleSpeed : 70;
	this.particleLife 	  = particleLife ? particleLife : 30;

	this.particleTimer.delay = this.particleInterval;
}

ParticleBeam.prototype.on  = function(start, end)  { 
	this.start = start;
	this.end   = end;
	this.angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
	this.angle += Math.PI/2;

	this.state = ParticleBeam.ON;  
}
ParticleBeam.prototype.off = function()  { 
	this.state = ParticleBeam.OFF; 
}

ParticleBeam.prototype.update = function() {
	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.clearAllIntervals();

	if(this.state == ParticleBeam.ON){ 
		this.particleTimer.start();
	}
	
	this.lastState = this.state;
}

ParticleBeam.prototype.clearAllIntervals = function() {
	this.particleTimer.stop();
}

ParticleBeam.prototype.destroy = function() {
	this.clearAllIntervals();

	for(var i=0; i<this.particles.length; i++){
		this.particles[i].setDestroyMode(GameObject.NO_CALLBACKS);
	}

	DestroyUtils.destroyAllProperties(this);
}

ParticleBeam.prototype.createParticles = function(x, y, angle, particleColor, particleSize, maxParticleSpeed, particleLife) {
	ParticleBeam.ParticleArguments[0] = x;
	ParticleBeam.ParticleArguments[1] = y;
	ParticleBeam.ParticleArguments[2] = angle;
	ParticleBeam.ParticleArguments[3] = particleColor;
	ParticleBeam.ParticleArguments[4] = particleSize;
	ParticleBeam.ParticleArguments[5] = maxParticleSpeed;
	ParticleBeam.ParticleArguments[6] = particleLife;

	var particle = this.container.add(this.particleType, ParticleBeam.ParticleArguments, 0);
	
	if(particle != null){
		this.particles.push(particle);

		particle.addOnDestroyCallback(this, function(obj){
			this.particles.splice(this.particles.indexOf(obj), 1);
		});
	}
}