BadGuy.inheritsFrom( Ship );

function BadGuy() {
	Ship.call(this);

	var tractorBeamPoints = [];
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });
	tractorBeamPoints.push({ x:0, y:0 });

	function getExhaustPointsWrapper(side)  { return getTractorBeamPoints(tractorBeamPoints, this.x, this.y, this.target, side); };

	function getTractorBeamPoints(result, x, y, target, side) {
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
	};

	this.tractorBeam = new TractorBeam(getExhaustPointsWrapper, this);
	this.target      = null;
}

BadGuy.prototype.init = function(x, y, container, target, onTractorBeamComplete){
	Ship.prototype.init.call(this, x, y, container);
	this.color = "#FFFFFF";
	this.target = target;

	this.tractorBeam.init(container, onTractorBeamComplete);
}

BadGuy.prototype.createStateMachine = function() {
	Ship.prototype.createStateMachine.call(this);
	
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

BadGuy.prototype.escape = function(onComplete) {	
	this.setAllExhaustState(Exhaust.SLOW);

	var lastPosY = this.y;

	TimeOutFactory.getTimeOut(300, 1, this, function() {
		TweenMax.to(this, 2, {
			y: "-=700",
			ease: Back.easeIn,
			onCompleteScope: this,
			onUpdateScope: this,
			onComplete: function() {
				this.alive = false;
				onComplete();
			},
			onUpdate: function() {
				if (lastPosY > this.y) {
					this.setAllExhaustState(Exhaust.FAST);
				}

				lastPosY = this.y;
			}
		});

		TweenMax.to(this.target, 2, {
			y: "-=700",
			ease: Back.easeIn
		});
	}, true).start();
}

BadGuy.prototype.destroy = function() {
	Ship.call(this);

	this.target.alive = false;
	this.tractorBeam.destroy();
}

BadGuy.prototype.onDamageBlocked = function(other) {

}

BadGuy.prototype.onDamageReceived = function(other) {

}

BadGuy.prototype.onLastDamageLevelReached = function(other) {

}

BadGuy.prototype.onAllDamageReceived = function(other) {
	
}

BadGuy.prototype.onDamageRecoveredOutOfLastLevel = function(other) {
	
}