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

	this.voleyAmounts    = [24, 24, 
							24, 24, 
							24, 24, 
							24, 24, 24];

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

	this.keyUpCallback = null;

	this.amount = 20;
}

RocketWeapon.prototype.increaseAmmo = function(amount) {
	this.amount += amount;
}

RocketWeapon.prototype.getAmmo = function() {
	return this.amount;
}

RocketWeapon.prototype.setAmmo = function(amount) {
	this.amount = amount;
}

RocketWeapon.prototype.init = function(container) {
	Weapon.prototype.init.call(this, container);

	this.destroyTargets();
	this.createTargets();

	var inst = this;

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, function(){

		if(!ScreenUtils.isInScreenBoundsXY(inst.user.x, inst.user.y, 10, 10)) {
			return;
		}

		if (inst.amount <= 0)
			return;

		inst.amount--;

		for(var i=0; i<inst.targets.length; i++){
			var t = inst.targets[i];

			if(!t) continue;

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
				inst.idleTimer.reset();
			}
		}

		TopLevel.playerData.execute("rocket", TopLevel.playerData);
	});

	this.keyUpCallback = c;

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

RocketWeapon.prototype.powerUp = function(amount) {
	Weapon.prototype.powerUp.call(this, amount);
	this.destroyTargets();
	this.createTargets();
}

RocketWeapon.prototype.destroy = function() {
	this.destroyTargets();
	
	if(this.callbacks)
		ArrowKeyHandler.removeCallbacks(this.callbacks);
	
	if(this.idleTimer) this.idleTimer.stop();

	this.keyUpCallback = null;

	DestroyUtils.destroyAllProperties(this);
}

RocketWeapon.prototype.start = function() {
	this.destroyTargets();
	this.createTargets();

	if (this.idleTimer) {
		this.idleTimer.start();
	}
	
	ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, this.keyUpCallback.callback);
	this.callbacks.push(this.keyUpCallback);
}

RocketWeapon.prototype.stop = function() {
	this.destroyTargets();
	
	ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_2, this.keyUpCallback);
	this.callbacks.pop();
	
	if(this.idleTimer) this.idleTimer.stop();
}