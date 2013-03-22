function StraightBeam(beamProperties) {
	this.chargeRadius		    = beamProperties[0];
	this.chargeColor 			= beamProperties[1];
	this.chargeParticleSize	    = beamProperties[2];
	this.burstColor1 			= beamProperties[3];
	this.burstColor2 			= beamProperties[4];
	this.burstParticleSize 		= beamProperties[5];
	this.burst1ParticlesInCycle = beamProperties[6];
	this.beam1ParticlesInCycle  = beamProperties[7];
	this.beam2ParticlesInCycle  = beamProperties[8];
	this.beam1ParticlesLife     = beamProperties[9];
	this.beam2ParticlesLife     = beamProperties[10];
	this.beamParticleSize 		= beamProperties[11];

	this.beamCharge     = new ShotCharge(null, 0, 0, 0, 360, this.chargeRadius);
	this.beamBurstShort = new ShotCharge(null, 0, 0, 0, 0, this.chargeRadius);

	this.beam 		= new ParticleBeam();
	this.centerBeam = new ParticleBeam();
	
	this.onStart    = null;
	this.onComplete = null;

	this.collider = [];

	this.burstTimer = TimeOutFactory.getTimeOut(0, 1, this, function(){ 
		this.forceDisable();
	});

	this.shootTimer = TimeOutFactory.getTimeOut(0, 1, this, null);
}

StraightBeam.ColliderArguments = [null, null, null, null, null];

StraightBeam.prototype.init = function(container, origin, target, beamProperties) {
	this.container  = container;
	this.origin     = origin;
	this.target     = target;

	this.size        = beamProperties[0];
	this.pieces      = beamProperties[1];
	this.time        = beamProperties[2];
	this.shotDelay   = beamProperties[3];
	this.angleOffset = beamProperties[4] != null ? beamProperties[4] : 0;

	this.beamCharge.parent     = this.origin;
	this.beamBurstShort.parent = this.origin;

	this.beamCharge.init(TopLevel.container, 30, this.chargeColor, this.chargeParticleSize);
	this.beamBurstShort.init(TopLevel.container, 1, this.burstColor1, this.burstParticleSize, "BurstParticle", this.burst1ParticlesInCycle);

	this.beam.init(TopLevel.container, 1, this.burstColor1, this.beamParticleSize/2, "StraightParticle", this.beam1ParticlesInCycle, 90, this.beam1ParticlesLife);
	this.centerBeam.init(TopLevel.container, 1, this.burstColor2, this.beamParticleSize, "StraightParticle", this.beam2ParticlesInCycle, 50, this.beam2ParticlesLife);

	this.burstTimer.delay = this.time;
	this.shootTimer.delay = this.shotDelay;  
}

StraightBeam.prototype.update = function() { }

StraightBeam.prototype.fire = function(fireAngle) {
	var target = {x:0, y:0};

	if(fireAngle != null){
		target.x = this.origin.x + Math.cos(fireAngle * (Math.PI/180)) * 1000;
		target.y = this.origin.y + Math.sin(fireAngle * (Math.PI/180)) * 1000;	
	}else{
		target.x = this.target.x;
		target.y = this.target.y;	
	}

	var info = VectorUtils.getFullVectorInfo(this.origin.x, this.origin.y, target.x, target.y);
	var angle = Math.atan2(target.y - this.origin.y, target.x - this.origin.x) * (180/Math.PI);

	angle  += this.angleOffset;
	
	var tX = this.origin.x + Math.cos(angle * (Math.PI/180)) * info.distance;
	var tY = this.origin.y + Math.sin(angle * (Math.PI/180)) * info.distance;

	var info = VectorUtils.getFullVectorInfo(this.origin.x, this.origin.y, tX, tY);
	var angle = Math.atan2(tY - this.origin.y, tX - this.origin.x) * (180/Math.PI);
	
	this.shootTimer.start();
		
	this.shootTimer.callback = function(){
		var start = null;
		var end = null;

		var d = (this.size*2) + (this.size/2);

		for(var i=0; i<this.pieces; i++){
			var x = this.origin.x + (info.dir.x * d * i);
			var y = this.origin.y + (info.dir.y * d * i);

			StraightBeam.ColliderArguments[0] = x;
			StraightBeam.ColliderArguments[1] = y;
			StraightBeam.ColliderArguments[2] = this.size;
			StraightBeam.ColliderArguments[3] = this.time;
			StraightBeam.ColliderArguments[4] = this.origin;

			if( (x+d > 0 && x-d < TopLevel.canvas.width) && (y+d > 0 && y-d < TopLevel.canvas.height) ){
				var collider = this.container.add("BeamCollider", StraightBeam.ColliderArguments);	

				if(collider){
					if(start == null){
						start = collider;
					} 
				
					end = collider;

					this.collider.push(collider);
				}
			}
		}

		this.beamBurstShort.on(angle-45, angle+45);
		
		this.beam.on(start, end);
		this.centerBeam.on(start, end);

		this.burstTimer.start();
		this.shootTimer.stop();

		if(this.onStart != null)
			this.onStart();
	}	
}

StraightBeam.prototype.charge = function() {
	this.beamCharge.on();
}

StraightBeam.prototype.disable = function() {
	this.beamCharge.off();		
	this.beamBurstShort.off();
	this.beam.off();
	this.centerBeam.off();

	this.shootTimer.stop();
	this.burstTimer.stop();

	for(var i=0; i<this.collider.length; i++){
		this.collider[i].alive = false;
	}

	this.collider.length = 0;
}

StraightBeam.prototype.forceDisable = function() {
	this.disable();

	if(this.onComplete != null)
		this.onComplete();
}

StraightBeam.prototype.destroy = function() {
	this.beamCharge.destroy();    
	this.beamBurstShort.destroy();
	this.beam.destroy(); 		
	this.centerBeam.destroy(); 
	this.burstTimer.remove();
	this.shootTimer.remove();
}

BeamCollider.inheritsFrom( Attributes );

function BeamCollider() {
	this.timer = TimeOutFactory.getTimeOut(0, 1, this, function(){ 
		this.timer.stop();
		this.alive = false;
	});
}

BeamCollider.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

BeamCollider.prototype.init = function(x, y, radius, time, user) {
	CircleCollider.prototype.init.call(this, radius);

	this.parent.init.call(this);

	this.x = x;
	this.y = y;

	this.timer.delay = time;
	this.timer.start();	

	this.user = user;
	this.lastUserX = user.x;
	this.lastUserY = user.y;
}

BeamCollider.prototype.update = function(delta) {
	var difX = this.user.x - this.lastUserX;
	var difY = this.user.y - this.lastUserY;

	this.x += difX;
	this.y += difY;

	this.lastUserX = this.user.x;
	this.lastUserY = this.user.y;	
}

BeamCollider.prototype.destroy = function() {
	this.timer.stop();
}

BeamCollider.prototype.draw = function(context) {
	/*context.strokeStyle = "#FF0000";

	context.beginPath();
	context.arc(0, 0, this.collider.r, 0, Math.PI*2);
	context.closePath();

	context.stroke();*/
}