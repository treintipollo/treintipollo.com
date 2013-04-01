//offSetX, offSetY, speed
ShotWeapon.Top_Shot       = [null, null,   0, -30, 700];
ShotWeapon.Right_Shot     = [null, null,  40, 0  , 700];
ShotWeapon.Left_Shot      = [null, null, -40, 0  , 700];

//vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, damageMultiplier
ShotWeapon.Single_Power_Shot_1 = [null, null, 4, 550, 25, 10, 0, -70, "#FFFFFF"]; 
ShotWeapon.Single_Power_Shot_2 = [null, null, 5, 550, 30, 15, 0, -70, "#FFFFFF"]; 
ShotWeapon.Single_Power_Shot_3 = [null, null, 6, 550, 35, 20, 0, -70, "#FFFFFF"]; 

//vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, damageMultiplier, side
ShotWeapon.Double_Power_Shot_1_A = [null, null, 4, 550, 25, 10,  30, -40, "#F280A3", 1];
ShotWeapon.Double_Power_Shot_1_B = [null, null, 4, 550, 25, 10, -30, -40, "#80D0F2",-1];

ShotWeapon.Double_Power_Shot_2_A = [null, null, 5, 550, 30, 15,  30, -40, "#F280A3", 1];
ShotWeapon.Double_Power_Shot_2_B = [null, null, 5, 550, 30, 15, -30, -40, "#80D0F2", -1];

ShotWeapon.Double_Power_Shot_3_A = [null, null, 6, 550, 35, 20,  30, -40, "#F280A3", 1];
ShotWeapon.Double_Power_Shot_3_B = [null, null, 6, 550, 35, 20, -30, -40, "#80D0F2", -1];

//vertexCount, speed, radius, innerRadius, offsetX, offsetY, color, damageMultiplier, rotationCenterX, rotationCenterY
ShotWeapon.Triple_Power_Shot_1_A = [null, null, 5, 550, 15, 5,  30, 20, "#F280A3", 0, -65];
ShotWeapon.Triple_Power_Shot_1_B = [null, null, 5, 550, 15, 5, 150, 20, "#80D0F2", 0, -65];
ShotWeapon.Triple_Power_Shot_1_C = [null, null, 5, 550, 15, 5, 270, 20, "#89F280", 0, -65];

ShotWeapon.Triple_Power_Shot_2_A = [null, null, 6, 550, 20, 10,  30, 20, "#F280A3", 0, -65];
ShotWeapon.Triple_Power_Shot_2_B = [null, null, 6, 550, 20, 10, 150, 20, "#80D0F2", 0, -65];
ShotWeapon.Triple_Power_Shot_2_C = [null, null, 6, 550, 20, 10, 270, 20, "#89F280", 0, -65];

ShotWeapon.Triple_Power_Shot_3_A = [null, null, 7, 550, 25, 10,  30, 60, "#F280A3", 0, 0];
ShotWeapon.Triple_Power_Shot_3_B = [null, null, 7, 550, 25, 10, 150, 60, "#80D0F2", 0, 0];
ShotWeapon.Triple_Power_Shot_3_C = [null, null, 7, 550, 25, 10, 270, 60, "#89F280", 0, 0];

ShotWeapon.inheritsFrom( Weapon );

function ShotWeapon(id, level, user, hasInstructions, usePowerShot, shotType, bigShotType) {
	Weapon.apply(this, arguments);

	this.usePowerShot = usePowerShot;

	this.voleyAmounts   = [3,3,3,4,4,4,4,4,5];

	this.shotTypes 		= [shotType,
						   bigShotType,
						   shotType,
						   shotType,
						   bigShotType,
						   shotType,
						   shotType,
						   bigShotType,
						   bigShotType];

	this.powerShotTypes = ["Single_Power_Shot_1",
						   "Single_Power_Shot_2",
						   "Single_Power_Shot_3",
						   "Double_Power_Shot_1",
						   "Double_Power_Shot_2",
						   "Double_Power_Shot_3",
						   "Triple_Power_Shot_1",
						   "Triple_Power_Shot_2",
						   "Triple_Power_Shot_3"];

	this.shotCharge = new ShotCharge(this.user, 0, -40, 210, 330, 60);
	this.shotCharge.off();
	
	this.shotLevels = [
		[ShotWeapon.Top_Shot],
		[ShotWeapon.Top_Shot],

		[ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],
		[ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],
		[ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],

		[ShotWeapon.Top_Shot, ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],
		[ShotWeapon.Top_Shot, ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],
		[ShotWeapon.Top_Shot, ShotWeapon.Right_Shot, ShotWeapon.Left_Shot],
		[ShotWeapon.Top_Shot, ShotWeapon.Right_Shot, ShotWeapon.Left_Shot]
	];

	this.powerShotLevels = [
		[ShotWeapon.Single_Power_Shot_1],
		[ShotWeapon.Single_Power_Shot_2],
		[ShotWeapon.Single_Power_Shot_3],

		[ShotWeapon.Double_Power_Shot_1_A, ShotWeapon.Double_Power_Shot_1_B],
		[ShotWeapon.Double_Power_Shot_2_A, ShotWeapon.Double_Power_Shot_2_B],
		[ShotWeapon.Double_Power_Shot_3_A, ShotWeapon.Double_Power_Shot_3_B],

		[ShotWeapon.Triple_Power_Shot_1_A, ShotWeapon.Triple_Power_Shot_1_B, ShotWeapon.Triple_Power_Shot_1_C],
		[ShotWeapon.Triple_Power_Shot_2_A, ShotWeapon.Triple_Power_Shot_2_B, ShotWeapon.Triple_Power_Shot_2_C],
		[ShotWeapon.Triple_Power_Shot_3_A, ShotWeapon.Triple_Power_Shot_3_B, ShotWeapon.Triple_Power_Shot_3_C]
	];

	this.idleTimer = TimeOutFactory.getTimeOut(500, 1, this, function(){
		this.shotCharge.on();
		this.chargeTimer.reset();
	});

	this.chargeTimer = TimeOutFactory.getTimeOut(2500, 1, this, function(){
		this.shotCharge.off();
		this.powerShotVoley = new PowerShotVoley(this.powerShotTypes[this.level], this.powerShotLevels[this.level], this.user, this.container);
	}); 
}

