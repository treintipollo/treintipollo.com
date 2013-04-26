Ship.inheritsFrom( Attributes );

function Ship() {
	if (typeof Exhaust === "undefined") { return; }

	this.SHAKE_MOTION;
	this.IDLE_MOTION;
	this.NONE_STOP_SHAKE_MOTION;
	this.START_MOTION;

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
		this.currentMotion.set(this.IDLE_MOTION);
	});

	this.explosionArea = new ExplosionsArea();
	this.whiteFlash    = new WhiteFlashContainer();
}

Ship.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Ship.prototype.init = function(x, y, container){
	CircleCollider.prototype.init.call(this, 15);

	Attributes.prototype.init.call(this);

	this.x 		   = x;
	this.y 		   = y;
	this.container = container;

	this.color          = "#FFFFFF";
	this.rotation       = 0;
	this.blockControls  = false;
	this.shakeCounter   = 0;
	this.totalVariation = {x:0, y:0};
	this.lastVar        = {x:0, y:0};

	this.exhaust30.init(this.container);
	this.exhaust60.init(this.container);
	this.exhaust90.init(this.container);
	this.exhaust120.init(this.container);
	this.exhaust150.init(this.container);

	this.createStateMachine();
	this.gotoInitialState();
}

Ship.prototype.createStateMachine = function() {
	this.currentMotion = new StateMachine(true, this);

	var shake = function(){
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
	}

	var startTrembleTimer = function(repeateCount){
		this.trembleTimer.start();	
	}	

	var idle = function(){
		this.totalVariation.x = 0;
		this.totalVariation.y = 0;
		this.lastVar.x = 0;
		this.lastVar.y = 0;
	}

	var gotoInitPosition = function(){
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

			 this.executeCallbacks("onInitialPositionDelegate", this);
		}});
	}

	var slowAllDown = function(){
		this.exhaust30.slowDown();
		this.exhaust60.slowDown();
		this.exhaust90.slowDown();
		this.exhaust120.slowDown(); 
		this.exhaust150.slowDown();
	}

	this.SHAKE_MOTION 			= this.currentMotion.add(startTrembleTimer, shake, null); 
	this.IDLE_MOTION 			= this.currentMotion.add(null, idle, null);
	this.NONE_STOP_SHAKE_MOTION = this.currentMotion.add(slowAllDown, shake, null);
	this.START_MOTION 			= this.currentMotion.add(gotoInitPosition, idle, null);
}

Ship.prototype.addInitialPositionReachedCallback = function(scope, callback) { this.addCallback("onInitialPositionDelegate", scope, callback); }
Ship.prototype.addFirstShotCallback = function(scope, callback) { this.addCallback("firstShotDelegate", scope, callback); }

Ship.prototype.gotoInitialState = function() {
	this.currentMotion.set(this.START_MOTION);
}

Ship.prototype.draw = function(context) { 
	context.strokeStyle = this.color;
	context.lineWidth 	= 1;
	context.fillStyle   = "#000000";

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
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, 15, 0, Math.PI*2, false);
	context.closePath();
	context.stroke();
	context.fill();

	context.beginPath();	
	context.arc(40, -40, 40, Math.PI/2, Math.PI, false);
	context.arc(-40, -40, 40, 0, Math.PI/2, false);
	context.closePath();
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
			this.x -= TopLevel.playerData.speed * delta; 
			
			this.exhaust30.speedUp();
			this.exhaust60.speedUp();	
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.RIGHT)) { 
			this.x += TopLevel.playerData.speed * delta; 
			
			this.exhaust120.speedUp();
			this.exhaust150.speedUp();
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.UP))    { 
			this.y -= TopLevel.playerData.speed * delta; 
			
			this.exhaust90.speedUp(); 
		}
		if(ArrowKeyHandler.isDown(ArrowKeyHandler.DOWN))  { 
			this.y += TopLevel.playerData.speed * delta; 
			
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

	if(this.weapon) {
		this.weapon.update();
	}
}

Ship.prototype.destroy = function(){
	this.exhaust30.off();
	this.exhaust60.off();
	this.exhaust90.off();
	this.exhaust120.off(); 
	this.exhaust150.off();	

	this.explosionArea.stop();
	TweenMax.killTweensOf(this);

	this.destroyCallbacks("onInitialPositionDelegate");

	this.weapon.destroy();
}

Ship.prototype.onHPDiminished = function(other) {
	this.currentMotion.set(this.SHAKE_MOTION);
}

Ship.prototype.onDamageBlocked = function(other) {}

Ship.prototype.onDamageReceived = function(other) {
	this.currentMotion.set(this.IDLE_MOTION);

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
	this.colorTween = TweenMax.to(this, 0.3, {colorProps:{color:"#FF0000"}, yoyo:true, repeat:-1, ease:Linear.ease});
	this.explosionArea.init(this, 30, 15, -1, 200);
}

Ship.prototype.onAllDamageReceived = function(other) {
	this.blockControls 		= true;
	this.checkingCollisions = false;
	
	this.currentMotion.set(this.NONE_STOP_SHAKE_MOTION);
	this.explosionArea.stop();
	
	if(TopLevel.playerData.lives <= 0){
		this.explosionArea.init(
			this, 
			35, 
			30, 
			100, 
			30, 
			FuntionUtils.bindScope(this, function(){ 
				this.whiteFlash.on(FuntionUtils.bindScope(this, function(){ this.alive = false; }), null, this);
			})
		);
	}else{
		this.explosionArea.init(this, 35, 20, -1, 50);

		var d 		  = (TopLevel.canvas.height + 50 - this.y );
		var speed 	  = d / 100.0;
		this.rotation = 5;
			
		TweenMax.to(this, speed, {y:this.y + d, rotation:720, ease:Linear.easeNone, onCompleteScope:this, onComplete:function(){
			this.alive = false;
		}});		
	}
}

Ship.prototype.onDamageRecoveredOutOfLastLevel = function(other) {
	this.explosionArea.stop();
	TweenMax.to(this, 1, {colorProps:{color:"#FFFFFF"}, ease:Linear.ease});
	if(this.colorTween)
		this.colorTween.kill();
}
