Rocket.easeFunctions1 	  = [Power1.easeIn, Power1.easeOut, Power1.easeInOut];
Rocket.easeFunctions2 	  = [Power2.easeIn, Power2.easeOut, Power2.easeInOut];
Rocket.exhaustPoints  	  = [{ x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }];
Rocket.ExplosionArguments = [null, null, null, null, null];

//Rocket - Swarm Rocket - Homing Rocket
//Abstract behaviour classes.

function Rocket() {
	if (typeof Exhaust === "undefined") { return; }
	this.exhaust = new Exhaust(this.getExhaustPoints, this);
}

Rocket.inheritsFrom( Attributes );

Rocket.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Rocket.prototype.init = function(x, y, deploy, target, container, rotation) {
	CircleCollider.prototype.init.call(this, 10);

	Attributes.prototype.init.call(this);

	this.x 		           = x; 
	this.y 		           = y;
	this.container         = container;
	this.deploy            = deploy;
	this.target            = target;
	this.rotation          = rotation;
	this.initialRotation   = rotation;

	this.moveToDeployPosition();
}

Rocket.prototype.moveToDeployPosition = function() {}

Rocket.prototype.update = function(delta) { 
	this.exhaust.update(); 
}

Rocket.prototype.getExhaustPoints = function(side, type) {
	var a = this.rotation + 90;

	var sin = Math.sin(a * (Math.PI/180));
	var cos = Math.cos(a * (Math.PI/180));

	var sinPerp = 0.0;
	var cosPerp = 0.0;
	var divide  = 2;

	if(type == Exhaust.NEUTRAL) { divide = 2; }
	if(type == Exhaust.UP)	    { divide = 1; }
	if(type == Exhaust.DOWN)    { divide = 2.5; }

	if(side){
		sinPerp = Math.sin((a-30)  * (Math.PI/180));
		cosPerp = Math.cos((a-30)  * (Math.PI/180));	
	}else{
		sinPerp = Math.sin((a+30)  * (Math.PI/180));
		cosPerp = Math.cos((a+30)  * (Math.PI/180));
	}

	var r = this.mainDimentionY;
	var x = this.x + this.centerX;
	var y = this.y + this.centerY;

	Rocket.exhaustPoints[0].x = x + cos * r;
	Rocket.exhaustPoints[0].y = y + sin * r;

	Rocket.exhaustPoints[1].x = x + cosPerp * r * 2/divide;
	Rocket.exhaustPoints[1].y = y + sinPerp * r * 2/divide;

	Rocket.exhaustPoints[2].x = x + cos  * r * 3/divide;
	Rocket.exhaustPoints[2].y = y + sin  * r * 3/divide;

	Rocket.exhaustPoints[3].x = x + cos  * r * 4/divide;
	Rocket.exhaustPoints[3].y = y + sin  * r * 4/divide;

	return Rocket.exhaustPoints;
}

Rocket.prototype.destroy = function() {
	this.exhaust.off();
	TweenMax.killTweensOf(this);
}

Rocket.prototype.onHPDiminished = function(other) {}
Rocket.prototype.onDamageBlocked = function(other) {}
Rocket.prototype.onDamageReceived = function(other) {}
Rocket.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
}

Rocket.smallInitConfig = function() {
	this.mainDimentionX = 7.5;
	this.mainDimentionY = this.mainDimentionX*2;
	this.centerX  = this.mainDimentionX/2;
	this.centerY  = this.mainDimentionY/2;	
}

Rocket.largeInitConfig = function() {
	this.mainDimentionX = 8.5;
	this.mainDimentionY = this.mainDimentionX*2 + 3;
	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;
}

Rocket.clusterInitConfig = function() {
	this.mainDimentionX = 12;
	this.mainDimentionY = 12;
	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;	
}

Rocket.smallDrawing = function(context) {
	context.strokeStyle = "#FFFFFF";
	
	context.beginPath();
	context.rect(0, 0, this.mainDimentionX, this.mainDimentionY);	
	
	context.rect(this.mainDimentionX/2 - this.mainDimentionX/4, this.mainDimentionY, this.mainDimentionX/2, this.mainDimentionX/2);

	context.moveTo(0, 0);
	context.lineTo(this.mainDimentionX/2, -this.mainDimentionX);
	context.lineTo(this.mainDimentionX, 0);

	context.closePath();

	context.stroke();
}

