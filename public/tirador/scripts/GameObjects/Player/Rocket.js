Rocket.easeFunctions1 	  = [Power1.easeIn, Power1.easeOut, Power1.easeInOut];
Rocket.easeFunctions2 	  = [Power2.easeIn, Power2.easeOut, Power2.easeInOut];
Rocket.exhaustPoints  	  = [{ x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }];
Rocket.ExplosionArguments = [null, null, null, null, null];

function Rocket() {
	if (typeof Exhaust === "undefined") {
		return;
	}

	this.mainDimentionX = 7.5;
	this.mainDimentionY = this.mainDimentionX*2;

	this.centerX  = this.mainDimentionX/2;
	this.centerY  = this.mainDimentionY/2;

	this.exhaust = new Exhaust(this.getExhaustPoints, this);
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 10);
}

Rocket.inheritsFrom( GameObject );

Rocket.prototype.init = function(x, y, deploy, target, container) {
	this.x 		   = x; 
	this.y 		   = y;
	this.container = container;
	this.deploy    = deploy;
	this.target    = target;
	this.rotation  = 0;

	var inst = this;
	var pointsToTarget = [];

	TweenMax.to(inst, 0.4, {x:inst.deploy.x, ease:Rocket.easeFunctions1[Random.getRandomInt(0, Rocket.easeFunctions1.length)]});
	TweenMax.to(inst, 0.4, {y:inst.deploy.y, ease:Rocket.easeFunctions2[Random.getRandomInt(0, Rocket.easeFunctions2.length)], onComplete:function(){
		
		var info = VectorUtils.getFullVectorInfo.getVectorInfo(inst.x, inst.y, inst.target.x, inst.target.y); 

		var secondAnchorX = inst.x+info.dir.x*info.distance/3 + (info.perp.x*Random.getRandomArbitary(-info.distance/10, info.distance/10));
		var secondAnchorY = inst.y+info.dir.y*info.distance/3 + (info.perp.y*Random.getRandomArbitary(-info.distance/10, info.distance/10));

		var thirdAnchorX = inst.x+info.dir.x*info.distance*(2/3) + (info.perp.x*Random.getRandomArbitary(-info.distance/10, info.distance/10));
		var thirdAnchorY = inst.y+info.dir.y*info.distance*(2/3) + (info.perp.y*Random.getRandomArbitary(-info.distance/10, info.distance/10));		

		var fourthAnchorX = inst.target.x + Random.getRandomArbitary(-20, 20);
		var fourthAnchorY = inst.target.y + Random.getRandomArbitary(-20, 20);

		pointsToTarget[0] = {x:inst.x, y:inst.y};
		pointsToTarget[1] = {x:secondAnchorX , y:secondAnchorY};
		pointsToTarget[2] = {x:thirdAnchorX, y:thirdAnchorY};
		pointsToTarget[3] = {x:fourthAnchorX, y:fourthAnchorY};

		var speed = BezierCurve.estimateLenght(15, pointsToTarget) / 400.0;

		inst.exhaust.speedUp();

		TweenMax.to(inst, speed, {bezier:{values:pointsToTarget, autoRotate:90}, ease:Sine.easeIn, onComplete:function(){
			inst.alive = false;
		}}); 
	}});

	this.exhaust.init(this.container);
	this.exhaust.slowDown();
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

Rocket.prototype.draw   = function(context) {
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

Rocket.prototype.update = function() {
	this.exhaust.update();	
}

Rocket.prototype.destroy = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 30;
	Rocket.ExplosionArguments[4] = 100;

	this.container.add("Explosion", Rocket.ExplosionArguments, 0, true);

	this.exhaust.destroy();
	TweenMax.killTweensOf(this);
}

Rocket.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

Rocket.prototype.getCollider = function(){
	this.collider.pos.x = this.x + this.centerX;
	this.collider.pos.y = this.y + this.centerY;

	return this.collider;
}

Rocket.prototype.getCollisionId = function(){
	return "Rocket";
}

Rocket.prototype.onCollide = function(other){
	this.alive = false;
}

function LargeRocket() {
	Rocket.call(this);

	this.mainDimentionX = 8.5;
	this.mainDimentionY = this.mainDimentionX*2 + 3;

	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;
}

LargeRocket.inheritsFrom( Rocket );

LargeRocket.prototype.init = function(x, y, deploy, target, container) {
	this.parent.init.call(this, x, y, deploy, target, container);
}

LargeRocket.prototype.draw = function(context) {
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

LargeRocket.prototype.destroy = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 45;
	Rocket.ExplosionArguments[4] = 220;

	this.container.add("Explosion", Rocket.ExplosionArguments, 0, true);

	this.exhaust.destroy();
	TweenMax.killTweensOf(this);
}

function ClusterRocket() {
	Rocket.call(this);

	this.mainDimentionX = 12;
	this.mainDimentionY = 12;

	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;	
}

ClusterRocket.inheritsFrom( Rocket );

ClusterRocket.prototype.init = function(x, y, deploy, target, container, debryCount) {
	this.parent.init.call(this, x, y, deploy, target, container);
	this.debryCount = debryCount;
}

ClusterRocket.prototype.draw = function(context) {
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

ClusterRocket.prototype.destroy = function() {
	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 35;
	Rocket.ExplosionArguments[4] = 150;

	this.container.add("Explosion", Rocket.ExplosionArguments, 0, true);

	for(var i=0; i<this.debryCount; i++){
		Rocket.ExplosionArguments[0] = this.x;
		Rocket.ExplosionArguments[1] = this.y;
		Rocket.ExplosionArguments[2] = this.container;

		this.container.add("Debry" , Rocket.ExplosionArguments, 2, true);	
	}

	this.exhaust.destroy();
	TweenMax.killTweensOf(this);
}
