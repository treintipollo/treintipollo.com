Exhaust.NEUTRAL = 0;
Exhaust.UP 		= 1;
Exhaust.DOWN 	= 2;
Exhaust.EXTRA   = 3;
Exhaust.OFF 	= 4;

Exhaust.INIT     = "init";
Exhaust.REGULAR  = "neutral";
Exhaust.FAST 	 = "speedUp";
Exhaust.SLOW 	 = "slowDown";
Exhaust.POWER_UP = "powerUp";
Exhaust.OFF 	 = "off";
Exhaust.UPDATE   = "update";

function Exhaust(particleBezierPoints, parentContext) {
	this.particleBezierPoints = particleBezierPoints;
	this.colors = ["#F2A007", "#FF0000", "#A30808", "#333DCC"];

	this.neutralTimer   = TimeOutFactory.getTimeOut(50, -1, this, function(){ this.createParticles(parentContext, this.state, 15.0); });
	this.speedUpTimer   = TimeOutFactory.getTimeOut(40, -1, this, function(){ this.createParticles(parentContext, this.state, 15.0); });
	this.speedDownTimer = TimeOutFactory.getTimeOut(70, -1, this, function(){ this.createParticles(parentContext, this.state, 20.0); });
}

Exhaust.ParticleArguments = [null, null, null, null, null, null];

Exhaust.prototype.setColors = function(colors) {
	this.colors = colors;
}

Exhaust.prototype.init = function(container) {
	this.container = container;

	this.state 			= -1;
	this.lastState		= -1;
	this.particleSide   = true;	
}

Exhaust.prototype.neutral  = function() { this.state = Exhaust.NEUTRAL; }
Exhaust.prototype.speedUp  = function() { this.state = Exhaust.UP;      }
Exhaust.prototype.slowDown = function() { this.state = Exhaust.DOWN;    }
Exhaust.prototype.powerUp  = function() { this.state = Exhaust.EXTRA;   }

Exhaust.prototype.off = function() { 
	this.clearAllIntervals();
	this.state = Exhaust.OFF;     
}

Exhaust.prototype.update = function() {
	if(!this.hasOwnProperty("state")){ return; }
	if(this.state == this.lastState){ return; }

	this.clearAllIntervals();

	if(this.state == Exhaust.NEUTRAL) { this.neutralTimer.start();   }
	if(this.state == Exhaust.UP)	  { this.speedUpTimer.start();   }
	if(this.state == Exhaust.EXTRA)	  { this.speedUpTimer.start();   }
	if(this.state == Exhaust.DOWN)	  { this.speedDownTimer.start(); }

	this.lastState = this.state;
}

Exhaust.prototype.clearAllIntervals = function() {
	this.neutralTimer.stop();
	this.speedUpTimer.stop();
	this.speedDownTimer.stop();
}

Exhaust.prototype.destroy = function() {
	this.neutralTimer.remove();
	this.speedUpTimer.remove();
	this.speedDownTimer.remove();
}

Exhaust.prototype.createParticles = function(parentContext, state, life) {	
	this.particleSide = !this.particleSide;
	
	Exhaust.ParticleArguments[0] = state;
	Exhaust.ParticleArguments[1] = parentContext;
	Exhaust.ParticleArguments[2] = this.particleBezierPoints;
	Exhaust.ParticleArguments[3] = this.colors[state];
	Exhaust.ParticleArguments[4] = life;
	Exhaust.ParticleArguments[5] = this.particleSide;

	this.container.add("ExhaustParticle", Exhaust.ParticleArguments);
}