Rocket.largeDrawing = function(context) {
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	context.rect(0, 0, this.mainDimentionX, this.mainDimentionY);	

	context.rect(this.mainDimentionX/2 - this.mainDimentionX/4, this.mainDimentionY, this.mainDimentionX/2, this.mainDimentionX/2);

	context.moveTo(0, 0);
	context.lineTo(this.mainDimentionX/2, -this.mainDimentionX);
	context.lineTo(this.mainDimentionX, 0);

	context.moveTo(0, this.mainDimentionY/2);	
	context.lineTo(-5, (this.mainDimentionY/2)+5);
	context.lineTo(0, (this.mainDimentionY/2)+5);

	context.moveTo(this.mainDimentionX, this.mainDimentionY/2);
	context.lineTo(this.mainDimentionX+5, this.mainDimentionY/2+5);
	context.lineTo(this.mainDimentionX, this.mainDimentionY/2+5);

	context.closePath();

	context.stroke();
}

Rocket.clusterDrawing = function(context) {
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	context.rect(0, 0, this.mainDimentionX, this.mainDimentionY);	
	
	context.rect(this.mainDimentionX/2 - this.mainDimentionX/4, this.mainDimentionY, this.mainDimentionX/2, this.mainDimentionX/2);

	context.moveTo(0, 0);
	context.lineTo(2, -4);
	context.lineTo(10, -4);
	context.lineTo(12, 0);

	context.closePath();

	context.stroke();
}

Rocket.smallExplosion = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 30;
	Rocket.ExplosionArguments[4] = 100;
	this.container.add("Explosion_Damage", Rocket.ExplosionArguments);
}

Rocket.largeExplosion = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 45;
	Rocket.ExplosionArguments[4] = 220;
	this.container.add("Explosion_Damage", Rocket.ExplosionArguments);
}

Rocket.clusterExplosion = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 35;
	Rocket.ExplosionArguments[4] = 150;

	this.container.add("Explosion_Damage", Rocket.ExplosionArguments);

	for(var i=0; i<this.debryCount; i++){
		Rocket.ExplosionArguments[0] = this.x;
		Rocket.ExplosionArguments[1] = this.y;
		Rocket.ExplosionArguments[2] = this.container;

		this.container.add("Debry" , Rocket.ExplosionArguments);	
	}
}

function SwarmRocket() {
	Rocket.call(this);
}

SwarmRocket.inheritsFrom( Rocket );

SwarmRocket.prototype.moveToDeployPosition = function() {
	var inst = this;
	var pointsToTarget = [];
	
	TweenMax.to(inst, 0.4, {x:inst.deploy.x, ease:Rocket.easeFunctions1[Random.getRandomInt(0, Rocket.easeFunctions1.length)]});
	TweenMax.to(inst, 0.4, {y:inst.deploy.y, ease:Rocket.easeFunctions2[Random.getRandomInt(0, Rocket.easeFunctions2.length)], onComplete:function(){
		inst.exhaust.speedUp();
		
		var tx = inst.target.x;
		var ty = inst.target.y;
		
		var info = VectorUtils.getFullVectorInfo(inst.x, inst.y, tx, ty); 

		var secondAnchorX = inst.x+info.dir.x*info.distance/3 + (info.perp.x*Random.getRandomArbitary(-info.distance/10, info.distance/10));
		var secondAnchorY = inst.y+info.dir.y*info.distance/3 + (info.perp.y*Random.getRandomArbitary(-info.distance/10, info.distance/10));

		var thirdAnchorX = inst.x+info.dir.x*info.distance*(2/3) + (info.perp.x*Random.getRandomArbitary(-info.distance/10, info.distance/10));
		var thirdAnchorY = inst.y+info.dir.y*info.distance*(2/3) + (info.perp.y*Random.getRandomArbitary(-info.distance/10, info.distance/10));		

		var fourthAnchorX = tx + Random.getRandomArbitary(-20, 20);
		var fourthAnchorY = ty + Random.getRandomArbitary(-20, 20);

		pointsToTarget[0] = {x:inst.x, y:inst.y};
		pointsToTarget[1] = {x:secondAnchorX , y:secondAnchorY};
		pointsToTarget[2] = {x:thirdAnchorX, y:thirdAnchorY};
		pointsToTarget[3] = {x:fourthAnchorX, y:fourthAnchorY};

		var speed = BezierCurve.estimateLenght(25, pointsToTarget) / 700.0;

		TweenMax.to(inst, speed, {bezier:{values:pointsToTarget, autoRotate:90}, ease:Sine.easeIn, onComplete:function(){
			inst.alive = false;
		}}); 	
	}});

	this.exhaust.init(this.container);
	this.exhaust.slowDown();
}

