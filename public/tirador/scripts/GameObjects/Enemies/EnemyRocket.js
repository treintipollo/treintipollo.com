function EnemyRocket(speed, container) { 
	this.speed = speed;

	this.mainDimentionX = 8.5;
	this.mainDimentionY = this.mainDimentionX*2;

	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;

	this.rotation = 180;
	this.container = container;

	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 15);

	this.exhaustPoints = [];

	this.exhaustPoints.push({ x:0, y:0 });
	this.exhaustPoints.push({ x:0, y:0 });
	this.exhaustPoints.push({ x:0, y:0 });
	this.exhaustPoints.push({ x:0, y:0 });

	if (typeof Exhaust === "undefined") {
		return;
	}

	this.exhaust = new Exhaust(this.getExhaustPoints, this.container);

	var rand = Math.floor(Math.random() * 3);

	if(rand == 0){ this.exhaust.slowDown();}
	if(rand == 1){ this.exhaust.neutral(); }
	if(rand == 2){ this.exhaust.speedUp(); }
}

EnemyRocket.inheritsFrom( GameObject );

EnemyRocket.prototype.getExhaustPoints = function(side, type) {
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

	this.exhaustPoints[0].x = x + cos * r;
	this.exhaustPoints[0].y = y + sin * r;

	this.exhaustPoints[1].x = x + cosPerp * r * 2/divide;
	this.exhaustPoints[1].y = y + sinPerp * r * 2/divide;

	this.exhaustPoints[2].x = x + cos  * r * 3/divide;
	this.exhaustPoints[2].y = y + sin  * r * 3/divide;

	this.exhaustPoints[3].x = x + cos  * r * 4/divide;
	this.exhaustPoints[3].y = y + sin  * r * 4/divide;

	return this.exhaustPoints;
}

EnemyRocket.prototype.setStyles = function(context) { 	
	context.strokeStyle = "#FFFFFF";
}

EnemyRocket.prototype.draw = function(context) { 	
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
}

EnemyRocket.prototype.destroy = function() {
	this.container.add(new Explosion(this.x + this.centerX, this.y + this.centerY, this.rotation+90, 15, 50), 0);
	this.exhaust.destroy();
}

EnemyRocket.prototype.update = function() {
	this.exhaust.update(this);

	this.y += this.speed;

	if(this.y > 850){
		this.setDestroyMode(GameObject.NO_CALLBACKS);
	}
}

EnemyRocket.prototype.setFills = function(context) { 	
	context.stroke();
}

EnemyRocket.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

EnemyRocket.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;

	return this.collider;
}

EnemyRocket.prototype.getCollisionId = function(){
	return "EnemyRocket";
}

EnemyRocket.prototype.onCollide = function(other){
	this.alive = false;
}

function EnemyRocketFactory(maxWidth, maxHeight, minSpeed, maxSpeed, creationTime, container, rocketsToPowerUp) {
	this.maxWidth      	  = maxWidth;
	this.maxHeight     	  = maxHeight;
	this.container     	  = container;
	this.maxSpeed  	   	  = maxSpeed;
	this.minSpeed  	   	  = minSpeed;
	this.creationTime  	  = creationTime;

	this.rocketsToPowerUp	   = rocketsToPowerUp;
	this.initRocketsToPowerUp  = rocketsToPowerUp;
	this.rocketsDestroyedCount = 0;
	this.timerId 			   = 0;

	this.rocketTimerSpeedUp = 100;
	this.rocketTimerLimit   = 100;
}

EnemyRocketFactory.prototype.start = function() {
	var factory = this;

	this.timerId = setInterval(function() {
		factory.createEnemyRocket()	
	} , this.creationTime);
}

EnemyRocketFactory.prototype.createEnemyRocket = function() {
	var rocket = new EnemyRocket(Random.getRandomArbitary(this.minSpeed ,this.maxSpeed), this.container);

	rocket.x = Math.random() * this.maxWidth;
	rocket.y = -30; 

	rocket.addOnDestroyCallback(this, function(obj){
		this.rocketsDestroyedCount++;
		if(this.rocketsDestroyedCount >= this.rocketsToPowerUp){
			this.container.add(new WeaponPowerUp(obj.x, obj.y), 0, true);

			this.creationTime -= this.rocketTimerSpeedUp;
			if(this.creationTime <= this.rocketTimerLimit){
				this.creationTime = this.rocketTimerLimit;
			}

			this.rocketsToPowerUp += this.initRocketsToPowerUp;
			this.rocketsDestroyedCount = 0;

			clearInterval(this.timerId);
			this.start();
		}
	});

	this.container.add(rocket, 3, true);
}