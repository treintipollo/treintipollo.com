RocketWeapon.inheritsFrom( Weapon );

function RocketWeapon() {
	Weapon.apply(this, arguments);

	var inst = this;

	this.voleyAmounts = [4,5,6,4,6,7,5,7,8];
	this.rocketTypes  = ["Rocket","Rocket","Rocket","LargeRocket","LargeRocket","LargeRocket","ClusterRocket","ClusterRocket","ClusterRocket"];

	this.rocketLevel  = [
						//Rocket *4
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Rocket *5
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Rocket *6
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Large Rocket *4
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Large Rocket *6
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Large Rocket *7
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c]; 
						},
						//Cluster Rocket *5
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c, 3]; 
						},
						//Cluster Rocket *7
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c, 4]; 
						},
						//Cluster Rocket *8
						function(x, y, tx, ty, xOffset, yOffset, c){
							return [x, y, {x:x + xOffset, y:y + yOffset}, {x:tx, y:ty},c, 5]; 
						}];


	var c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
		inst.target.lock();
	}, 100);

	this.callbacks.push(c);

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.CTRL, function(){
		if(inst.currentVoleyCount < inst.voleyAmounts[inst.level]){

			var xOffset = Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1);
			var yOffset = Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1);

			var rocket = inst.container.add(inst.rocketTypes[inst.level], 
											inst.rocketLevel[inst.level](inst.user.x, inst.user.y, inst.target.x, inst.target.y, xOffset, yOffset, inst.container));

			inst.currentVoleyCount++;

			rocket.addOnDestroyCallback(this, function(obj){
				inst.currentVoleyCount--;
			});
		}

		inst.target.unlock();
	});

	this.callbacks.push(c);

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.ALT, function(){
		inst.target.reset();
	});

	this.callbacks.push(c);	
}

RocketWeapon.prototype.init = function(container) {
	this.parent.init(container);
	this.target = this.container.add("Target", [this.user]);
	this.target.reset();
}

RocketWeapon.prototype.destroy = function() {
	ArrowKeyHandler.removeCallbacks(this.callbacks);
	this.target.alive = false;
}

RocketWeapon.prototype.getId = function() {
	return WeaponPowerUp.ROCKET;
}

RocketWeapon.prototype.createInstructions = function() {
	$("#main #shotInstructions").remove();	
	
	var instructions = document.createElement("h2");
	instructions.id = "shotInstructions";
	instructions.innerHTML = "Keep pressed to AIM. ALT to reset AIM." + " Weapon Level: " + this.level;
	$("#main").append(instructions);
}