function HomingRocket() {
	Rocket.call(this);
}

HomingRocket.inheritsFrom( Rocket );

HomingRocket.prototype.moveToDeployPosition = function() {
	var inst = this;
	inst.startLockOnMotion = false;

	this.acceleration = 0;

	TweenMax.to(inst, 0.4, {x:inst.deploy.x, y:inst.deploy.y, onComplete:function(){
		inst.exhaust.speedUp();
		inst.startLockOnMotion = true;
		inst.rotation 		   = inst.initialRotation;

		TweenMax.to(inst, 2, {acceleration:4});
	}});

	this.exhaust.init(this.container);
	this.exhaust.off();
}

HomingRocket.prototype.update = function(delta) {
	if(this.startLockOnMotion){
		this.targetAngle = (Math.atan2(this.y - this.target.y, this.x - this.target.x) * (180/Math.PI)) - 90;
		this.targetAngle = this.targetAngle - this.rotation;

		if (this.targetAngle > 180) this.targetAngle -= 360;
		if (this.targetAngle < -180) this.targetAngle += 360;
		
		this.deltaAngle = 400 * this.acceleration * delta;

		if (this.targetAngle > this.deltaAngle) 
			this.targetAngle = this.deltaAngle; 
		else if (this.targetAngle < -this.deltaAngle) 
			this.targetAngle = -this.deltaAngle;

		this.rotation += this.targetAngle;

		this.dirX = Math.cos((this.rotation-90) * (Math.PI/180) ) * 500;
		this.dirY = Math.sin((this.rotation-90) * (Math.PI/180) ) * 500;
		
		this.x += this.dirX * this.acceleration * delta;
		this.y += this.dirY * this.acceleration * delta;

		if(VectorUtils.inRange(this.x, this.y, this.target.x, this.target.y, 15)){
			this.alive = false;
		}
	}else{
		this.rotation += 30;
	}
	
	this.exhaust.update();	
}

//Below are the concrete Rocket classes.
//------------------------------------------------------------

//Swarm Rockets
//------------------------------------------------------------

function SmallSwarmRocket() {
	SwarmRocket.call(this);
	Rocket.smallInitConfig.call(this);
}

SmallSwarmRocket.inheritsFrom( SwarmRocket );

SmallSwarmRocket.prototype.init    = function()        { SwarmRocket.prototype.init.apply(this, arguments); }
SmallSwarmRocket.prototype.draw    = function(context) { Rocket.smallDrawing.call(this, context);           }

SmallSwarmRocket.prototype.destroy = function() { 
	SwarmRocket.prototype.destroy.call(this);
	Rocket.smallExplosion.call(this);	                
}

function LargeSwarmRocket() {
	SwarmRocket.call(this);
	Rocket.largeInitConfig.call(this);
}

LargeSwarmRocket.inheritsFrom( SwarmRocket );

LargeSwarmRocket.prototype.init    = function()        { SwarmRocket.prototype.init.apply(this, arguments); }
LargeSwarmRocket.prototype.draw    = function(context) { Rocket.largeDrawing.call(this, context);           }

