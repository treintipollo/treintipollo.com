
CloneShip.inheritsFrom( Ship );

function CloneShip() {
	Ship.call(this);

	this.ADVANCE;
	this.GOTO_ATTACK_POSITION;
}

CloneShip.prototype.init = function(x, y, userX, userY, cloneProps){
	this.attackPosition = {x:userX+Math.cos(cloneProps.endAngle*(Math.PI/180)) * cloneProps.endDistance, 
						   y:userY+Math.sin(cloneProps.endAngle*(Math.PI/180)) * cloneProps.endDistance};
	this.speedX      = cloneProps.speed;
	this.advanceTime = cloneProps.advanceTime;

	Ship.prototype.init.call(this, x, y, TopLevel.container);
	
	this.color = cloneProps.color;
	
	this.rotation = 180;
	this.scaleX = 0.4;
	this.scaleY = 0.4;

	this.exhaust30.setColors(cloneProps.exhaustColor);
	this.exhaust60.setColors(cloneProps.exhaustColor);
	this.exhaust90.setColors(cloneProps.exhaustColor);
	this.exhaust120.setColors(cloneProps.exhaustColor); 
	this.exhaust150.setColors(cloneProps.exhaustColor);
}

CloneShip.prototype.createStateMachine = function() {
	Ship.prototype.createStateMachine.call(this);
	
	var advance = function(){
		this.exhaust30.neutral();
		this.exhaust60.neutral();
		this.exhaust90.neutral();
		this.exhaust120.neutral(); 
		this.exhaust150.neutral();

		this.weapon = TopLevel.weaponFactory.getInitializedWeapon(TopLevel.weaponFactory.CLONE_SHOT_WEAPON, 0, this, this.weapon); 

		TweenMax.to(this, this.advanceTime, {y:TopLevel.canvas.height + 100, ease:Linear.easeNone, onCompleteScope:this, onComplete:function(){
			this.alive = false;
		}});
	}

	var gotoAttackPosition = function(){
		this.exhaust30.slowDown();
		this.exhaust60.slowDown();
		this.exhaust90.slowDown();
		this.exhaust120.slowDown(); 
		this.exhaust150.slowDown();

		TweenMax.to(this, 1, {scaleX:1, scaleY:1, x:this.attackPosition.x, y:this.attackPosition.y, onCompleteScope:this, onComplete:function(){
			this.currentMotion.set(this.ADVANCE);
		}});
	}

	var idle = this.currentMotion.get(this.IDLE_MOTION);

	this.ADVANCE 			  = this.currentMotion.add(advance, idle.update, null);
	this.GOTO_ATTACK_POSITION = this.currentMotion.add(gotoAttackPosition, idle.update, null);
}

CloneShip.prototype.gotoInitialState = function() {
	this.currentMotion.set(this.GOTO_ATTACK_POSITION);
}

CloneShip.prototype.draw = function(context) { 
	Ship.prototype.draw.call(this, context);

	context.fillStyle   = "#000000";
	context.strokeStyle = this.color;

	var eyeSize   = 15;
	var eyeHeight = 12;

	context.beginPath();
	
	context.moveTo(-eyeSize, 0);	
	context.quadraticCurveTo(0, -eyeHeight, eyeSize, 0);
	context.moveTo(-eyeSize, 0);
	context.quadraticCurveTo(0, eyeHeight, eyeSize, 0);

	context.stroke();
	context.fill();

	context.clip();

	context.fillStyle = "#000000";
	
	context.beginPath();
	context.arc(0, 0, eyeHeight/2, 0, Math.PI*2, false);	
	context.moveTo(eyeHeight/8, 0);
	context.arc(0, 0, eyeHeight/8, 0, Math.PI*2, false);	
	context.closePath();

	context.stroke();
}

CloneShip.prototype.update = function(delta) { 	
	this.currentMotion.update();

	if(ArrowKeyHandler.isDown(ArrowKeyHandler.LEFT))  { 
		this.x -= this.speedX * delta; 	
	}
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.RIGHT)) { 
		this.x += this.speedX * delta; 
	}
		
	this.x += this.totalVariation.x;
	this.y += this.totalVariation.y;

	this.exhaust30.update();
	this.exhaust60.update();
	this.exhaust90.update();
	this.exhaust120.update(); 
	this.exhaust150.update();

	if(this.weapon) this.weapon.update();
}

CloneShip.prototype.onAllDamageReceived = function(other) {
	TopLevel.container.add("Explosion_Effect", [this.x, this.y, Random.getRandomArbitary(0, 360), 50, 230, this.color, '#FFFFFF']);
	this.alive = false;
}