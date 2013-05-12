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

	function getExhaustPointsWrapper(side)  { return this.getTractorBeamPoints(tractorBeamPoints, this.x, this.y, this.target, side); };

	this.tractorBeam = new TractorBeam(getExhaustPointsWrapper, this);
	this.target      = null;
}

BadGuy.prototype.getTractorBeamPoints = function(result, x, y, target, side){}

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
	
	context.bezierCurveTo(20, 10,
						  40, -40,
						  40, 10);

	context.moveTo(0, -40);

	context.bezierCurveTo(-20, 10,
						  -40, -40,
						  -40, 10);

	context.moveTo(-40, 10);

	context.bezierCurveTo(-20, -5,
						  20, -5,
						  40, 10);

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

BadGuy.RocketArguments = [null, null, {x:0, y:0}, null, null, null];

BadGuy.prototype.fireRockets = function() {
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

		TopLevel.container.add("BadGuySmallHomingRocket", BadGuy.RocketArguments);
	}, true).start();
}

BadGuy.prototype.fireAimedRockets = function() {
	TimeOutFactory.getTimeOut(100, 30, this, function(){ 
		var a = Random.getRandomArbitary(200, 340) * (Math.PI/180);

		var deployX = this.x + Math.cos( a ) * 200;
		var deployY = this.y + Math.sin( a ) * 200;

		BadGuy.RocketArguments[0]   = this.x;
		BadGuy.RocketArguments[1]   = this.y;
		BadGuy.RocketArguments[2].x = deployX;
		BadGuy.RocketArguments[2].y = deployY;
		BadGuy.RocketArguments[3]   = {x:TopLevel.playerData.ship.x, y:TopLevel.playerData.ship.y};
		BadGuy.RocketArguments[4]   = TopLevel.container;
		BadGuy.RocketArguments[5]   = 180;

		TopLevel.container.add("BadGuySmallHomingRocket", BadGuy.RocketArguments);
	}, true).start();
}

BadGuy.prototype.fireWideRockets = function() {
	TimeOutFactory.getTimeOut(100, 30, this, function(){ 
		var a = Random.getRandomArbitary(200, 340) * (Math.PI/180);

		var deployX = this.x + Math.cos( a ) * 200;
		var deployY = this.y + Math.sin( a ) * 200;

		BadGuy.RocketArguments[0]   = this.x;
		BadGuy.RocketArguments[1]   = this.y;
		BadGuy.RocketArguments[2].x = deployX;
		BadGuy.RocketArguments[2].y = deployY;
		BadGuy.RocketArguments[3]   = {x:TopLevel.playerData.ship.x, y:TopLevel.playerData.ship.y};
		BadGuy.RocketArguments[4]   = TopLevel.container;
		BadGuy.RocketArguments[5]   = 180;

		TopLevel.container.add("BadGuySmallHomingRocket", BadGuy.RocketArguments);
	}, true).start();
}

BadGuy.prototype.escape = function(onComplete) {	
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
				
				if(onComplete)
					onComplete();
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

BadGuy.prototype.onLastDamageLevelReached = function(other) {
	Ship.prototype.onLastDamageLevelReached.call(this, other);	
	this.escape();
}

function ConcreteBadGuy() {
	BadGuy.call(this);
}

ConcreteBadGuy.inheritsFrom( BadGuy );

ConcreteBadGuy.prototype.init = function() {	
	ConcreteBadGuy.prototype.getTractorBeamPoints = this.tProto.getTractorBeamPoints;
	ConcreteBadGuy.prototype.createStateMachine   = this.tProto.createStateMachine;	

	this.tProto.init.apply(this, arguments);
}

IntroBadGuy.inheritsFrom( BadGuy );

function IntroBadGuy() {
	BadGuy.call(this);
}

IntroBadGuy.prototype.init = function(x, y, container, target, onTractorBeamComplete){
	BadGuy.prototype.init.call(this, x, y, container, target);

	this.tractorBeam.init(container, onTractorBeamComplete);
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

	result[3].x = target.x + ( cosPerp1  * 115 );
	result[3].y = target.y + ( sinPerp1  * 115 );

	result[4].x = x + ( cos * d );
	result[4].y = y + ( sin * d );

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

MiddleBadGuy.inheritsFrom( BadGuy );

function MiddleBadGuy() {
	BadGuy.call(this);

	this.MOVE;
	this.ATTACK_1;
	this.ATTACK_2;
}

MiddleBadGuy.prototype.init = function(x, y, container, target, playerShip){
	BadGuy.prototype.init.call(this, x, y, container, target);
	
	this.playerShip = playerShip;
	// this.tractorBeam.init(container, function(){

	// });
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

	result[0].x = x + cosPerp1 * 10;
	result[0].y = y + sinPerp1 * 10;

	result[1].x = x + ( cos * (d*(3/4) + 30) );
	result[1].y = y + ( sin * (d*(3/4) + 30) );

	result[2].x = x + ( cos  * (d*(2/4) + 30) );
	result[2].y = y + ( sin  * (d*(2/4) + 30) );

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

	startMotion.init = function() {
		this.blockDamage = true;

		this.setAllExhaustState(Exhaust.SLOW);

		TweenMax.to(this, 2.5, {y:"+=350", onCompleteScope:this, onComplete:function(){
		 	this.blockDamage = false;
		 	this.setAllExhaustState(Exhaust.REGULAR);
		}});
	}

	var setExhaust = function(){		
		var x = Random.getRandomArbitary(30, TopLevel.canvas.width -  30);
		var y = Random.getRandomArbitary(30, TopLevel.canvas.height - 30);

		TweenMax.to(this, 2.5, {x:x, y:y, onCompleteScope:this, onComplete:function(){
		 	this.setAllExhaustState(Exhaust.REGULAR);
			
		 	if(Math.Random() < 0.5){
				this.currentMotion.set(this.ATTACK_1);
		 	}else{
		 		this.currentMotion.set(this.ATTACK_2);
		 	}
		}});
	}

	var attack_1 = function(){		
		this.fireAimedRockets();

		TimeOutFactory.getTimeOut(Random.getRandomArbitary(500, 2000), 1, this, function(){ 
			this.currentMotion.set(this.MOVE);
		}, true).start();
	}

	var attack_2 = function(){		
		this.fireWideRockets();

		TimeOutFactory.getTimeOut(Random.getRandomArbitary(500, 2000), 1, this, function(){ 
			this.currentMotion.set(this.MOVE);
		}, true).start();
	}

	this.MOVE 	  = this.currentMotion.add(setExhaust, idle, null); 
	this.ATTACK_1 = this.currentMotion.add(attack_1  , idle, null);
	this.ATTACK_2 = this.currentMotion.add(attack_2  , idle, null);
}

