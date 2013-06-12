BezierParticleBeam.inheritsFrom( ParticleBeam );

function BezierParticleBeam() {	
	ParticleBeam.call(this);

	var point = {x:0, y:0};
	
	this.particleTimer.callback = function() {
		for(var i=0; i<this.particlesInCycle; i++){
			point = BezierCurve.getPoint(Math.random(), this.bezierPoints();

			ParticleBeam.ParticleArguments[0] = point.x;
			ParticleBeam.ParticleArguments[1] = point.y;
			ParticleBeam.ParticleArguments[2] = this.angle;
			ParticleBeam.ParticleArguments[3] = this.particleColor;
			ParticleBeam.ParticleArguments[4] = this.particleSize;
			ParticleBeam.ParticleArguments[5] = this.maxParticleSpeed;
			ParticleBeam.ParticleArguments[6] = this.particleLife;

			this.container.add(this.particleType, ParticleBeam.ParticleArguments);			
		}
	}
}

BezierParticleBeam.prototype.on  = function(bezierPoints)  { 
	this.bezierPoints      = bezierPoints;

	this.state = ParticleBeam.ON;  

	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.particleTimer.start();
	this.lastState = this.state;
}