LargeSwarmRocket.prototype.destroy = function() { 
	SwarmRocket.prototype.destroy.call(this);	
	Rocket.largeExplosion.call(this);					
}

function ClusterSwarmRocket() {
	Rocket.call(this);
	Rocket.clusterInitConfig.call(this);
}

ClusterSwarmRocket.inheritsFrom( SwarmRocket );

ClusterSwarmRocket.prototype.init = function(x, y, deploy, target, container, rotation, debryCount) {
	Rocket.prototype.init.call(this, x, y, deploy, target, container, rotation);
	this.debryCount = debryCount;
}

ClusterSwarmRocket.prototype.draw = function(context) { Rocket.clusterDrawing.call(this, context); }

ClusterSwarmRocket.prototype.destroy = function() { 
	SwarmRocket.prototype.destroy.call(this);
	Rocket.clusterExplosion.call(this);	
}

//Homing Rockets
//------------------------------------------------------------

function BadGuySmallHomingRocket() {
	HomingRocket.call(this);
	Rocket.smallInitConfig.call(this);
}

BadGuySmallHomingRocket.inheritsFrom( HomingRocket );

BadGuySmallHomingRocket.prototype.moveToDeployPosition = function() {
	var inst = this;
	inst.startLockOnMotion = false;

	TweenMax.to(inst, this.speed, {x:inst.deploy.x, y:inst.deploy.y, onComplete:function(){
		inst.exhaust.speedUp();
		inst.startLockOnMotion = true;
		inst.rotation 		   = inst.initialRotation;
	}});

	this.exhaust.init(this.container);
	this.exhaust.off();
}

BadGuySmallHomingRocket.prototype.init    = function(x, y, deploy, target, container, rotation, acceleration, speed) { 
	this.acceleration = Random.getRandomArbitary(acceleration.min, acceleration.max);
	this.speed        = Random.getRandomArbitary(speed.min, speed.max);

	HomingRocket.prototype.init.call(this, x, y, deploy, target, container, rotation); 
}
BadGuySmallHomingRocket.prototype.draw    = function(context) { Rocket.smallDrawing.call(this, context);           }

BadGuySmallHomingRocket.prototype.destroy = function() { 
	HomingRocket.prototype.destroy.call(this);
	Rocket.smallExplosion.call(this);	                
}

function SmallHomingRocket() {
	HomingRocket.call(this);
	Rocket.smallInitConfig.call(this);
}

SmallHomingRocket.inheritsFrom( HomingRocket );

SmallHomingRocket.prototype.init    = function()        { HomingRocket.prototype.init.apply(this, arguments); }
SmallHomingRocket.prototype.draw    = function(context) { Rocket.smallDrawing.call(this, context);           }

SmallHomingRocket.prototype.destroy = function() { 
	HomingRocket.prototype.destroy.call(this);
	Rocket.smallExplosion.call(this);	                
}

function LargeHomingRocket() {
	HomingRocket.call(this);
	Rocket.largeInitConfig.call(this);
}

LargeHomingRocket.inheritsFrom( HomingRocket );

LargeHomingRocket.prototype.init    = function()        { HomingRocket.prototype.init.apply(this, arguments); }
LargeHomingRocket.prototype.draw    = function(context) { Rocket.largeDrawing.call(this, context);           }

LargeHomingRocket.prototype.destroy = function() { 
	HomingRocket.prototype.destroy.call(this);
	Rocket.largeExplosion.call(this);					
}

function ClusterHomingRocket() {
	Rocket.call(this);
	Rocket.clusterInitConfig.call(this);
}

ClusterHomingRocket.inheritsFrom( HomingRocket );

ClusterHomingRocket.prototype.init = function(x, y, deploy, target, container, rotation, debryCount) {
	Rocket.prototype.init.call(this, x, y, deploy, target, container, rotation);
	this.debryCount = debryCount;
}

ClusterHomingRocket.prototype.draw = function(context) { Rocket.clusterDrawing.call(this, context); }

ClusterHomingRocket.prototype.destroy = function() { 
	HomingRocket.prototype.destroy.call(this);
	Rocket.clusterExplosion.call(this);	
}