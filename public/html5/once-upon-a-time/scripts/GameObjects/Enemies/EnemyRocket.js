EnemyRocket.exhaustPoints = [{ x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }, { x:0, y:0 }];
EnemyRocket.EnemryRocketArguments = [null, null, null, null];

function EnemyRocket() { 
	this.rotation = 180;
	
	if (typeof Exhaust === "undefined") { return; }

	this.exhaust = new Exhaust(this.getExhaustPoints, this);	
}

EnemyRocket.inheritsFrom( Attributes );

EnemyRocket.prototype.afterCreate = function(){
	BoxCollider.prototype.create.call(this);
}

EnemyRocket.prototype.init = function(x, y, speed, container) {
	Attributes.prototype.init.call(this);
	
	this.mainDimentionX = this.mainDim;
	this.mainDimentionY = this.mainDimentionX*2;
	this.wingSize       = this.mainDimentionX*0.6;
	this.centerX 		= this.mainDimentionX/2;
	this.centerY 		= this.mainDimentionY/2;

	BoxCollider.prototype.init.call(this, this.mainDimentionX, this.mainDimentionY);

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
	context.lineTo(-this.wingSize, (this.mainDimentionY/2)+this.wingSize);
	context.lineTo(0, (this.mainDimentionY/2)+this.wingSize);

	context.moveTo(this.mainDimentionX, this.mainDimentionY/2);
	context.lineTo(this.mainDimentionX+this.wingSize, this.mainDimentionY/2+this.wingSize);
	context.lineTo(this.mainDimentionX, this.mainDimentionY/2+this.wingSize);

	context.closePath();

	context.stroke();

	//context.strokeStyle = "#FF0000";
	//context.beginPath();
	//context.arc(this.centerX, this.centerY, this.collider.r, 0, Math.PI*2);
	//context.arc(0, 0, this.collider.r, 0, Math.PI*2);
	//context.rect(0, 0, this.mainDimentionX, this.mainDimentionY);
	//context.rect(this.centerX, this.centerY, this.mainDimentionX, this.mainDimentionY);
	//context.closePath();
	//context.stroke();
}

EnemyRocket.prototype.destroy = function() {
	this.exhaust.off();

	if(!this.createExplosion) return;

	Rocket.ExplosionArguments[0] = this.x + this.centerX;
	Rocket.ExplosionArguments[1] = this.y + this.centerY;
	Rocket.ExplosionArguments[2] = this.rotation+90;
	Rocket.ExplosionArguments[3] = this.mainDimentionY;
	Rocket.ExplosionArguments[4] = this.mainDimentionY*3;

	this.container.add("Explosion_Effect", Rocket.ExplosionArguments);

	this.executeCallbacks("destroyed");
}

EnemyRocket.prototype.update = function(delta) {
	this.exhaust.update();

	this.y += this.speed*delta;

	if(ScreenUtils.isPastBottom(this.y, this.mainDimentionY)){
		this.createExplosion = false;
		this.setDestroyMode(GameObject.NO_CALLBACKS);
	}
}

EnemyRocket.prototype.onHPDiminished 		   = function(other) {}
EnemyRocket.prototype.onDamageBlocked 		   = function(other) {}
EnemyRocket.prototype.onDamageReceived 		   = function(other) {}
EnemyRocket.prototype.onLastDamageLevelReached = function(other) {}

EnemyRocket.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
}