function StraightBeam(beamProperties) {
	debugger;

	this.chargeRadius		    = beamProperties[0];
	this.burstColor1 			= beamProperties[1];
	this.burstColor2 			= beamProperties[2];
	this.burst1ParticlesInCycle = beamProperties[3];
	this.burst2ParticlesInCycle = beamProperties[4];
	this.beam1ParticlesInCycle  = beamProperties[5];
	this.beam2ParticlesInCycle  = beamProperties[6];
	this.beam1ParticlesLife     = beamProperties[7];
	this.beam2ParticlesLife     = beamProperties[8];

	this.beamCharge     = new ShotCharge(null, 0, 0, 0, 360, this.chargeRadius);
	this.beamBurstLong  = new ShotCharge(null, 0, 0, 0, 0, this.chargeRadius);
	this.beamBurstShort = new ShotCharge(null, 0, 0, 0, 0, this.chargeRadius);

	this.beam = new ParticleBeam();
	this.centerBeam = new ParticleBeam();
	
	this.onStart    = null;
	this.onComplete = null;

	this.burstTimer = TimeOutFactory.getTimeOut(0, 1, this, function(){ 
		this.burstTimer.stop();
		this.beamBurstLong.off();
		this.beamBurstShort.off();
		this.beam.off();
		this.centerBeam.off();	

		this.isFiring = false;
		this.isAiming = false;

		if(this.onComplete != null)
			this.onComplete();
	});

	this.shootTimer = TimeOutFactory.getTimeOut(400, 1, this, null);
}

StraightBeam.ColliderArguments = [null, null, null, null, null];

StraightBeam.prototype.init = function(container, origin, target, size, pieces, time, angleOffset) {
	this.container  = container;
	this.origin     = origin;
	this.target     = target;
	this.size       = size;
	this.pieces     = pieces;
	this.time       = time;

	this.angleOffset = angleOffset != null ? angleOffset : 0;

	this.beamCharge.parent     = this.origin;
	this.beamBurstLong.parent  = this.origin;
	this.beamBurstShort.parent = this.origin;

	this.beamCharge.init(TopLevel.container, 30, this.burstColor1, 7);
	this.beamBurstLong.init(TopLevel.container, 1, this.burstColor2, 4, "BurstParticle", this.burst1ParticlesInCycle);
	this.beamBurstShort.init(TopLevel.container, 1, this.burstColor1, 4, "BurstParticle", this.burst2ParticlesInCycle);

	this.beam.init(TopLevel.container, 1, this.burstColor1, 3, "StraightParticle", this.beam1ParticlesInCycle, 90, this.beam1ParticlesLife);
	this.centerBeam.init(TopLevel.container, 1, this.burstColor2, 5, "StraightParticle", this.beam2ParticlesInCycle, 50, this.beam2ParticlesLife);

	this.burstTimer.delay = this.time;
	this.isFiring  		  = false;
	this.isAiming         = false;  
}

StraightBeam.prototype.update = function() {
	this.beamCharge.update();
	this.beamBurstLong.update();
	this.beamBurstShort.update();	
	this.beam.update();
	this.centerBeam.update();
}

StraightBeam.prototype.fire = function() {
	debugger;

	var info = VectorUtils.getFullVectorInfo(this.origin.x, this.origin.y, this.target.x, this.target.y);
	var angle = Math.atan2(this.target.y - this.origin.y, this.target.x - this.origin.x) * (180/Math.PI);

	angle  += this.angleOffset;
	
	var tX = this.origin.x + Math.cos(angle * (Math.PI/180)) * info.distance;
	var tY = this.origin.y + Math.sin(angle * (Math.PI/180)) * info.distance;

	var info = VectorUtils.getFullVectorInfo(this.origin.x, this.origin.y, tX, tY);
	var angle = Math.atan2(tY - this.origin.y, tX - this.origin.x) * (180/Math.PI);
	
	this.shootTimer.start();
	this.isAiming = true;

	this.shootTimer.callback = function(){
		var start;
		var end;

		for(var i=0; i<this.pieces; i++){
			var x = this.origin.x + (info.dir.x * (this.size*2) * i);
			var y = this.origin.y + (info.dir.y * (this.size*2) * i);

			StraightBeam.ColliderArguments[0] = x;
			StraightBeam.ColliderArguments[1] = y;
			StraightBeam.ColliderArguments[2] = this.size;
			StraightBeam.ColliderArguments[3] = this.time;
			StraightBeam.ColliderArguments[4] = this.origin;

			var collider = this.container.add("BeamCollider", StraightBeam.ColliderArguments, 0, true);	

			if(i==0) { start = collider; }
			if(i==this.pieces-1){ end = collider;   }
		}

		this.beamBurstLong.on(angle-10, angle+10);
		this.beamBurstShort.on(angle-45, angle+45);
		
		this.beam.on(start, end);
		this.centerBeam.on(start, end);

		this.burstTimer.start();
		this.shootTimer.stop();

		this.isFiring = true;

		if(this.onStart != null)
			this.onStart();
	}	
}

StraightBeam.prototype.charge = function() {
	this.beamCharge.on();
}

StraightBeam.prototype.disable = function() {
	this.beamCharge.off();		
}

function BeamCollider() {
	CircleCollider.call(this);

	this.timer = TimeOutFactory.getTimeOut(0, 1, this, function(){ 
		this.timer.stop();
		this.alive = false;
	});
}

BeamCollider.inheritsFrom( CircleCollider );

BeamCollider.prototype.init = function(x, y, radius, time, user) {
	this.parent.init.call(this, x, y, radius);
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

BeamCollider.prototype.draw = function(context) {
	/*context.strokeStyle = "#FF0000";

	context.beginPath();
	context.arc(0, 0, this.collider.r, 0, Math.PI*2);
	context.closePath();

	context.stroke();*/
}

BeamCollider.prototype.getCollisionId = function(){
	return "BeamCollider";
}

BeamCollider.prototype.onCollide = function(other){
	
}



