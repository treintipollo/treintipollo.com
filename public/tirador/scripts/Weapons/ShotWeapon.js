ShotWeapon.inheritsFrom( Weapon );

function ShotWeapon() {
	Weapon.apply(this, arguments);

	this.voleyAmounts = [3,3,3,4,4,4,4,4,5];

	this.shotCharge = new ShotCharge(this.user, 0, -40, 210, 330, 60, this.container);
	this.shotCharge.off();
	
	var inst = this;
	
	this.shotLevels = [
		function(){
			//Single Shot *4
			return [new Shot(inst.user.x, inst.user.y - 30, false)];
		},
		function(){
			//Single Shot Big *4
			return [new Shot(inst.user.x, inst.user.y - 30, true)];
		},
		function(){
			//Double Shot *4
			return [new Shot(inst.user.x + 40, inst.user.y, false),
					new Shot(inst.user.x - 40, inst.user.y, false)];
		},
		function(){
			//Double Shot *5
			return [new Shot(inst.user.x + 40, inst.user.y, false),
					new Shot(inst.user.x - 40, inst.user.y, false)];
		},
		function(){
			//Double Shot Big *5
			return [new Shot(inst.user.x + 40, inst.user.y, true),
					new Shot(inst.user.x - 40, inst.user.y, true)];
		},
		function(){
			//Triple Shot *5
			return [new Shot(inst.user.x, inst.user.y - 30, false),
					new Shot(inst.user.x + 40, inst.user.y, false),
					new Shot(inst.user.x - 40, inst.user.y, false)];
		},
		function(){
			//Triple Shot *6
			return [new Shot(inst.user.x, inst.user.y - 30, false),
					new Shot(inst.user.x + 40, inst.user.y, false),
					new Shot(inst.user.x - 40, inst.user.y, false)];
		},
		function(){
			//Triple Shot Big *6
			return [new Shot(inst.user.x, inst.user.y - 30, true),
					new Shot(inst.user.x + 40, inst.user.y, true),
					new Shot(inst.user.x - 40, inst.user.y, true)];
		},
		function(){
			//Triple Shot Big *7
			return [new Shot(inst.user.x, inst.user.y - 30, true),
					new Shot(inst.user.x + 40, inst.user.y, true),
					new Shot(inst.user.x - 40, inst.user.y, true)];
		}
	];

	this.powerShotLevels = [
		function(){
			//Power Shot 1
			return [new PowerShot(inst.user, 4, 7, 25, 10, 0, -70, "#FFFFFF", inst.container)];
		},
		function(){
			//Power Shot 2
			return [new PowerShot(inst.user, 5, 10, 30, 15, 0, -70, "#FFFFFF", inst.container)];
		},
		function(){
			//Power Shot 3
			return [new PowerShot(inst.user, 6, 10, 35, 20, 0, -70, "#FFFFFF", inst.container)];
		},
		function(){
			//Double Power Shot 1
			return [new PowerShotSine(inst.user, 4, 7, 25, 10, 30, -40, "#F280A3", inst.container, 1),
					new PowerShotSine(inst.user, 4, 7, 25, 10, -30, -40, "#80D0F2", inst.container, -1)];
		},
		function(){
			//Double Power Shot 2
			return [new PowerShotSine(inst.user, 5, 10, 30, 15, 30, -40, "#F280A3", inst.container, 1),
					new PowerShotSine(inst.user, 5, 10, 30, 15, -30, -40, "#80D0F2", inst.container, -1)];
		},
		function(){
			//Double Power Shot 3
			return [new PowerShotSine(inst.user, 6, 12, 35, 20, 30, -40, "#F280A3", inst.container, 1),
					new PowerShotSine(inst.user, 6, 12, 35, 20, -30, -40, "#80D0F2", inst.container, -1)];
		},
		function(){
			//Triple Power Shot 1
			return [new PowerShotCircle(inst.user, 5, 12, 15, 5, 30,  20, "#F280A3", inst.container, 0, -65),
					new PowerShotCircle(inst.user, 5, 12, 15, 5, 150, 20, "#80D0F2", inst.container, 0, -65),
					new PowerShotCircle(inst.user, 5, 12, 15, 5, 270, 20, "#89F280", inst.container, 0, -65)];
		},
		function(){
			//Triple Power Shot 2
			return [new PowerShotCircle(inst.user, 6, 12, 20, 10, 30,  20, "#F280A3", inst.container, 0, -65),
					new PowerShotCircle(inst.user, 6, 12, 20, 10, 150, 20, "#80D0F2", inst.container, 0, -65),
					new PowerShotCircle(inst.user, 6, 12, 20, 10, 270, 20, "#89F280", inst.container, 0, -65)];
		},
		function(){
			//Triple Power Shot 3
			return [new PowerShotCircle(inst.user, 7, 12, 25, 10, 30,  60, "#F280A3", inst.container, 0, 0),
					new PowerShotCircle(inst.user, 7, 12, 25, 10, 150, 60, "#80D0F2", inst.container, 0, 0),
					new PowerShotCircle(inst.user, 7, 12, 25, 10, 270, 60, "#89F280", inst.container, 0, 0)];
		}
	];

	var c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
		inst.shotCharge.on();
	}, 200);

	this.callbacks.push(c);

	this.powerShotVoley = null;

	c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
		inst.shotCharge.off();

		inst.powerShotVoley = new ShotVoley(inst.powerShotLevels[inst.level](), inst.container, null, true);

	}, 3000);

	this.callbacks.push(c);

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.CTRL, function(){
		if(inst.powerShotVoley != null){
			inst.powerShotVoley.release();
		}else{
			if(inst.currentVoleyCount < inst.voleyAmounts[inst.level]){
				inst.currentVoleyCount++;				

				new ShotVoley(inst.shotLevels[inst.level](), inst.container, function(){
					inst.currentVoleyCount--;
				}, false);	
			}
		}

		inst.shotCharge.off();
		inst.powerShotVoley = null;
	});

	this.callbacks.push(c);
}

ShotWeapon.prototype.update = function() {
	this.shotCharge.update();
}

ShotWeapon.prototype.destroy = function() {
	if(this.powerShotVoley != null){
		this.powerShotVoley.release();
	}

	this.shotCharge.destroy();

	ArrowKeyHandler.removeCallbacks(this.callbacks);
	DestroyUtils.destroyAllProperties(this);
}

ShotWeapon.prototype.getId = function() {
	return WeaponPowerUp.SHOT;
}

ShotWeapon.prototype.createInstructions = function() {
	$("#main #shotInstructions").remove();	
	
	var instructions = document.createElement("h2");
	instructions.id = "shotInstructions";
	instructions.innerHTML = "Keep pressed to CHARGE SHOT." + " Weapon Level: " + this.level;
	$("#main").append(instructions);
}

function ShotVoley(shots, container, onComplete, powerShot) {
	this.shotCount  = shots.length;
	this.shots = null;

	for(var i=0; i<shots.length; i++){
		shots[i].addOnDestroyCallback(this, function(obj){
			this.shotCount--;

			if(this.shotCount <= 0){
				if(onComplete != null){
					onComplete();
				}
			}
		});	

		container.add(shots[i], 1, true);
	}

	if(powerShot){
		this.shots = shots;
	}else{
		shots.length = 0;
		shots 		 = null;	
	}
}

ShotVoley.prototype.release = function(){
	for(var i=0; i<this.shots.length; i++){
		this.shots[i].release();
	}

	this.shots.length = 0;
	this.shots 		  = null;
}
