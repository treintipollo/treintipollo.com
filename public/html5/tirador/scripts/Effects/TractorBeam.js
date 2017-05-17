TractorBeam.ParticleArguments = [];

function TractorBeam(particleBezierPoints, parentContext) {
	this.particleBezierPoints = particleBezierPoints;
	this.timer = TimeOutFactory.getTimeOut(30, -1, this, function(){ this.createParticles(parentContext, 80.0); });
}

TractorBeam.prototype.init = function(container, onComplete) {
	this.container = container;
	this.onComplete = onComplete;
}

TractorBeam.prototype.on = function() { 
	this.timer.start();
	this.firstParticleCreated = false;
}

TractorBeam.prototype.off = function() { 
	this.timer.stop();
}

TractorBeam.prototype.destroy = function() {
	this.timer.stop();
	this.timer.remove();
}

TractorBeam.prototype.createParticles = function(parentContext, life) {	
	this.particleSide = !this.particleSide;
	
	TractorBeam.ParticleArguments[0] = parentContext;
	TractorBeam.ParticleArguments[1] = this.particleBezierPoints;
	TractorBeam.ParticleArguments[2] = "#1BE0BF";
	TractorBeam.ParticleArguments[3] = life;
	TractorBeam.ParticleArguments[4] = this.particleSide;

	var particle = this.container.add("TractorBeamParticle", TractorBeam.ParticleArguments);

	if(particle && !this.firstParticleCreated) {
		particle.addOnRecicleCallback(this, function(){
			if(this.onComplete)
				this.onComplete.call(parentContext);
		})
	}

	this.firstParticleCreated = true;		
}