ShotWeapon.prototype.init = function(container) {
	this.parent.init(container);
	this.shotCharge.init(container);

	var inst = this;

	if(this.usePowerShot){		
		this.idleTimer.start();
	}

	c = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, function(){
		if(inst.powerShotVoley != null){
			inst.powerShotVoley.release();
		}else{
			if(inst.currentVoleyCount < inst.voleyAmounts[inst.level]){
				inst.currentVoleyCount++;				

				new ShotVoley(inst.shotTypes[inst.level], inst.shotLevels[inst.level], inst.user, inst.container, function(){
					inst.currentVoleyCount--;
				});	
			}
		}

		inst.shotCharge.off();
		inst.powerShotVoley = null;
		
		if(inst.usePowerShot){
			inst.idleTimer.reset();
			inst.chargeTimer.stop();
		}

		inst.user.executeCallbacks("firstShotDelegate", inst.user);
	});

	this.callbacks.push(c);
}

ShotWeapon.prototype.update = function() {
	if(this.shotCharge) this.shotCharge.update();
}

ShotWeapon.prototype.destroy = function() {
	if(this.powerShotVoley) this.powerShotVoley.release();
	if(this.shotCharge) this.shotCharge.destroy();
	if(this.callbacks) ArrowKeyHandler.removeCallbacks(this.callbacks);
	
	DestroyUtils.destroyAllProperties(this);
}

ShotWeapon.prototype.createInstructions = function() {
	$("#main #shotInstructions").remove();	

	var instructions = document.createElement("h2");
	instructions.id = "shotInstructions";
	instructions.innerHTML = "Stay IDLE to CHARGE SHOT -" + "- Weapon Level: " + this.level;
	$("#main").append(instructions);
}

function ShotVoley(type, shots, user, container, onComplete) {
	var shotCount = shots.length;

	var sin = Math.sin((user.rotation)*(Math.PI/180));
	var cos = Math.cos((user.rotation)*(Math.PI/180));
	var x, y;

	var decreaseShotCount = function() {
		shotCount--;
		if(shotCount <= 0){				
			onComplete();
		}
	}

	for(var i=0; i<shots.length; i++){		
		
		x = cos * (shots[i][2]) - sin * (shots[i][3]) + user.x;
		y = sin * (shots[i][2]) + cos * (shots[i][3]) + user.y;

		if(!ScreenUtils.isInScreenBoundsXY(x, y, 20, 20)){
			decreaseShotCount();
			continue;
		}

		shots[i][0] = user;
		shots[i][1] = container;

		var shot = container.add(type, shots[i]);

		shot.x = x;
		shot.y = y;

		shot.addOnDestroyCallback(this, function(obj){
			decreaseShotCount();
		});	
	}	
}

function PowerShotVoley(type, shots, user, container) {
	var shotCount = shots.length;

	this.shots = [];

	for(var i=0; i<shots.length; i++){		
		shots[i][0] = user;
		shots[i][1] = container;
		
		var shot = container.add(type, shots[i]);

		this.shots.push(shot);

		shot.addOnDestroyCallback(this, function(obj){
			if(this.shots) 
				this.shots.splice(this.shots.indexOf(obj), 1);
		});		
	}	
}

PowerShotVoley.prototype.release = function(){
	for(var i=0; i<this.shots.length; i++){
		if(this.shots[i] != null){
			this.shots[i].release();
		}
	}

	this.shots.length = 0;
	this.shots 		  = null;
}
