//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

function BadGuyRocket() {
	HomingRocket.call(this);
}

BadGuyRocket.inheritsFrom(HomingRocket);

BadGuyRocket.prototype.init = function(x, y, deploy, target, container, rotation, acceleration, speed, deathRange) {
	BadGuyRocket.prototype.calculateAngle       = this.tProto.calculateAngle;
	BadGuyRocket.prototype.unlockedUpdate       = this.tProto.unlockedUpdate;
	BadGuyRocket.prototype.draw 		        = this.tProto.draw;
	BadGuyRocket.prototype.destroy 		        = this.tProto.destroy;
	BadGuyRocket.prototype.update 		        = this.tProto.update;
	BadGuyRocket.prototype.checkDeathCondition  = this.tProto.checkDeathCondition;
	BadGuyRocket.prototype.moveToDeployPosition = this.tProto.moveToDeployPosition;

	this.acceleration = Random.getRandomArbitary(acceleration.min, acceleration.max);
	this.speed = Random.getRandomArbitary(speed.min, speed.max);
	this.deathRange = deathRange;

	this.tProto.init.apply(this, arguments);
}

BadGuyRocket.prototype.moveToDeployPosition = function() {
	var inst = this;
	inst.startLockOnMotion = false;

	TweenMax.to(inst, this.speed, {
		x: inst.deploy.x,
		y: inst.deploy.y,
		onComplete: function() {
			inst.exhaust.speedUp();
			inst.startLockOnMotion = true;
			inst.rotation = inst.initialRotation;
		}
	});

	this.exhaust.init(this.container);
	this.exhaust.off();
}

BadGuyRocket.prototype.checkDeathCondition = function() {}
BadGuyRocket.prototype.unlockedUpdate      = function() {}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

function BadGuySmallAimedRocket() {}

BadGuySmallAimedRocket.inheritsFrom(BadGuyRocket);

BadGuySmallAimedRocket.prototype.calculateAngle = function() {
	this.targetAngle = (Math.atan2(this.y - this.targetY, this.x - this.targetX) * (180 / Math.PI)) - 90;
	this.targetAngle = this.targetAngle - this.rotation;
}

BadGuySmallAimedRocket.prototype.checkDeathCondition = function() {
	if(VectorUtils.inRange(this.x, this.y, this.targetX, this.targetY, this.deathRange)){
		this.alive = false;
	}
}

BadGuySmallAimedRocket.prototype.unlockedUpdate = function() {
	this.rotation += 30;
	this.targetX = this.target.x;
	this.targetY = this.target.y;
}

BadGuySmallAimedRocket.prototype.init = function(x, y, deploy, target, container, rotation, acceleration, speed, deathRange) {
	Rocket.smallInitConfig.call(this);
	
	this.targetX = 0;
	this.targetY = 0;

	HomingRocket.prototype.init.call(this, x, y, deploy, target, container, rotation);
}

BadGuySmallAimedRocket.prototype.draw = function(context) {
	Rocket.smallDrawing.call(this, context);
}

BadGuySmallAimedRocket.prototype.destroy = function() {
	HomingRocket.prototype.destroy.call(this);
	Rocket.smallExplosion.call(this);
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

function BadGuyLargeHomingRocket() {}

BadGuyLargeHomingRocket.inheritsFrom(BadGuyRocket);

BadGuyLargeHomingRocket.prototype.init = function(x, y, deploy, target, container, rotation, acceleration, speed, deathRange) {
	Rocket.largeInitConfig.call(this);
	HomingRocket.prototype.init.call(this, x, y, deploy, target, container, rotation);
}

BadGuyLargeHomingRocket.prototype.calculateAngle = function() {
	this.targetAngle = (Math.atan2(this.y - this.target.y, this.x - this.target.x) * (180/Math.PI)) - 90;
	this.targetAngle = this.targetAngle - this.rotation;
}

BadGuyLargeHomingRocket.prototype.unlockedUpdate = function() {
	this.rotation += 30;
}

BadGuyLargeHomingRocket.prototype.checkDeathCondition = function() {
	if(VectorUtils.inRange(this.x, this.y, this.target.x, this.target.y, this.deathRange)){
		this.alive = false;
	}
}

BadGuyLargeHomingRocket.prototype.draw = function(context) {
	Rocket.largeDrawing.call(this, context);
}

BadGuyLargeHomingRocket.prototype.destroy = function() {
	HomingRocket.prototype.destroy.call(this);
	Rocket.largeExplosion.call(this);
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

function BadGuyClusterAimedRocket() {}

BadGuyClusterAimedRocket.inheritsFrom(BadGuyRocket);

BadGuyClusterAimedRocket.prototype.init = function(x, y, deploy, target, container, rotation, acceleration, speed, deathRange) {
	Rocket.clusterInitConfig.call(this);
	HomingRocket.prototype.init.call(this, x, y, deploy, target, container, rotation);
}

BadGuyClusterAimedRocket.prototype.draw = function(context) {
	Rocket.clusterDrawing.call(this, context);
}

BadGuyClusterAimedRocket.prototype.destroy = function() {
	HomingRocket.prototype.destroy.call(this);
	Rocket.clusterExplosion.call(this);
}

BadGuyClusterAimedRocket.prototype.checkDeathCondition = function() {
	if(!ScreenUtils.isInScreenBoundsXY(this.x, this.y, 20, 20)){
		this.alive = false;
	}
}

BadGuyClusterAimedRocket.prototype.update = function(delta) {
	if(this.startLockOnMotion){		
		this.x += ( Math.cos((this.initialRotation - 90) * (Math.PI/180) ) ) * this.acceleration * delta * 500;
		this.y += ( Math.sin((this.initialRotation - 90) * (Math.PI/180) ) ) * this.acceleration * delta * 500;
		
		this.rotation = this.initialRotation;

		this.checkDeathCondition();
	}else{
		this.unlockedUpdate();
	}
	
	this.exhaust.update();	
}

BadGuyClusterAimedRocket.prototype.unlockedUpdate = function() {
	this.rotation += 30;
}