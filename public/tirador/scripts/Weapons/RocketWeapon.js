RocketWeapon.inheritsFrom( Weapon );

function RocketWeapon() {
	Weapon.apply(this, arguments);

	this.target = new Target(this.user);
	this.target.reset();

	var inst = this;

	this.voleyAmounts = [4,5,6,4,6,7,5,7,8];
	this.rocketLevel  = [
						//Rocket *4
						function(){return new Rocket(inst.user.x, inst.user.y, 
													  {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
												      y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
													  {x:inst.target.x, y:inst.target.y},
													  inst.container);},
						//Rocket *5
						function(){return new Rocket(inst.user.x, inst.user.y, 
													 {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
												     y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
													 {x:inst.target.x, y:inst.target.y},
													 inst.container);},
						//Rocket *6
						function(){return new Rocket(inst.user.x, inst.user.y, 
													 {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
													 y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
													 {x:inst.target.x, y:inst.target.y},
													 inst.container);},
						//Large Rocket *4
						function(){return new LargeRocket(inst.user.x, inst.user.y, 
														 {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
														 y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
														 {x:inst.target.x, y:inst.target.y},
														 inst.container);},
						//Large Rocket *6
						function(){return new LargeRocket(inst.user.x, inst.user.y, 
														  {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
														  y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
														  {x:inst.target.x, y:inst.target.y},
														  inst.container);},
						//Large Rocket *7
						function(){return new LargeRocket(inst.user.x, inst.user.y, 
														  {x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
														  y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
														  {x:inst.target.x, y:inst.target.y},
														  inst.container);},
						//Cluster Rocket *5
						function(){return new ClusterRocket(inst.user.x, inst.user.y, 
															{x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
															y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
															{x:inst.target.x, y:inst.target.y},
															inst.container,
															3);},
						//Cluster Rocket *7
						function(){return new ClusterRocket(inst.user.x, inst.user.y, 
															{x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
															y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
															{x:inst.target.x, y:inst.target.y},
															inst.container,
															4);},
						//Cluster Rocket *8
						function(){return new ClusterRocket(inst.user.x, inst.user.y, 
															{x:inst.user.x + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(1, -1), 
															y:inst.user.y + Random.getRandomArbitary(-75, 75)*Random.getRandomBetweenToValues(-1, 1)},
															{x:inst.target.x, y:inst.target.y},
															inst.container,
															5);}
	];

	

	var c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
		inst.target.lock();
	}, 100);

	this.callbacks.push(c);

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.CTRL, function(){
		if(inst.currentVoleyCount < inst.voleyAmounts[inst.level]){

			var rocket = inst.rocketLevel[inst.level]();

			inst.container.add(rocket, 1, true);

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

	this.container.add(this.target,1);
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
	instructions.innerHTML = "Keep pressed to AIM. ALT to reset AIM." + " Weapon Level: " + level;
	$("#main").append(instructions);
}