Ship.SHAKE_MOTION 			= 0;
Ship.IDLE_MOTION  			= 1;
Ship.NONE_STOP_SHAKE_MOTION = 2;
Ship.START_MOTION 			= 3;

Ship.inheritsFrom( Attributes );

function Ship() {
	this.speedX = 100;
	this.speedY = 100;
	
	var exhaustPoints = [];
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });

	function getExhaustPoints30(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, this.rotation, 30,  20, side, type); };
	function getExhaustPoints60(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, this.rotation, 60,  20, side, type); };
	function getExhaustPoints90(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, this.rotation, 90,  20, side, type); };
	function getExhaustPoints120(side, type) { return getExhaustPoints(exhaustPoints, this.x, this.y, this.rotation, 120, 20, side, type); };
	function getExhaustPoints150(side, type) { return getExhaustPoints(exhaustPoints, this.x, this.y, this.rotation, 150, 20, side, type); };

	function getExhaustPoints(result, x, y, rotation, angle, r, side, type) {
		angle += rotation;

		var sin = Math.sin(angle * (Math.PI/180));
		var cos = Math.cos(angle * (Math.PI/180));

		var sinPerp = 0.0;
		var cosPerp = 0.0;
		var divide  = 2;

		if(type == Exhaust.NEUTRAL) { divide = 2; }
		if(type == Exhaust.UP)	    { divide = 1; }
		if(type == Exhaust.DOWN)    { divide = 2.5; }

		if(side){
			sinPerp = Math.sin((angle-30)  * (Math.PI/180));
			cosPerp = Math.cos((angle-30)  * (Math.PI/180));	
		}else{
			sinPerp = Math.sin((angle+30)  * (Math.PI/180));
			cosPerp = Math.cos((angle+30)  * (Math.PI/180));
		}

		result[0].x = x + cos * r;
		result[0].y = y + sin * r;

		result[1].x = x + cosPerp * r * 2/divide;
		result[1].y = y + sinPerp * r * 2/divide;

		result[2].x = x + cos  * r * 3/divide;
		result[2].y = y + sin  * r * 3/divide;

		result[3].x = x + cos  * r * 4/divide;
		result[3].y = y + sin  * r * 4/divide;

		return result;
	};

	this.exhaust30  = new Exhaust(getExhaustPoints30, this);
	this.exhaust60  = new Exhaust(getExhaustPoints60, this);
	this.exhaust90  = new Exhaust(getExhaustPoints90, this);
	this.exhaust120 = new Exhaust(getExhaustPoints120, this);
	this.exhaust150 = new Exhaust(getExhaustPoints150, this);

	this.trembleTimer = TimeOutFactory.getTimeOut(500, 1, this, function(){
		this.currentMotion.set(Ship.IDLE_MOTION);
	});

	this.explosionArea = new ExplosionsArea();
//	this.whiteFlash    = new WhiteFlashContainer();
}

