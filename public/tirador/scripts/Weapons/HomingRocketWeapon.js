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

	this.rocketTypes  = ["SmallHomingRocket",
						 "LargeHomingRocket",

						 "SmallHomingRocket",
						 "SmallHomingRocket",
						 "LargeHomingRocket",

						 "SmallHomingRocket",
						 "SmallHomingRocket",
						 "LargeHomingRocket",
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
}

HomingRocketWeapon.prototype.init = function(container) {
	Weapon.prototype.init.call(this, container);

	this.createTargets();

	var inst = this;

	var currentTarget = 0;
	
	var nextTargetAvailable = function() {
		if(inst.targets.length == 0){ 
			return false;
		}
		if(inst.targets.length == 1){
			currentTarget = 0;
			return true;
		}

		currentTarget++;
		
		if(currentTarget > inst.targets.length-1){
			currentTarget = 0;	
		}

		var target = inst.targets[currentTarget];

		if(!target) {
			return nextTargetAvailable();			
		}
	}

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, function(){

		if(!ScreenUtils.isInScreenBoundsXY(inst.user.x, inst.user.y)){
			return;
		}

		if(nextTargetAvailable() == false){
			return;
		}

		var t = inst.targets[currentTarget];

		var xOffset = Math.cos(inst.deployPosition[inst.currentDeplayIndex].radianRotation) * inst.deployPosition[inst.currentDeplayIndex].radius;
		var yOffset = Math.sin(inst.deployPosition[inst.currentDeplayIndex].radianRotation) * inst.deployPosition[inst.currentDeplayIndex].radius;

		RocketWeapon.RocketArguments[0]   = inst.user.x;
		RocketWeapon.RocketArguments[1]   = inst.user.y;
		RocketWeapon.RocketArguments[2].x = inst.user.x + xOffset;
		RocketWeapon.RocketArguments[2].y = inst.user.y + yOffset;
		RocketWeapon.RocketArguments[3]   = t.t;
		RocketWeapon.RocketArguments[4]   = inst.container;
		RocketWeapon.RocketArguments[5]   = inst.deployPosition[inst.currentDeplayIndex].degreeRotation;
		
		var r = inst.container.add(inst.rocketTypes[inst.level], RocketWeapon.RocketArguments);

		if(r){
			inst.currentDeplayIndex++;

			if(inst.currentDeplayIndex >= inst.deployPosition.length){
				inst.currentDeplayIndex = 0;
			}

			if(!t.t.isLocked()){
				t.rocketLimit--;
			}

			if(t.rocketLimit < 0){
				t.t.disable();
			}

		}

		inst.idleTimer.reset();
	});

	this.callbacks.push(c);

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, function(){
		inst.crossHairMode++;

		if(inst.crossHairMode > inst.crossHairAmount[inst.level].length-1){
			inst.crossHairMode = 0;
		}

		for(var i=0; i<inst.targets.length; i++){	
			var targetOffset = RocketWeapon.tGrid[inst.crossHairAmount[inst.level][inst.crossHairMode][i]];
			
			inst.targets[i].t.setOffSet.apply(inst.targets[i].t, targetOffset);
		}

	});

	this.callbacks.push(c);
}

HomingRocketWeapon.prototype.createInstructions = function() {
	$("#main #shotInstructions").remove();	
	
	var instructions = document.createElement("h2");
	instructions.id = "shotInstructions";
	instructions.innerHTML = "S to change AIM -" + "- Weapon Level: " + this.level;
	$("#main").append(instructions);
}