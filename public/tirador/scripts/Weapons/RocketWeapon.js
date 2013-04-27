RocketWeapon.inheritsFrom( Weapon );

RocketWeapon.populateTargetGrid = function(sizeX, sizeY, spaceX, spaceY, offSetX, offSetY) {
	if(RocketWeapon.tGrid) return;

	RocketWeapon.tGrid = [];

	for(var i=0; i<sizeY; i++){
		for(var j=0; j<sizeX; j++){
			RocketWeapon.tGrid.push([null, (spaceX*j)+offSetX, (spaceY*i)+offSetY]);			
		}		
	}
}

RocketWeapon.RocketArguments = [null, null, {x:0, y:0}, null, null, null];

function RocketWeapon(id, name, level, user, hasInstructions) {
	Weapon.apply(this, arguments);

	this.targetType = "Target";

	RocketWeapon.populateTargetGrid(5, 5, 50, 50, -100, -500);

	this.crossHairAmount = [
		[ [2], [22] ],
		[ [2], [22] ],
		
		[ [6, 8], [5, 9] ],
		[ [6, 8], [5, 9] ],

		[ [7, 11, 13], [2, 10, 14] ],
		[ [7, 11, 13], [2, 10, 14] ],

		[ [6, 8], [5, 9] ],		
		[ [6, 8], [5, 9] ],
		[ [7, 11, 13], [2, 10, 14] ]
	];

	this.voleyAmounts    = [16, 16, 
							20, 20, 
							8, 8, 
							8, 8, 8];

	this.rocketTypes  = ["SmallSwarmRocket",
						 "LargeSwarmRocket",

						 "SmallSwarmRocket",
						 "LargeSwarmRocket",
						 
						 "SmallSwarmRocket",
						 "LargeSwarmRocket",
						 
						 "ClusterSwarmRocket",
						 "ClusterSwarmRocket",
						 "ClusterSwarmRocket"];

	this.rocketSpecificArguments  = [
		[0], [0], [0], [0], [0], [0], [2], [3], [4] 
	];

	this.targets 	   = [];
	this.crossHairMode = 0;

	if (typeof TimeOutFactory === "undefined") { return; }

	this.idleTimer = TimeOutFactory.getTimeOut(2000, 1, this, function(){
		this.createTargets();		
	});
}

RocketWeapon.prototype.init = function(container) {
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

		if(!ScreenUtils.isInScreenBoundsXY(inst.user.x, inst.user.y, 10, 10)){
			return;
		}

		if(nextTargetAvailable() == false){
			return;
		}

		var t = inst.targets[currentTarget];

		var xOffset = Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1);
		var yOffset = Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1);

		RocketWeapon.RocketArguments[0]   = inst.user.x;
		RocketWeapon.RocketArguments[1]   = inst.user.y;
		RocketWeapon.RocketArguments[2].x = inst.user.x + xOffset;
		RocketWeapon.RocketArguments[2].y = inst.user.y + yOffset;
		RocketWeapon.RocketArguments[3]   = t.t;
		RocketWeapon.RocketArguments[4]   = inst.container;
		RocketWeapon.RocketArguments[5]   = 0;
		RocketWeapon.RocketArguments[6]   = inst.rocketSpecificArguments[inst.level][0];

		var r = inst.container.add(inst.rocketTypes[inst.level], RocketWeapon.RocketArguments);

		if(r){
			t.rocketLimit--;

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

RocketWeapon.prototype.destroyTargets = function() {
	if(this.targets) {
		for(var i=0; i<this.targets.length; i++){	
			this.targets[i].t.alive = false;
		}
		this.targets.length = 0;
	}
}

RocketWeapon.prototype.createTargets = function() {

	if(this.targets){
		if(this.targets.length == this.crossHairAmount[this.level][this.crossHairMode].length){
			return;
		}
	}

	for(var i=0; i<this.crossHairAmount[this.level][this.crossHairMode].length; i++){
		
		if(this.isTargetPositionTaken(i)) 
			continue;

		var targetOffset = RocketWeapon.tGrid[this.crossHairAmount[this.level][this.crossHairMode][i]];
		
		targetOffset[0] = this.user;

		var t = this.container.add(this.targetType, targetOffset);

		t.addOnDestroyCallback(this, function(obj){
			if(!this.targets) return;

			for(var j=0; j<this.targets.length; j++){
				if(this.targets[j].t === obj){
					break;
				}
			}

			this.targets.splice(j, 1);
		});

		this.targets.push({posId:i, t:t, rocketLimit:this.voleyAmounts[this.level]-1});
	}
}

RocketWeapon.prototype.isTargetPositionTaken = function(posId) {
	if(!this.targets) 
		false; 

	for(var i=0; i<this.targets.length; i++){
		if(this.targets[i].posId == posId){			
			return true;
		}
	}

	return false;
}

RocketWeapon.prototype.powerUp = function() {
	Weapon.prototype.powerUp.call(this);
	this.destroyTargets();
	this.createTargets();
}

RocketWeapon.prototype.destroy = function() {
	this.destroyTargets();
	
	if(this.callbacks)
		ArrowKeyHandler.removeCallbacks(this.callbacks);
	
	if(this.idleTimer) this.idleTimer.stop();

	DestroyUtils.destroyAllProperties(this);
}