ParticleBeam.ON  = 0;
ParticleBeam.OFF = 1;

ParticleBeam.ParticleArguments = [];

function ParticleBeam() {	
	this.state 	   = -1;
	this.lastState = -1;

	this.particleTimer = TimeOutFactory.getTimeOut(0, -1, this, function(){
		var rand;

		for(var i=0; i<this.particlesInCycle; i++){
			rand = Math.random();

			ParticleBeam.ParticleArguments[0] = NumberUtils.interpolate(rand, this.start.x, this.end.x);
			ParticleBeam.ParticleArguments[1] = NumberUtils.interpolate(rand, this.start.y, this.end.y);
			ParticleBeam.ParticleArguments[2] = this.angle;
			ParticleBeam.ParticleArguments[3] = this.particleColor;
			ParticleBeam.ParticleArguments[4] = this.particleSize;
			ParticleBeam.ParticleArguments[5] = this.maxParticleSpeed;
			ParticleBeam.ParticleArguments[6] = this.particleLife;

			this.container.add(this.particleType, ParticleBeam.ParticleArguments);			
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
	this.particleLife 	  = particleLife 	 ? particleLife : 30;

	this.particleTimer.delay = this.particleInterval;
}

ParticleBeam.prototype.on  = function(start, end)  { 
	this.start = start;
	this.end   = end;
	this.angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
	this.angle += Math.PI/2;

	this.state = ParticleBeam.ON;  

	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.particleTimer.start();
	this.lastState = this.state;
}
ParticleBeam.prototype.off = function()  { 
	this.state = ParticleBeam.OFF; 

	this.clearAllIntervals();
	this.lastState = this.state;
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
	this.particleTimer.remove();

	DestroyUtils.destroyAllProperties(this);
}