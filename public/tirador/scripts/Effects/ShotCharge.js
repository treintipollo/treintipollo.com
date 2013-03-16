ShotCharge.ON  = 0;
ShotCharge.OFF = 1;

ShotCharge.ParticleArguments = [];

function ShotCharge(parent, xOffset, yOffset, startAngle, endAngle, radius, times) {
	this.startAngle = startAngle;
	this.endAngle   = endAngle;
	this.radius     = radius;
	this.parent     = parent;
	this.xOffset    = xOffset;
	this.yOffset    = yOffset;

	this.times = times ? times : -1;

	this.state 	   = -1;
	this.lastState = -1;
	this.particles = [];

	this.createTimer = function(){
		if (typeof TimeOutFactory === "undefined") { return; }

		if(!this.particleTimer){
			this.particleTimer = TimeOutFactory.getTimeOut(0, this.times, this, function(){
				for(var i=0; i<this.particlesInCycle; i++){
					this.createParticles();	
				}
			});
		}
	}

	this.createTimer.call(this);
}

ShotCharge.prototype.init = function(container, particleInterval, particleColor, particleSize, particleType, particlesInCycle, particleMinSpeed, particleMaxSpeed) {
	this.createTimer.call(this);

	this.container = container;
	
	this.particleInterval = particleInterval ? particleInterval : 50;
	this.particleColor    = particleColor    ? particleColor    : "#FFFFFF";
	this.particleSize     = particleSize     ? particleSize     : 2.5;
	this.particleType     = particleType     ? particleType     : "ShotChargeParticle";
	this.particlesInCycle = particlesInCycle ? particlesInCycle : 1;	
	this.particleMinSpeed = particleMinSpeed ? particleMinSpeed : null;
	this.particleMaxSpeed = particleMaxSpeed ? particleMaxSpeed : null;

	this.particleTimer.delay = this.particleInterval;
}

ShotCharge.prototype.initFromObject = function(obj, origin) {
	var angle = Math.atan2(this.parent.y - origin.y, this.parent.x - origin.x) * (180/Math.PI);

	this.container 		  = TopLevel.container;
	this.radius     	  = obj.radius;
	this.startAngle 	  = obj.range + angle;
	this.endAngle   	  = -obj.range + angle;
	this.particleInterval = obj.pInterval;
	this.particleColor    = obj.pColor;
	this.particleSize     = obj.pSize;
	this.particleType     = obj.pType;
	this.particlesInCycle = obj.pInCycle;	

	this.particleMinSpeed = null;
	this.particleMaxSpeed = null;

	this.particleTimer.delay = this.particleInterval;
}

ShotCharge.prototype.on  = function(startAngle, endAngle)  { 
	if(startAngle != null){ this.startAngle = startAngle; }
	if(endAngle != null)  { this.endAngle = endAngle;     }

	this.state = ShotCharge.ON;

	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.particleTimer.start();
	this.lastState = this.state; 
}
ShotCharge.prototype.off = function()  { 
	this.state = ShotCharge.OFF; 
	
	this.clearAllIntervals();
	this.lastState = this.state; 
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
	if(!this.particleTimer){
		debugger;
	}
	
	this.particleTimer.stop();
}

ShotCharge.prototype.destroy = function() {
	this.clearAllIntervals();

	for(var i=0; i<this.particles.length; i++){
		this.particles[i].setDestroyMode(GameObject.NO_CALLBACKS);
	}

	this.particleTimer.remove();

	DestroyUtils.destroyAllProperties(this);
}

ShotCharge.prototype.createArguments = function() {
	ShotCharge.ParticleArguments[0] = this.parent;
	ShotCharge.ParticleArguments[1] = this.xOffset;
	ShotCharge.ParticleArguments[2] = this.yOffset;
	ShotCharge.ParticleArguments[3] = this.radius;
	ShotCharge.ParticleArguments[4] = this.startAngle;
	ShotCharge.ParticleArguments[5] = this.endAngle;
	ShotCharge.ParticleArguments[6] = this.particleColor;
	ShotCharge.ParticleArguments[7] = this.particleSize;
	ShotCharge.ParticleArguments[8] = this.particleMinSpeed;
	ShotCharge.ParticleArguments[9] = this.particleMaxSpeed;
}

ShotCharge.prototype.createParticles = function() {
	this.createArguments();

	var particle = this.container.add(this.particleType, ShotCharge.ParticleArguments);
	
	if(particle != null){
		this.particles.push(particle);

		particle.addOnDestroyCallback(this, function(obj){
			this.particles.splice(this.particles.indexOf(obj), 1);
		});
	}
}

function ShotChargeRadius(parent, xOffset, yOffset, angle, radius, times){
	ShotCharge.call(this, parent, xOffset, yOffset, 0, 0, radius, times);
	this.angle = angle;
}

ShotChargeRadius.inheritsFrom( ShotCharge );

ShotChargeRadius.prototype.init = function(container, particleInterval, particleColor, particleSize, particleType, particlesInCycle, particleMinSpeed, particleMaxSpeed, spawnRadius) {
	ShotCharge.prototype.init.call(this, container, particleInterval, particleColor, particleSize, particleType, particlesInCycle, particleMinSpeed, particleMaxSpeed);	
	this.spawnRadius = spawnRadius ? spawnRadius : 20;
}

ShotChargeRadius.prototype.createArguments = function() {
	ShotCharge.ParticleArguments[0] = this.parent;
	ShotCharge.ParticleArguments[1] = this.xOffset;
	ShotCharge.ParticleArguments[2] = this.yOffset;
	ShotCharge.ParticleArguments[3] = this.radius;
	ShotCharge.ParticleArguments[4] = this.angle;
	ShotCharge.ParticleArguments[5] = this.particleColor;
	ShotCharge.ParticleArguments[6] = this.particleSize;
	ShotCharge.ParticleArguments[7] = this.particleMinSpeed;
	ShotCharge.ParticleArguments[8] = this.particleMaxSpeed;
	ShotCharge.ParticleArguments[9] = this.spawnRadius;
}