Ship.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Ship.prototype.init = function(x, y, container){
	CircleCollider.prototype.init.call(this, 15);

	this.parent.init.call(this);

	this.weapon = new ShotWeapon(5, this);
	//this.weapon = new RocketWeapon(2, this);

	this.x = x;
	this.y = y;
	this.container = container;
	this.color = "#FFFFFF";

	this.rotation = 0;
	this.blockControls = false;

	this.exhaust30.init(this.container);
	this.exhaust60.init(this.container);
	this.exhaust90.init(this.container);
	this.exhaust120.init(this.container);
	this.exhaust150.init(this.container);

	this.weapon.init(this.container);

	var shake = FuntionUtils.bindScope(this, function(){
		if(this.shakeCounter % 2 == 0){
			var sX = Random.getRandomArbitary(-5.0, 5.0);
			var sY = Random.getRandomArbitary(-5.0, 5.0);

			this.totalVariation.x = sX;
			this.totalVariation.y = sY;

			this.lastVar.x = sX;
			this.lastVar.y = sY;
		}else{
			this.totalVariation.x = -this.lastVar.x;
			this.totalVariation.y = -this.lastVar.y;
		}
		this.shakeCounter++;
	});


	var startTrembleTimer = FuntionUtils.bindScope(this, function(repeateCount){
		this.trembleTimer.start();	
	});	

	var idle = FuntionUtils.bindScope(this, function(){
		this.totalVariation.x = 0;
		this.totalVariation.y = 0;
		this.lastVar.x = 0;
		this.lastVar.y = 0;
	});

	var gotoInitPosition = FuntionUtils.bindScope(this, function(){
		this.blockControls = true;
		this.blockDamage   = true;

		this.exhaust30.speedUp();
		this.exhaust60.speedUp();
		this.exhaust90.speedUp();
		this.exhaust120.speedUp(); 
		this.exhaust150.speedUp();

		TweenMax.to(this, 1, {y:this.y - 150, onCompleteScope:this, onComplete:function(){
			this.blockControls = false;
			this.blockDamage   = false;
		}});
	});

	var slowAllDown = FuntionUtils.bindScope(this, function(){
		this.exhaust30.slowDown();
		this.exhaust60.slowDown();
		this.exhaust90.slowDown();
		this.exhaust120.slowDown(); 
		this.exhaust150.slowDown();
	});

	//Motion state machine
	this.currentMotion = {currentMotionId:Ship.START_MOTION, lastMotionId:Ship.START_MOTION, motions:[]};

	this.shakeCounter   = 0;
	this.totalVariation = {x:0, y:0};
	this.lastVar        = {x:0, y:0};

	this.currentMotion.init = function(){
		this.motions[Ship.SHAKE_MOTION] 		  = {update:shake, init:startTrembleTimer };
		this.motions[Ship.IDLE_MOTION] 			  = {update:idle , init:null			  };
		this.motions[Ship.NONE_STOP_SHAKE_MOTION] = {update:shake, init:slowAllDown		  };
		this.motions[Ship.START_MOTION] 		  = {update:idle , init:gotoInitPosition  };
	}

	this.currentMotion.set = function(motionId, args){
		if(this.motions[this.currentMotionId].update){
			this.lastMotionId = this.currentMotionId;
		}

		this.currentMotionId = motionId;

		if(this.motions[this.currentMotionId].init != null){
			this.motions[this.currentMotionId].init.apply(this, args);
		}
	}

	this.currentMotion.update = function(){
		if(this.motions[this.currentMotionId].update){
			this.motions[this.currentMotionId].update();
		}else{
			this.motions[this.lastMotionId].update();
		}
	}

	this.currentMotion.init();
	this.currentMotion.set(Ship.START_MOTION);
}

Ship.prototype.draw = function(context) { 
	context.strokeStyle = this.color;

	//30 grados	
	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 25*(Math.PI/180), 35*(Math.PI/180));
	context.closePath();

	//60 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 55*(Math.PI/180), 65*(Math.PI/180));
	context.closePath();

	//90 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	//120 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 115*(Math.PI/180), 125*(Math.PI/180));
	context.closePath();

	//150 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 145*(Math.PI/180), 155*(Math.PI/180));
	context.closePath();

	context.strokeStyle = this.color;
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, 15, 0, Math.PI*2, false);
	context.closePath();

	context.lineStyle = this.color; 
	context.lineWidth = 2;
	context.fillStyle = "#000000";
	context.stroke();
	context.fill();

	context.beginPath();	
	context.arc(40, -40, 40, Math.PI/2, Math.PI, false);
	context.arc(-40, -40, 40, 0, Math.PI/2, false);
	context.closePath();

	context.lineWidth = 1;
	context.strokeStyle = this.color;
	context.stroke();
}

Ship.prototype.update = function(delta) { 	
	this.currentMotion.update();

	if(!this.blockControls){
		this.exhaust30.neutral();
		this.exhaust60.neutral();
		this.exhaust90.neutral();
		this.exhaust120.neutral(); 
		this.exhaust150.neutral();

		if(ArrowKeyHandler.isDown(ArrowKeyHandler.LEFT))  { 
			this.x -= this.speedX * delta; 
			
			this.exhaust30.speedUp();
			this.exhaust60.speedUp();	
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.RIGHT)) { 
			this.x += this.speedX * delta; 
			
			this.exhaust120.speedUp();
			this.exhaust150.speedUp();
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.UP))    { 
			this.y -= this.speedY * delta; 
			
			this.exhaust90.speedUp(); 
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.DOWN))  { 
			this.y += this.speedY * delta; 
			
			this.exhaust30.slowDown();
			this.exhaust60.slowDown();
			this.exhaust90.slowDown();
			this.exhaust120.slowDown(); 
			this.exhaust150.slowDown();
		}
	}
		
	this.x += this.totalVariation.x;
	this.y += this.totalVariation.y;

	this.exhaust30.update();
	this.exhaust60.update();
	this.exhaust90.update();
	this.exhaust120.update(); 
	this.exhaust150.update();

	this.weapon.update();
}

