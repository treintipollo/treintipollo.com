ExplosionsArea.ParticleArguments = [null, null, null, null];

function ExplosionsArea() {	
	this.explosionTimer = TimeOutFactory.getTimeOut(0, -1, this, function(){
		this.createExplosion();	
	});
}

ExplosionsArea.prototype.init = function(origin, radius, sizeRange, explosionAmount, explosionDelay, onComplete) {
	this.origin    = origin;
	this.radius    = radius;
	this.sizeRange = sizeRange;	
	
	this.explosionTimer.delay           = explosionDelay;
	this.explosionTimer.repeateCount    = explosionAmount;
	this.explosionTimer.initRepeatCount = explosionAmount;
	this.explosionTimer.onComplete      = onComplete;

	this.explosionTimer.start();
}

ExplosionsArea.prototype.stop = function() {
	this.explosionTimer.stop();	
}

ExplosionsArea.prototype.destroy = function() {
	this.explosionTimer.remove();
	DestroyUtils.destroyAllProperties(this);
}

ExplosionsArea.prototype.createExplosion = function() {
	ExplosionsArea.ParticleArguments[0] = this.origin.x + Random.getRandomInt(-this.radius, this.radius);
	ExplosionsArea.ParticleArguments[1] = this.origin.y + Random.getRandomInt(-this.radius, this.radius);
	ExplosionsArea.ParticleArguments[2] = Random.getRandomInt(0, 360);
	ExplosionsArea.ParticleArguments[3] = Random.getRandomInt(this.sizeRange/2, this.sizeRange);
	ExplosionsArea.ParticleArguments[4] = ExplosionsArea.ParticleArguments[3] + ExplosionsArea.ParticleArguments[3]*0.7;

	TopLevel.container.add("Explosion_Effect", ExplosionsArea.ParticleArguments, 0);
}