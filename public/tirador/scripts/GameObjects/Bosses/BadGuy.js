BadGuy.RocketArguments = [null, null, {x:0, y:0}, null, null, null, {min:0, max:0}, {min:0, max:0}];

BadGuy.inheritsFrom( Ship );

function BadGuy() {
	if (typeof TractorBeam === "undefined") { return; }

	Ship.call(this);

	var tractorBeamPoints = [];
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });

	function getTractorPointsWrapper(side)  { return this.getTractorBeamPoints(tractorBeamPoints, this.x, this.y, this.target, side); };

	this.tractorBeam = new TractorBeam(getTractorPointsWrapper, this);
	this.target      = null;
}

BadGuy.prototype.getTractorBeamPoints = function(result, x, y, target, side){}
BadGuy.prototype.fireRockets = function(){}

BadGuy.prototype.init = function(x, y, container, target){
	Ship.prototype.init.call(this, x, y, container);
	this.color = "#FFFFFF";
	this.target = target;
}

BadGuy.prototype.draw = function(context) { 
	context.strokeStyle = this.color;
	context.lineWidth = 1;
	context.fillStyle = "#000000";

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
	context.arc(0, 0, 15, 0, Math.PI * 2, false);
	context.closePath();
	context.stroke();
	context.fill();

	context.beginPath();
	context.moveTo(0, -40);
	context.bezierCurveTo(20, 10, 40, -40, 40, 10);
	context.moveTo(0, -40);
	context.bezierCurveTo(-20, 10, -40, -40, -40, 10);
	context.moveTo(-40, 10);
	context.bezierCurveTo(-20, -5, 20, -5, 40, 10);
	context.moveTo(0, -40);
	context.closePath();
	context.stroke();
}

BadGuy.prototype.update = function(delta) { 	
	this.currentMotion.update();
		
	this.x += this.totalVariation.x;
	this.y += this.totalVariation.y;

	this.setAllExhaustState(Exhaust.UPDATE);
}

BadGuy.prototype.escape = function() {	
	this.setAllExhaustState(Exhaust.SLOW);

	this.blockDamage = true;

	var lastPosY = this.y;

	TimeOutFactory.getTimeOut(300, 1, this, function() {
		TweenMax.to(this, 2, {
			y: "-=700",
			ease: Back.easeIn,
			onCompleteScope: this,
			onUpdateScope: this,
			onComplete: function() {
				this.alive = false;
				this.executeCallbacks("escapeComplete");
			},
			onUpdate: function() {
				if (lastPosY > this.y) {
					this.setAllExhaustState(Exhaust.FAST);
				}

				lastPosY = this.y;
			}
		});

		if(this.target){
			TweenMax.to(this.target, 2, {
				y: "-=700",
				ease: Back.easeIn
			});
		}

	}, true).start();
}

