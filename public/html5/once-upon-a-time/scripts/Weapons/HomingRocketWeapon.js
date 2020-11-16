HomingRocketWeapon.inheritsFrom( RocketWeapon );

function HomingRocketWeapon(id, name, level, user, hasInstructions) {
	Weapon.apply(this, arguments);

	this.targetType = "HomingTarget";

	RocketWeapon.populateTargetGrid(5, 5, 50, 50, -100, -500);

	this.crossHairAmount = [
		[ [2], [22] ],
		[ [2], [22] ],
		
		[ [2, 22], [5, 9] ],
		[ [2, 22], [5, 9] ],
		[ [2, 22], [5, 9] ],
		
		[ [2, 11, 13], [0, 4, 22] ],
		[ [2, 11, 13], [0, 4, 22] ],		
		[ [2, 11, 13], [0, 4, 22] ],
		[ [2, 11, 13], [0, 4, 22] ],
	];

	this.voleyAmounts    = [8, 8, 
							8, 16, 8, 
							8, 16, 8, 16];

	this.rocketTypes  = ["MicroHomingRocket",
						 "SmallHomingRocket",

						 "MicroHomingRocket",
						 "MicroHomingRocket",
						 "SmallHomingRocket",

						 "MicroHomingRocket",
						 "SmallHomingRocket",
						 "SmallHomingRocket",
						 "LargeHomingRocket"];

	var addDeployPosition = function(radius, angle) {
		var dRotation = (angle+90)+(angle*this.deployPosition.length);
		var rRotation = (angle*(this.deployPosition.length+1))*(Math.PI/180);

		this.deployPosition.push( { radius:radius, degreeRotation:dRotation, radianRotation:rRotation } );
	}

	this.deployPosition = [];
	
	for(var i=0; i<8; i++){
		addDeployPosition.call(this, 70, 22);
	}

	this.targets 	        = [];
	this.crossHairMode      = 0;
	this.currentDeplayIndex = 0;

	this.idleTimer = TimeOutFactory.getTimeOut(2000, 1, this, function(){
		this.createTargets();		
	});

	this.amount = 20;
}

HomingRocketWeapon.prototype.increaseAmmo = function(amount) {
	RocketWeapon.prototype.increaseAmmo.call(this, amount);
}

HomingRocketWeapon.prototype.getAmmo = function() {
	return RocketWeapon.prototype.getAmmo.call(this);
}

HomingRocketWeapon.prototype.setAmmo = function(amount) {
	RocketWeapon.prototype.setAmmo.call(this, amount);
}

HomingRocketWeapon.prototype.init = function(container) {
	Weapon.prototype.init.call(this, container);

	this.createTargets();

	var inst = this;

	var currentTarget = 0;
	
	var nextTargetAvailable = function() {
		
		for (var i = container.mainObjects.length - 1; i >= 0; i--) {
			var a = container.mainObjects[i];

			if (a != null) {
				for (var j = 0; j < a.length; j++) {
					var object = a[j];

					if (object.alive && object instanceof EnemyRocket) {
						return object;
					}
					else if (object.alive && object instanceof CloneShip) {
						return object;
					}
					else if (object.alive && object instanceof CargoShip) {
						return object;
					}
					else if (object.alive && object instanceof BadGuy) {
						return object;
					}
					else if (object.alive && object instanceof Boss_1) {
						return object;
					}
				}
			}
		}
	}

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, function(){

		if(!ScreenUtils.isInScreenBoundsXY(inst.user.x, inst.user.y)){
			return;
		}

		const t = nextTargetAvailable();

		if (!t)
			return;

		if (inst.amount <= 0)
			return;

		inst.amount--;

		var xOffset = Math.cos(inst.deployPosition[inst.currentDeplayIndex].radianRotation) * inst.deployPosition[inst.currentDeplayIndex].radius;
		var yOffset = Math.sin(inst.deployPosition[inst.currentDeplayIndex].radianRotation) * inst.deployPosition[inst.currentDeplayIndex].radius;

		RocketWeapon.RocketArguments[0]   = inst.user.x;
		RocketWeapon.RocketArguments[1]   = inst.user.y;
		RocketWeapon.RocketArguments[2].x = inst.user.x + xOffset;
		RocketWeapon.RocketArguments[2].y = inst.user.y + yOffset;
		RocketWeapon.RocketArguments[3]   = t;
		RocketWeapon.RocketArguments[4]   = inst.container;
		RocketWeapon.RocketArguments[5]   = inst.deployPosition[inst.currentDeplayIndex].degreeRotation;
		
		var r = inst.container.add(inst.rocketTypes[inst.level], RocketWeapon.RocketArguments);

		if(r) {
			inst.currentDeplayIndex++;

			if(inst.currentDeplayIndex >= inst.deployPosition.length){
				inst.currentDeplayIndex = 0;
			}
		}

		TopLevel.playerData.execute("rocket", TopLevel.playerData);

		inst.idleTimer.reset();
	});

	this.callbacks.push(c);
}