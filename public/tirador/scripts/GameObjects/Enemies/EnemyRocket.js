EnemyRocket.exhaustPoints = [{ x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }];
EnemyRocket.EnemryRocketArguments = [null, null, null, null];

function EnemyRocket() { 
	this.mainDimentionX = 8.5;
	this.mainDimentionY = this.mainDimentionX*2;

	this.centerX = this.mainDimentionX/2;
	this.centerY = this.mainDimentionY/2;

	this.rotation = 180;
	
	if (typeof Exhaust === "undefined") {
		return;
	}

	this.exhaust  = new Exhaust(this.getExhaustPoints, this);	
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 15);
}

EnemyRocket.inheritsFrom( GameObject );

EnemyRocket.prototype.init = function(x, y, speed, container) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.container = container;
	this.createExplosion = true;
	
	this.exhaust.init(this.container);
	
	var rand = Math.floor(Math.random() * 3);

	if(rand == 0){ this.exhaust.slowDown();}
	if(rand == 1){ this.exhaust.neutral(); }
	if(rand == 2){ this.exhaust.speedUp(); }

	this.collider.r = 15;
}

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

	EnemyRocket.exhaustPoints[0].x = x + cos * r;
	EnemyRocket.exhaustPoints[0].y = y + sin * r;

	EnemyRocket.exhaustPoints[1].x = x + cosPerp * r * 2/divide;
	EnemyRocket.exhaustPoints[1].y = y + sinPerp * r * 2/divide;

	EnemyRocket.exhaustPoints[2].x = x + cos  * r * 3/divide;
	EnemyRocket.exhaustPoints[2].y = y + sin  * r * 3/divide;

	EnemyRocket.exhaustPoints[3].x = x + cos  * r * 4/divide;
	EnemyRocket.exhaustPoints[3].y = y + sin  * r * 4/divide;

	return EnemyRocket.exhaustPoints;
}

EnemyRocket.prototype.draw = function(context) { 	
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

EnemyRocket.prototype.destroy = function() {
	this.exhaust.destroy();

	if(!this.createExplosion)
		return;

	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = 15;
	Rocket.ExplosionArguments[4] = 50;

	this.container.add("Explosion_Effect", Rocket.ExplosionArguments);
}

EnemyRocket.prototype.update = function(delta) {
	this.exhaust.update();

	this.y += this.speed*delta;

	if(this.y > 850){
		this.createExplosion = false;
		this.setDestroyMode(GameObject.NO_CALLBACKS);
	}
}

EnemyRocket.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

EnemyRocket.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;

	return this.collider;
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

	this.rocketTimer; 
}

EnemyRocketFactory.prototype.start = function() {
	this.rocketTimer = TimeOutFactory.getTimeOut(this.creationTime, -1, this, function(){
		this.createEnemyRocket();
	});

	this.rocketTimer.start();
}

EnemyRocketFactory.prototype.createEnemyRocket = function() {

	EnemyRocket.EnemryRocketArguments[0] = Math.random() * this.maxWidth;
	EnemyRocket.EnemryRocketArguments[1] = -30;
	EnemyRocket.EnemryRocketArguments[2] = Random.getRandomArbitary(this.minSpeed ,this.maxSpeed);
	EnemyRocket.EnemryRocketArguments[3] = this.container;

	var rocket = this.container.add("EnemyRocket", EnemyRocket.EnemryRocketArguments);

	if(rocket == null){
		return;
	}

	rocket.addOnDestroyCallback(this, function(obj){
		this.rocketsDestroyedCount++;
	
		if(this.rocketsDestroyedCount >= this.rocketsToPowerUp){
			this.container.add("WeaponPowerUp", [obj.x, obj.y]);

			this.creationTime -= this.rocketTimerSpeedUp;
			if(this.creationTime <= this.rocketTimerLimit){
				this.creationTime = this.rocketTimerLimit;
			}

			this.rocketsToPowerUp += this.initRocketsToPowerUp;
			this.rocketsDestroyedCount = 0;

			this.rocketTimer.stop();

			this.start();
		}
	});
}