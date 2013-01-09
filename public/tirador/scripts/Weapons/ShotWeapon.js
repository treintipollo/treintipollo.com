ShotWeapon.inheritsFrom( Weapon );

function ShotWeapon() {
	Weapon.apply(this, arguments);

	this.voleyAmounts   = [3,3,3,4,4,4,4,4,5];
	this.shotTypes 		= ["Shot","Shot","Shot","Shot","Shot","Shot","Shot","Shot","Shot"];
	this.powerShotTypes = ["PowerShot","PowerShot","PowerShot","PowerShotSine","PowerShotSine","PowerShotSine","PowerShotCircle","PowerShotCircle","PowerShotCircle"];

	this.shotCharge = new ShotCharge(this.user, 0, -40, 210, 330, 60);
	this.shotCharge.off();
	
	var inst = this;
	
	this.shotLevels = [
	function(){
			//Single Shot *4
			return [[inst.user.x, inst.user.y - 30, false]];
		},
		function(){
			//Single Shot Big *4
			return [[inst.user.x, inst.user.y - 30, true]];
		},
		function(){
			//Double Shot *4
			return [[inst.user.x + 40, inst.user.y, false],
			[inst.user.x - 40, inst.user.y, false]];
		},
		function(){
			//Double Shot *5
			return [[inst.user.x + 40, inst.user.y, false],
			[inst.user.x - 40, inst.user.y, false]];
		},
		function(){
			//Double Shot Big *5
			return [[inst.user.x + 40, inst.user.y, true],
			[inst.user.x - 40, inst.user.y, true]];
		},
		function(){
			//Triple Shot *5
			return [[inst.user.x, inst.user.y - 30, false],
			[inst.user.x + 40, inst.user.y, false],
			[inst.user.x - 40, inst.user.y, false]];
		},
		function(){
			//Triple Shot *6
			return [[inst.user.x, inst.user.y - 30, false],
			[inst.user.x + 40, inst.user.y, false],
			[inst.user.x - 40, inst.user.y, false]];
		},
		function(){
			//Triple Shot Big *6
			return [[inst.user.x, inst.user.y - 30, true],
			[inst.user.x + 40, inst.user.y, true],
			[inst.user.x - 40, inst.user.y, true]];
		},
		function(){
			//Triple Shot Big *7
			return [[inst.user.x, inst.user.y - 30, true],
			[inst.user.x + 40, inst.user.y, true],
			[inst.user.x - 40, inst.user.y, true]];
		}
		];

		this.powerShotLevels = [
		function(){
			//Power Shot 1
			return [[inst.user, 4, 550, 25, 10, 0, -70, "#FFFFFF", inst.container]];
		},
		function(){
			//Power Shot 2
			return [[inst.user, 5, 550, 30, 15, 0, -70, "#FFFFFF", inst.container]];
		},
		function(){
			//Power Shot 3
			return [[inst.user, 6, 550, 35, 20, 0, -70, "#FFFFFF", inst.container]];
		},
		function(){
			//Double Power Shot 1
			return [[inst.user, 4, 550, 25, 10, 30, -40, "#F280A3", inst.container, 1],
			[inst.user, 4, 550, 25, 10, -30, -40, "#80D0F2", inst.container, -1]];
		},
		function(){
			//Double Power Shot 2
			return [[inst.user, 5, 550, 30, 15, 30, -40, "#F280A3", inst.container, 1],
			[inst.user, 5, 550, 30, 15, -30, -40, "#80D0F2", inst.container, -1]];
		},
		function(){
			//Double Power Shot 3
			return [[inst.user, 6, 550, 35, 20, 30, -40, "#F280A3", inst.container, 1],
			[inst.user, 6, 550, 35, 20, -30, -40, "#80D0F2", inst.container, -1]];
		},
		function(){
			//Triple Power Shot 1
			return [[inst.user, 5, 550, 15, 5, 30,  20, "#F280A3", inst.container, 0, -65],
			[inst.user, 5, 550, 15, 5, 150, 20, "#80D0F2", inst.container, 0, -65],
			[inst.user, 5, 550, 15, 5, 270, 20, "#89F280", inst.container, 0, -65]];
		},
		function(){
			//Triple Power Shot 2
			return [[inst.user, 6, 550, 20, 10, 30,  20, "#F280A3", inst.container, 0, -65],
			[inst.user, 6, 550, 20, 10, 150, 20, "#80D0F2", inst.container, 0, -65],
			[inst.user, 6, 550, 20, 10, 270, 20, "#89F280", inst.container, 0, -65]];
		},
		function(){
			//Triple Power Shot 3
			return [[inst.user, 7, 550, 25, 10, 30,  60, "#F280A3", inst.container, 0, 0],
			[inst.user, 7, 550, 25, 10, 150, 60, "#80D0F2", inst.container, 0, 0],
			[inst.user, 7, 550, 25, 10, 270, 60, "#89F280", inst.container, 0, 0]];
		}
		];

		var c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
			inst.shotCharge.on();
		}, 200);

		this.callbacks.push(c);

		this.powerShotVoley = null;

		c = ArrowKeyHandler.addKeyDownTimeOutCallback(ArrowKeyHandler.CTRL, function(){
			inst.shotCharge.off();

			inst.powerShotVoley = new ShotVoley(inst.powerShotTypes[inst.level], inst.powerShotLevels[inst.level](), inst.container, null, true);

		}, 3000);

		this.callbacks.push(c);

		c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.CTRL, function(){
			if(inst.powerShotVoley != null){
				inst.powerShotVoley.release();
			}else{
				if(inst.currentVoleyCount < inst.voleyAmounts[inst.level]){
					inst.currentVoleyCount++;				

					new ShotVoley(inst.shotTypes[inst.level], inst.shotLevels[inst.level](), inst.container, function(){
						inst.currentVoleyCount--;
					}, false);	
				}
			}

			inst.shotCharge.off();
			inst.powerShotVoley = null;
		});

		this.callbacks.push(c);
	}

	ShotWeapon.prototype.init = function(container) {
		this.parent.init(container);
		this.shotCharge.init(container);
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

	function ShotVoley(type, shots, container, onComplete, powerShot) {
		this.shotCount  = shots.length;

		if(powerShot){
			this.shots = [];
		}

		for(var i=0; i<shots.length; i++){
			var shot = container.add(type, shots[i], 1, true);

			if(powerShot){
				this.shots.push(shot);
			}else{
				shot.addOnDestroyCallback(this, function(obj){
					this.shotCount--;

					if(this.shotCount <= 0){				
						onComplete();
					}
				});	
			}
		}

		shots.length = 0;
		shots 		 = null;	
	}

	ShotVoley.prototype.release = function(){
		for(var i=0; i<this.shots.length; i++){
			this.shots[i].release();
		}

		this.shots.length = 0;
		this.shots 		  = null;
	}