Ship.prototype.destroy = function(){
	this.exhaust30.off();
	this.exhaust60.off();
	this.exhaust90.off();
	this.exhaust120.off(); 
	this.exhaust150.off();	

	this.weapon.destroy();
	this.explosionArea.stop();
	TweenMax.killTweensOf(this);
}

Ship.prototype.onCollide = function(other){
	this.parent.onCollide.call(this, other);

	if(other.getCollisionId() == "WeaponPowerUp"){
		if(this.weapon.getId() == other.state){
			PowerUpText.UpArguments[0] = this.x;
			PowerUpText.UpArguments[1] = this.y;
			this.container.add("PowerUpText", PowerUpText.UpArguments);

			this.weapon.powerUp();	
		}else{
			var l = this.weapon.getLevel();
			this.weapon.destroy();

			if(other.state == WeaponPowerUp.SHOT){			
				PowerUpText.ShotArguments[0] = this.x;
				PowerUpText.ShotArguments[1] = this.y;
				this.container.add("PowerUpText", PowerUpText.ShotArguments);

				this.weapon = new ShotWeapon(l, this);
			}
			else if(other.state == WeaponPowerUp.ROCKET){
				PowerUpText.RocketsArguments[0] = this.x;
				PowerUpText.RocketsArguments[1] = this.y;
				this.container.add("PowerUpText", PowerUpText.RocketsArguments);

				this.weapon = new RocketWeapon(l, this);
			}

			this.weapon.init(this.container);
		} 
	}
}

Ship.prototype.onHPDiminished = function(other) {
	this.currentMotion.set(Ship.SHAKE_MOTION);
}

Ship.prototype.onDamageBlocked = function(other) {}

Ship.prototype.onDamageReceived = function(other) {
	this.currentMotion.set(Ship.IDLE_MOTION);

	PowerUpText.DownArguments[0] = this.x;
	PowerUpText.DownArguments[1] = this.y;
	this.container.add("PowerUpText", PowerUpText.DownArguments);
	
	this.weapon.powerDown();

	this.blockDamage = true;

	var vec = VectorUtils.getFullVectorInfo(this.x, this.y, other.x, other.y);
	var rA = Random.getRandomArbitary(-25, 25) * (Math.PI/180);
	
	vec.dir.x = Math.cos(rA + vec.angle) * 80;
	vec.dir.y = Math.sin(rA + vec.angle) * 80;

	this.knockBackTween = TweenMax.to(this, 0.4, {x:this.x + vec.dir.x, y:this.y + vec.dir.y, ease:Power4.easeOut, onCompleteScope:this, onComplete:function(){	
		this.blockDamage = false;
	}});
	
	TweenMax.to(this, 0.5, {rotation:360, ease:Power4.easeOut, onCompleteScope:this, onComplete:function(){
		this.rotation = 0;	
	}});
}

Ship.prototype.onLastDamageLevelReached = function(other) {
	TweenMax.to(this, 0.3, {colorProps:{color:"#FF0000"}, yoyo:true, repeat:-1, ease:Linear.ease});
	this.explosionArea.init(this, 30, 15, -1, 200);
}

Ship.prototype.onAllDamageReceived = function(other) {
	this.explosionArea.stop();
	this.currentMotion.set(Ship.NONE_STOP_SHAKE_MOTION);

	var d = (TopLevel.canvas.height + 100 - this.y );
	var speed = d / 170.0;
	this.rotation = 5;
	
	this.explosionArea.init(this, 35, 20, -1, 50);

	this.blockControls = true;

	TweenMax.to(this, speed, {y:this.y + d, rotation:720, ease:Linear.ease, onCompleteScope:this, onComplete:function(){
		this.alive = false;
	}});	
}

function PlayerShipFactory(container) {
	this.container = container;

	this.recreateTimer = TimeOutFactory.getTimeOut(1000, 1, this, function(){
		this.createPlayerShip();		
	});
}

PlayerShipFactory.prototype.createPlayerShip = function() {
	var ship = this.container.add("Ship", [TopLevel.canvas.width/2, TopLevel.canvas.height + 50, this.container]);
	var arg = arguments;

	ship.addOnDestroyCallback(this, function(obj){
		this.recreateTimer.start();	
	});

	return ship;
}