BadGuy.prototype.destroy = function() {
	Ship.prototype.destroy.call(this);

	if(this.target)
		this.target.alive = false;
	
	this.tractorBeam.destroy();
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

ConcreteBadGuy.inheritsFrom( BadGuy );

function ConcreteBadGuy() {
	BadGuy.call(this);
}

ConcreteBadGuy.prototype.init = function() {	
	this.getTractorBeamPoints     = this.tProto.getTractorBeamPoints;
	this.createStateMachine       = this.tProto.createStateMachine;	
	this.fireRockets 			  = this.tProto.fireRockets;
	this.rocketConfig 			  = this.tProto.rocketConfig;
	this.update 			      = this.tProto.update;	
	
	this.onDamageBlocked 	      = this.tProto.onDamageBlocked;
	this.onDamageReceived 	      = this.tProto.onDamageReceived;
	this.onLastDamageLevelReached = this.tProto.onLastDamageLevelReached;
	this.onAllDamageReceived      = this.tProto.onAllDamageReceived;

	this.tProto.init.apply(this, arguments);
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

IntroBadGuy.inheritsFrom( BadGuy );

function IntroBadGuy() {}

IntroBadGuy.prototype.init = function(x, y, container, target){
	BadGuy.prototype.init.call(this, x, y, container, target);

	this.tractorBeam.init(container, function(){
		this.executeCallbacks("tractorBeamComplete");
	});
}

IntroBadGuy.prototype.fireRockets = function() {
	TimeOutFactory.getTimeOut(100, 30, this, function(){ 
		var a = Random.getRandomArbitary(200, 340) * (Math.PI/180);

		var deployX = this.x + Math.cos( a ) * 200;
		var deployY = this.y + Math.sin( a ) * 200;

		BadGuy.RocketArguments[0]   = this.x;
		BadGuy.RocketArguments[1]   = this.y;
		BadGuy.RocketArguments[2].x = deployX;
		BadGuy.RocketArguments[2].y = deployY;
		BadGuy.RocketArguments[3]   = {x:deployX, y:TopLevel.canvas.height + 100};
		BadGuy.RocketArguments[4]   = TopLevel.container;
		BadGuy.RocketArguments[5]   = 180;
		BadGuy.RocketArguments[6]   = {min:0.4, max:0.8};
		BadGuy.RocketArguments[7]   = {min:0.5, max:1.5};
		BadGuy.RocketArguments[8]   = 15;

		TopLevel.container.add("BadGuySmallAimedRocket", BadGuy.RocketArguments);
	}, true).start();
}

IntroBadGuy.prototype.getTractorBeamPoints = function(result, x, y, target, side){
	var deltaX = target.x - x;
	var deltaY = target.y - y;
	
	var d = Math.sqrt( (deltaX*deltaX) + (deltaY*deltaY) );
	var a = Math.atan2(deltaY, deltaX);

	var sin = Math.sin(a);
	var cos = Math.cos(a);

	var sinPerp1 = 0.0;
	var cosPerp1 = 0.0;

	if(side){
		sinPerp1 = Math.sin(a - (90 * (Math.PI/180)) );
		cosPerp1 = Math.cos(a - (90 * (Math.PI/180)) );

	}else{
		sinPerp1 = Math.sin(a + (90 * (Math.PI/180)) );
		cosPerp1 = Math.cos(a + (90 * (Math.PI/180)) );
	}

	d += 50;

	result[0].x = x + cosPerp1 * 10;
	result[0].y = y + sinPerp1 * 10;

	result[1].x = x + ( cos * (d*(3/4) + 30) );
	result[1].y = y + ( sin * (d*(3/4) + 30) );

	result[2].x = x + ( cos  * (d*(2/4) + 30) );
	result[2].y = y + ( sin  * (d*(2/4) + 30) );

	result[3].x = target.x + ( cosPerp1  * 120 );
	result[3].y = target.y + ( sinPerp1  * 120 );

	result[4].x = x + ( cos * (d - 10) );
	result[4].y = y + ( sin * (d - 10) );

	return result;
}

IntroBadGuy.prototype.createStateMachine = function() {
	BadGuy.prototype.createStateMachine.call(this);
	
	this.collider.r = 40; 

	this.setAllExhaustState(Exhaust.FAST);

	var startMotion = this.currentMotion.get(this.START_MOTION);

	startMotion.init = function() {
		this.blockDamage = true;

		this.setAllExhaustState(Exhaust.FAST);

		TweenMax.to(this, 1.5, {y:this.y - 500, onCompleteScope:this, onComplete:function(){
			this.blockDamage   = false;

			this.setAllExhaustState(Exhaust.REGULAR);

			this.executeCallbacks("onInitialPositionDelegate", this);
		}});
	}
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

MiddleBadGuy.inheritsFrom( BadGuy );

function MiddleBadGuy() {}

MiddleBadGuy.prototype.init = function(x, y, container, target, playerShip){
	TimeOutFactory.removeAllTimeOutsWithScope(this);

	BadGuy.prototype.init.call(this, x, y, container, target);
	
	this.playerShip = playerShip;
	this.escaping   = false;

	this.tractorBeam.init(container);
	this.tractorBeam.on();
}

MiddleBadGuy.prototype.update = function(delta){
	BadGuy.prototype.update.call(this, delta);

	if(this.target){
		this.target.x = this.x;
		this.target.y = this.y - 70;
	}
}

MiddleBadGuy.prototype.fireRockets = function(){
	TimeOutFactory.getTimeOut(this.rocketTimeOut, this.rocketAmount, this, function() {
		
		var a = Random.getRandomArbitary(0, 360) * (Math.PI / 180);

		BadGuy.RocketArguments[0] = this.x;
		BadGuy.RocketArguments[1] = this.y;
		BadGuy.RocketArguments[2].x = this.x + Math.cos(a) * this.rocketRadius;
		BadGuy.RocketArguments[2].y = this.y + Math.sin(a) * this.rocketRadius;
		BadGuy.RocketArguments[3] = this.playerShip;
		BadGuy.RocketArguments[4] = TopLevel.container;
		BadGuy.RocketArguments[5] = (VectorUtils.getFullVectorInfo(this.x, this.y, this.playerShip.x, this.playerShip.y).angle * (180 / Math.PI)) - 90;

		BadGuy.RocketArguments[6].min = this.rocketAccelerationMin;
		BadGuy.RocketArguments[6].max = this.rocketAccelerationMax;

		BadGuy.RocketArguments[7].min = this.rocketDeploySpeedMin;
		BadGuy.RocketArguments[7].max = this.rocketDeploySpeedMax;

		BadGuy.RocketArguments[8] = this.blastRadius;	
		
		TopLevel.container.add(this.rocketType, BadGuy.RocketArguments);

	}, true).start();
}

MiddleBadGuy.prototype.getTractorBeamPoints = function(result, x, y, target, side){
	var deltaX = target.x - x;
	var deltaY = target.y - y;
	
	var d = Math.sqrt( (deltaX*deltaX) + (deltaY*deltaY) );
	var a = Math.atan2(deltaY, deltaX);

	var sin = Math.sin(a);
	var cos = Math.cos(a);

	var sinPerp1 = 0.0;
	var cosPerp1 = 0.0;

	if(side){
		sinPerp1 = Math.sin(a - (90 * (Math.PI/180)) );
		cosPerp1 = Math.cos(a - (90 * (Math.PI/180)) );
	}else{
		sinPerp1 = Math.sin(a + (90 * (Math.PI/180)) );
		cosPerp1 = Math.cos(a + (90 * (Math.PI/180)) );
	}

	d += 50;

	result[0].x = x + cosPerp1 * 15;
	result[0].y = y + sinPerp1 * 15;

	result[1].x = x + ( cos * (d*(2/10)) );
	result[1].y = y + ( sin * (d*(2/10)) );

	result[2].x = x + ( cos  * (d*(3/10)) );
	result[2].y = y + ( sin  * (d*(3/10)) );

	result[3].x = target.x + ( cosPerp1  * 115 );
	result[3].y = target.y + ( sinPerp1  * 115 );

	result[4].x = x + ( cos * d );
	result[4].y = y + ( sin * d );

	return result;
}

MiddleBadGuy.prototype.createStateMachine = function() {
	BadGuy.prototype.createStateMachine.call(this);
	
	this.collider.r = 15; 

	var startMotion = this.currentMotion.get(this.START_MOTION);

	var idle = this.currentMotion.get(this.IDLE_MOTION).update;

	startMotion.init = function() {
		this.blockDamage = true;

		this.setAllExhaustState(Exhaust.SLOW);

		TweenMax.to(this, 3.5, {y:"+=350", onCompleteScope:this, onComplete:function(){
		 	this.blockDamage = false;
		 	this.setAllExhaustState(Exhaust.REGULAR);

		 	this.executeCallbacks("onInitialPositionDelegate", this);

		 	TimeOutFactory.getTimeOut(500, 1, this, function(){ 
		 		this.currentMotion.set(this.MOVE);
		 	}, true).start();

		}});
	}

	var setExhaust = function(){
		if(this.escaping) return;

		TimeOutFactory.getTimeOut(300, 1, this, function(){ 
			var x = Random.getRandomArbitary(30, TopLevel.canvas.width -  30);
			var y = Random.getRandomArbitary(30, TopLevel.canvas.height - 30);

			var info  = VectorUtils.getFullVectorInfo(this.x, this.y, x, y);
			var speed = info.distance / this.speed;

			if(this.x < x){
				this.setExhaustLeftState(Exhaust.REGULAR);
				this.setExhaustRightState(Exhaust.FAST);		
			}else{
				this.setExhaustLeftState(Exhaust.FAST);
				this.setExhaustRightState(Exhaust.REGULAR);
			}

			if(this.y < y){
				this.setAllExhaustState(Exhaust.SLOW);
			}else{
				this.setExhaustForwardState(Exhaust.FAST);
			}

			this.moveTween = TweenMax.to(this, speed, {x:x, y:y, ease:Linear.easeNone, onCompleteScope:this, onComplete:function(){
			 	this.setAllExhaustState(Exhaust.REGULAR);
				
			 	if(Math.random() < 0.5){
					this.currentMotion.set(this.ATTACK);
			 	}else{
			 		this.currentMotion.set(this.MOVE);
			 	}
			}});
		},true).start();
	}

	var attack = function(){
		if(this.escaping) return;

		this.fireRockets();

		TimeOutFactory.getTimeOut(Random.getRandomArbitary(500, 2000), 1, this, function(){ 
			this.currentMotion.set(this.MOVE);
		}, true).start();
	}

	this.MOVE 	= this.currentMotion.add(setExhaust, idle, null); 
	this.ATTACK = this.currentMotion.add(attack  , idle, null);
}

MiddleBadGuy.prototype.onDamageReceived = function(other) {}

MiddleBadGuy.prototype.onLastDamageLevelReached = function(other) {}

MiddleBadGuy.prototype.onAllDamageReceived = function(other) {
	this.escaping    = true;
	this.blockDamage = true;

	TimeOutFactory.removeAllTimeOutsWithScope(this);
	TweenMax.killTweensOf(this);

	this.colorTween = TweenMax.to(this, 0.3, {colorProps:{color:"#FF0000"}, yoyo:true, repeat:-1, ease:Linear.ease});
	this.explosionArea.init(this, 30, 15, -1, 200);

	this.currentMotion.set(this.IDLE_MOTION);

	var vec = VectorUtils.getFullVectorInfo(this.x, this.y, other.x, other.y);

	vec.dir.x = Math.cos(vec.angle) * 80;
	vec.dir.y = Math.sin(vec.angle) * 80;

	TweenMax.to(this, 0.4, {rotation:360, x:this.x + vec.dir.x, y:this.y + vec.dir.y, ease:Power4.easeOut, onCompleteScope:this, onComplete:function(){	
		this.rotation = 0;	
		this.escape();
	}});
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

End_1_BadGuy.inheritsFrom( MiddleBadGuy );

function End_1_BadGuy() {}

End_1_BadGuy.prototype.onAllDamageReceived = function(other) {
	this.escaping    = true;
	this.blockDamage = true;

	TimeOutFactory.removeAllTimeOutsWithScope(this);
	
	TweenMax.killTweensOf(this);

	this.colorTween = TweenMax.to(this, 0.3, {colorProps:{color:"#FF0000"}, yoyo:true, repeat:-1, ease:Linear.ease});
	
	this.explosionArea.init(this, 30, 20, -1, 170);

	this.tractorBeam.off();

	this.currentMotion.set(this.NONE_STOP_SHAKE_MOTION);

	TweenMax.to(this, 0.4, {rotation:720, ease:Power4.easeOut, onCompleteScope:this, onComplete:function(){	
		this.rotation = 0;	
		this.executeCallbacks("releasePartner");	
	}});
}

End_1_BadGuy.prototype.update = function(delta){
	if(this.escaping){
		BadGuy.prototype.update.call(this, delta);
	}else{
		MiddleBadGuy.prototype.update.call(this, delta);
	}
}

//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//
//-----------------------------------------------//

End_2_BadGuy.inheritsFrom( MiddleBadGuy );

function End_2_BadGuy() {}

End_2_BadGuy.prototype.init = function(x, y, container, target, playerShip){
	TimeOutFactory.removeAllTimeOutsWithScope(this);

	BadGuy.prototype.init.call(this, x, y, container, target);
	
	this.playerShip = playerShip;
	this.escaping   = false;

	this.rocketTypeCount = {};
}

End_2_BadGuy.prototype.createStateMachine = function() {
	MiddleBadGuy.prototype.createStateMachine.call(this);
	
	var startMotion = this.currentMotion.get(this.START_MOTION);
	var moveMotion = this.currentMotion.get(this.MOVE);

	startMotion.init = function() {
		this.blockDamage = true;

		this.setAllExhaustState(Exhaust.FAST);

		TweenMax.to(this, 3.5, {y:"+=350", onCompleteScope:this, onComplete:function(){
		 	this.blockDamage = false;

		 	this.executeCallbacks("onInitialPositionDelegate", this);

		 	TimeOutFactory.getTimeOut(500, 1, this, function(){ 
		 		this.currentMotion.set(this.MOVE);
		 	}, true).start();
		}});
	}

	moveMotion.init = function() {
		if(this.escaping) return;

		TimeOutFactory.getTimeOut(300, 1, this, function(){ 
			var x = Random.getRandomArbitary(30, TopLevel.canvas.width -  30);
			var y = Random.getRandomArbitary(30, TopLevel.canvas.height - 30);

			var info  = VectorUtils.getFullVectorInfo(this.x, this.y, x, y);
			var speed = info.distance / this.speed;

			if(this.y < y){
				this.setAllExhaustState(Exhaust.SLOW);
			}

			this.moveTween = TweenMax.to(this, speed, {x:x, y:y, ease:Linear.easeNone, onCompleteScope:this, onComplete:function(){
			 	this.setAllExhaustState(Exhaust.FAST);
				
			 	if(Math.random() < 0.5){
					this.currentMotion.set(this.ATTACK);
			 	}else{
			 		this.currentMotion.set(this.MOVE);
			 	}
			}});
		},true).start();
	}
}

End_2_BadGuy.prototype.fireRockets = function(){
	var rocketTypeIndex = Random.getRandomInt(0, this.rocketType.length-1);

	if(!this.rocketTypeCount[this.rocketType[rocketTypeIndex]]){
		this.rocketTypeCount[this.rocketType[rocketTypeIndex]] = 0;
	}

	TimeOutFactory.getTimeOut(this.rocketTimeOut[rocketTypeIndex], this.rocketAmount[rocketTypeIndex], this, function() {
	
		if(this.rocketTypeCount[this.rocketType[rocketTypeIndex]] > this.rocketAmount[rocketTypeIndex]){
			return;
		}

		var a = Random.getRandomArbitary(0, 360) * (Math.PI / 180);

		BadGuy.RocketArguments[0] = this.x;
		BadGuy.RocketArguments[1] = this.y;
		BadGuy.RocketArguments[2].x = this.x + Math.cos(a) * this.rocketRadius[rocketTypeIndex];
		BadGuy.RocketArguments[2].y = this.y + Math.sin(a) * this.rocketRadius[rocketTypeIndex];
		BadGuy.RocketArguments[3] = this.playerShip;
		BadGuy.RocketArguments[4] = TopLevel.container;
		BadGuy.RocketArguments[5] = (VectorUtils.getFullVectorInfo(this.x, this.y, this.playerShip.x, this.playerShip.y).angle * (180 / Math.PI)) - 90;

		BadGuy.RocketArguments[6].min = this.rocketAccelerationMin[rocketTypeIndex];
		BadGuy.RocketArguments[6].max = this.rocketAccelerationMax[rocketTypeIndex];

		BadGuy.RocketArguments[7].min = this.rocketDeploySpeedMin[rocketTypeIndex];
		BadGuy.RocketArguments[7].max = this.rocketDeploySpeedMax[rocketTypeIndex];

		BadGuy.RocketArguments[8] = this.blastRadius[rocketTypeIndex];	
		
		var rocket = TopLevel.container.add(this.rocketType[rocketTypeIndex], BadGuy.RocketArguments);

		if(rocket) {
			this.rocketTypeCount[this.rocketType[rocketTypeIndex]]++;

			rocket.addOnRecicleCallback(this, function(){
				this.rocketTypeCount[this.rocketType[rocketTypeIndex]]--;
			});
		}

	}, true).start();
}

End_2_BadGuy.prototype.onDamageReceived = function(other) {
	Ship.prototype.onDamageReceived.call(this, other);
}

End_2_BadGuy.prototype.onLastDamageLevelReached = function(other) {
	Ship.prototype.onLastDamageLevelReached.call(this, other);
}

End_2_BadGuy.prototype.onAllDamageReceived = function(other) {
	TimeOutFactory.removeAllTimeOutsWithScope(this);
	TweenMax.killTweensOf(this);

	Ship.prototype.onAllDamageReceived.call(this, other);
}