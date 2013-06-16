function BezierParticleBeam() {	
	ParticleBeam.call(this);

	this.startBeamLength = 0;

	var point = {x:0, y:0};

	this.particleTimer.callback = function() {
		for(var i=0; i<this.particlesInCycle; i++){
			point = BezierCurve.getPoint(Random.getRandomArbitary(0, this.startBeamLength), this.bezierPoints());

			ParticleBeam.ParticleArguments[0] = point.x;
			ParticleBeam.ParticleArguments[1] = point.y;

			ParticleBeam.ParticleArguments[2] = 0;
			ParticleBeam.ParticleArguments[3] = this.particleColor;
			ParticleBeam.ParticleArguments[4] = this.particleSize;
			ParticleBeam.ParticleArguments[5] = this.maxParticleSpeed;
			ParticleBeam.ParticleArguments[6] = this.particleLife;

			this.container.add(this.particleType, ParticleBeam.ParticleArguments);			
		}
	}
}

BezierParticleBeam.inheritsFrom( ParticleBeam );

BezierParticleBeam.prototype.on = function(bezierPoints)  { 
	if(!this.particleTimer) {
		BezierParticleBeam.call(this);
	}

	this.startBeamLength = 0;

	TweenMax.to(this, 0.3, {
		startBeamLength: 1,
		ease: Linear.easeNone,
		onUpdateScope: this,
		onUpdate: function() {
			this.onStep( BezierCurve.getPoint(this.startBeamLength, this.bezierPoints() ) );
		},
		onCompleteScope: this,
		onComplete: function() {
			TimeOutFactory.getTimeOut(700, 1, this, this.onComplete, true).start();
		}
	});

	this.bezierPoints = bezierPoints;

	this.state = ParticleBeam.ON;  

	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.particleTimer.start();
	this.lastState = this.state;
}