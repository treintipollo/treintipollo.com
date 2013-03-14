Boss_1.ROUND_EYE          = 0;
Boss_1.SNAKE_EYE          = 1;
Boss_1.INSECT_EYE         = 2;
Boss_1.ROUND_EYE_STRAIGHT = 3;
Boss_1.INSECT_EYE_ANGLED  = 4;
Boss_1.SNAKE_EYE_SNIPER   = 5;

Boss_1.RANDOM_MIX_UP_EYE_CYCLE = 0;
Boss_1.RANDOM_EYE_CYCLE 	   = 1;

Boss_1.SHAKE_MOTION          = 0;
Boss_1.AIM_MOTION            = 1;
Boss_1.IDLE_MOTION           = 2;
Boss_1.DEATH_1_MOTION        = 3;
Boss_1.DEATH_2_MOTION        = 4;
Boss_1.INIT_DEATH_MOTION     = 5;
Boss_1.TENTACLE_DESTROYED    = 6;
Boss_1.BIG_DAMAGED 			 = 7;
Boss_1.LIGHT_DAMAGED 	     = 8;
Boss_1.HELPER_INITIAL_MOTION = 9;

Boss_1.inheritsFrom( Attributes );

function Boss_1() {
	this.tentacleBlood = new ShotCharge(null, 0, 0, 0, 0, 0);
	this.explosionArea = new ExplosionsArea();
	this.bloodStream   = new BloodStream(this);
	this.whiteFlash    = new WhiteFlashContainer();

	this.blinkTimer   = TimeOutFactory.getTimeOut(0, 2, this, null); 
	this.trembleTimer = TimeOutFactory.getTimeOut(1, 70, this, null);
}

Boss_1.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

//size, eyeHeight       
Boss_1.Main_Body_Properties     = [50, 40];
Boss_1.Helper_1_Body_Properties = [25, 20];
Boss_1.Helper_2_Body_Properties = [25, 20];

//tentacleCount, tWidth, tHeight, tSegments, tDistance, tLenght, tRange, tFrequency, tAngleOffste, equalT, collide
Boss_1.Main_Tentacle_Properties     = [8, 20, 20, 20, -40, 10, 20, 0.2, 0  , false];
Boss_1.Helper_1_Tentacle_Properties = [4, 10, 10, 13, -20, 4 , 15, 0.4, 45 , true ];
Boss_1.Helper_2_Tentacle_Properties = [3, 10, 10, 15, -20, 4 , 12, 0.5, -35, true ];

Boss_1.Main_Ability_Properties     = [{eyeTypes:[Boss_1.SNAKE_EYE_SNIPER], 
									   deathMotion:Boss_1.DEATH_1_MOTION, 
									   cycleMode:Boss_1.RANDOM_EYE_CYCLE, 
									   blinkTime:2000,
									   generateTentacles:false}, 
									  
									  {eyeTypes:[Boss_1.ROUND_EYE,Boss_1.SNAKE_EYE],  
									   deathMotion:Boss_1.DEATH_1_MOTION, 
									   cycleMode:Boss_1.RANDOM_EYE_CYCLE, 
									   blinkTime:2000,
									   generateTentacles:true},

									  {eyeTypes:[Boss_1.ROUND_EYE,Boss_1.SNAKE_EYE,Boss_1.INSECT_EYE],  
									   deathMotion:Boss_1.DEATH_1_MOTION,
									   cycleMode:Boss_1.RANDOM_MIX_UP_EYE_CYCLE, 
									   blinkTime:1000,
									   generateTentacles:true}];

Boss_1.Helper_1_Ability_Properties = [{eyeTypes:[Boss_1.ROUND_EYE_STRAIGHT,Boss_1.INSECT_EYE_ANGLED], 
									   deathMotion:Boss_1.DEATH_2_MOTION,
									   cycleMode:Boss_1.RANDOM_EYE_CYCLE, 
									   blinkTime:2500,
									   generateTentacles:true}];

Boss_1.Helper_2_Ability_Properties = [{eyeTypes:[Boss_1.SNAKE_EYE_SNIPER],  
									   deathMotion:Boss_1.DEATH_2_MOTION,
									   cycleMode:Boss_1.RANDOM_EYE_CYCLE, 
									   blinkTime:2500,
									   generateTentacles:true}];

//chargeRadius, chargeColor, chargeParticleSize, burstColor1, burstColor2, burstParticleSize, burst1ParticlesInCycle, beam1ParticlesInCycle, beam2ParticlesInCycle, beam1ParticlesLife, beam2ParticlesLife, beamParticleSize
Boss_1.Main_Beam_Properties   = [120, "#FFFFFF", 7, "#FF0000", "#FFFF00", 4, 1, 6, 6, 30, 15, 5];
Boss_1.Helper_Beam_Properties = [60, "#FFFFFF", 4, "#11D3ED", "#E045F5", 2, 1, 5, 5, 20, 10, 5];

//size, pieces, shotTime, shotDelay, angleOffset
Boss_1.Straigh_Beam_Properties = [ [ 15, 22, 1500, 400     ], [ 11, 35, 1000, 400 ] ];
Boss_1.Twin_Beam_1_Properties  = [ [ 15, 22, 2500, 400, 15 ], [ 11, 35, 1000, 400 ] ];
Boss_1.Twin_Beam_2_Properties  = [ [ 15, 22, 2500, 400, -15], [ 11, 35, 1000, 400 ] ];

//helperAmount, helperRadius
Boss_1.Backup_Properties  	  = [ [ 3, 200 ], [ 3, 200 ] ];
//rightAngle, leftAngle
Boss_1.Angled_Beam_Properties = [ [ 65, 115 ], [ 65, 115 ] ];
//shotAmount, shotDelay, size, speed, shotType, shotAngleOffset, voleyAmount, voleyDealy
Boss_1.Sniper_Properties  	  = [ [ 3, 100, 20, 200, "Fireball", 5, 2, 700 ], [ 3, 150, 10, 120, "Fireball", 5, 1, 700 ] ];
//Parameters for the "blood" particle system that triggers when a tentacle is destroyed.
Boss_1.Tentacle_Blood_Properties = {radius:140, range:45, pInterval:1, pColor:"#FF0000", pSize:3, pType:"BurstParticle_Blood", pInCycle:1 };
			 		
Boss_1.prototype.init = function(x, y, target, bodyProperties, abilityProperties, tentacleProperties, beamProperties, index) {
	CircleCollider.prototype.init.call(this, bodyProperties[0]);

	this.parent.init.call(this);

	this.x          	  = x;
	this.y          	  = y;
	this.currentPos       = {x:x, y:y};
	this.anchorPos        = {x:x, y:y};
	this.distanceToAnchor = {distance:0, angle:0};
	this.totalVariation   = {x:0, y:0};
	this.index 			  = index != null ? index : 0;
	this.size         	  = bodyProperties[0];
	this.eyeHeight    	  = bodyProperties[1];
	this.eyeheightMax 	  = bodyProperties[1];

	this.tentacleProperties = tentacleProperties;
	this.tentacles 		    = [];
	this.tentaclePositions  = [];

	this.counter      = 0;
	this.shakeCounter = 0;
	this.blinkCount   = 0;
	
	this.currentStats = {};
	
	this.currentStats.init = function(scope, allAbilities){
		this.scope = scope;
		this.allAbilities = allAbilities; 
		this.eyeType      = allAbilities[scope.currentLevel].eyeTypes[0];
	}
	
	this.currentStats.getRandomEye = function(){ 
		return this.allAbilities[this.scope.currentLevel].eyeTypes[Random.getRandomInt(0, this.allAbilities[this.scope.currentLevel].eyeTypes.length-1)]; 
	}

	this.currentStats.get = function(){ return this.allAbilities[this.scope.currentLevel]; }
	this.currentStats.abilityCount = function(){ return this.allAbilities[this.scope.currentLevel].eyeTypes.length; }

	this.currentStats.init(this, abilityProperties);
	
	//Eye cycling modes
	var eyeCycleModes = [];
	eyeCycleModes[Boss_1.RANDOM_MIX_UP_EYE_CYCLE] = FuntionUtils.bindScope(this, function(){
		return this.currentStats.getRandomEye();
	});

	eyeCycleModes[Boss_1.RANDOM_EYE_CYCLE] = FuntionUtils.bindScope(this, function(){
		var nextEye = this.currentStats.eyeType;

		if(this.blinkCount % 2 != 0){
			nextEye = this.currentStats.getRandomEye();
		}

		return nextEye;
	});

	var shake = FuntionUtils.bindScope(this, function(){
		if(this.shakeCounter % 2 == 0){
			var sX = Random.getRandomArbitary(-5.0, 5.0);
			var sY = Random.getRandomArbitary(-5.0, 5.0);

			this.totalVariation.x += sX;
			this.totalVariation.y += sY;

			this.lastVarX = sX;
			this.lastVarY = sY;
		}else{
			this.totalVariation.x -= this.lastVarX;
			this.totalVariation.y -= this.lastVarY;
		}
		this.shakeCounter++;
	});
	
	var aim = FuntionUtils.bindScope(this, function(){
		this.shakeCounter = 0;
	});

	var idle = FuntionUtils.bindScope(this, function(){
		this.counter++;
		this.totalVariation.x += Math.cos((this.counter*2) / (this.eyeheightMax*2));
		this.totalVariation.y += Math.cos((this.counter*2) / (this.eyeheightMax));
	});

	var death_init = FuntionUtils.bindScope(this, function(){  
		this.stopAttack();

		weapons[Boss_1.INSECT_EYE].destroyAll();

		this.blockDamage = true;

		this.executeOnAllTentacles(function(t){
			t.blockDamage = true;
		});

		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax+(this.eyeheightMax/2), ease:Power4.easeOut, onCompleteScope:this, onComplete:function(){
			this.currentMotion.set(this.currentStats.get().deathMotion);
		}});
	});

	var death_explosions_blood = FuntionUtils.bindScope(this, function(){  
		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax/2, ease:Power4.easeOut});

		var sideChanges = 10;
	
		var explode = function(){
			this.explosionArea.init(this, 60, 25, 10, 60, FuntionUtils.bindScope(this, function(){
				var length, newX, newY, info;

				do{
					newX = this.anchorPos.x + Random.getRandomInt(-70, 70);
					newY = this.anchorPos.y + Random.getRandomInt(-70, 70);
					info = VectorUtils.getFullVectorInfo(this.x, this.y, newX, newY);
				}while(info.distance < 100);
				
				sideChanges--;

				var a = info.angle * (180/Math.PI);			
				
				if(sideChanges > 0){
					this.gotoPosition(newX, newY, 0.7, null, Circ.easeOut);	
					explode.call(this);	
				}else{
					this.gotoPosition(newX, newY, 0.7, FuntionUtils.bindScope(this, function(){
						this.explosionArea.init(this, 60, 40, 10, 60);
						
						this.bloodStream.on(0, 360);
						this.whiteFlash.on(FuntionUtils.bindScope(this, function(){ this.alive = false; }), null, this);
					}), Circ.easeOut);
				}

				this.bloodStream.on(a+10, a-10);
			}));	
		}

		explode.call(this);
	});

	var death_explosions_retreate = FuntionUtils.bindScope(this, function(){
		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax/2, ease:Power4.easeOut});

		this.explosionArea.init(this, 30, 15, -1, 50);
		this.gotoPosition(this.x, this.y-500, 5, FuntionUtils.bindScope(this, function(){
			this.alive = false;
		}));	
	});

	var tentacleDamage = FuntionUtils.bindScope(this, function(tentacle){  
		shrinkTentacles();

		this.stopAttack();	
	
		var moveVector = VectorUtils.getFullVectorInfo(tentacle.x, tentacle.y, this.x, this.y);

		this.tentacleBlood.parent = tentacle;
		this.tentacleBlood.initFromObject(Boss_1.Tentacle_Blood_Properties, this);
		this.tentacleBlood.on();
		
		TweenMax.to(this, 0.2, {eyeHeight:this.eyeheightMax/2, ease:Back.easeOut});

		this.gotoPosition(this.currentPos.x + (moveVector.dir.x * 70), this.currentPos.y + (moveVector.dir.y * 70), 1, function(){	
			this.gotoAnchor(4);
			this.startAttack();
			this.currentMotion.set(Boss_1.IDLE_MOTION);
			
			TweenMax.to(this, 2, {eyeHeight:this.eyeheightMax, ease:Back.easeInOut});

			this.tentacleBlood.off();

		}, Power4.easeOut);	
	});

	var damage = FuntionUtils.bindScope(this, function(hitter, onComplete){
		shrinkTentacles();

		this.stopAttack();
		
		var moveVector = VectorUtils.getFullVectorInfo(hitter.x, hitter.y, this.x, this.y);

		TweenMax.to(this, 1, {rotation:Random.getRandomArbitary(-360, 360), ease:Power4.easeOut});
		TweenMax.to(this, 0.2, {eyeHeight:this.eyeheightMax/2, ease:Back.easeOut});

		this.gotoPosition(this.currentPos.x + (moveVector.dir.x * 70), this.currentPos.y + (moveVector.dir.y * 70), 1, function(){	
			this.gotoAnchor(4);
			this.startAttack();
			this.currentMotion.set(Boss_1.IDLE_MOTION);

			TweenMax.to(this, 0.5, {rotation:0, ease:Back.easeOut});
			TweenMax.to(this, 2, {eyeHeight:this.eyeheightMax, ease:Back.easeInOut});

			this.generateTentacles();

			onComplete();

		}, Power4.easeOut);	
	});

	var shrinkTentacles = FuntionUtils.bindScope(this, function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght()/2, 0.3);
			t.frequencyTo(t.getInitFrequency()*3, 0.1);		
		});
	});

	var shrinkTentacles_2 = FuntionUtils.bindScope(this, function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght(), 0.3);	
			t.frequencyTo(t.getInitFrequency()*3, 0.1);
			t.RangeTo(80, 0.1);
		});
	});

	var growTentacles = FuntionUtils.bindScope(this, function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght(), 3);
			t.frequencyTo(t.getInitFrequency(), 1.0);
		});

		this.startAttack();
	});
	
	var helperInitialMotion = FuntionUtils.bindScope(this, function(x, y){
		this.blockDamage = true;
		this.scaleX = 0.5;
		this.scaleY = 0.5;

		this.gotoPosition(x, y, 4, function(){
			TweenMax.to(this, 1, {scaleX:1, scaleY:1, ease:Back.easeOut.config(3), onCompleteScope:this, onComplete:function(){
				this.blockDamage = false;
				this.generateTentacles(true);
				this.startAttack();
			}});
		}, Linear.ease, true);
	});

	var tremble = FuntionUtils.bindScope(this, function(x, y){
		this.trembleTimer.start();
	});

	this.trembleTimer.callback = function(){
		this.scaleX = Random.getRandomArbitary(1, 1.05);
		this.scaleY = Random.getRandomArbitary(1, 1.05);
	};

	this.trembleTimer.onComplete = function() {
		this.scaleX = 1;
		this.scaleY = 1;
	}

	//Motion state machine
	this.currentMotion = {currentMotionId:Boss_1.IDLE_MOTION, lastMotionId:Boss_1.IDLE_MOTION, motions:[]};

	this.currentMotion.init = function(){
		this.motions[Boss_1.SHAKE_MOTION]          = {update:shake, init:shrinkTentacles};
		this.motions[Boss_1.AIM_MOTION]            = {update:aim,   init:null};
		this.motions[Boss_1.IDLE_MOTION]           = {update:idle,  init:growTentacles};
		this.motions[Boss_1.DEATH_1_MOTION]        = {update:shake, init:function(){ death_explosions_blood(); shrinkTentacles_2(); } };
		this.motions[Boss_1.DEATH_2_MOTION]        = {update:shake, init:function(){ death_explosions_retreate(); shrinkTentacles_2(); } };
		this.motions[Boss_1.INIT_DEATH_MOTION]     = {update:aim,   init:death_init};
		this.motions[Boss_1.TENTACLE_DESTROYED]    = {update:shake, init:tentacleDamage};
		this.motions[Boss_1.BIG_DAMAGED] 		   = {update:shake, init:damage};		
		this.motions[Boss_1.LIGHT_DAMAGED] 		   = {update:null,  init:tremble};
		this.motions[Boss_1.HELPER_INITIAL_MOTION] = {update:idle,  init:helperInitialMotion};
	}

	this.currentMotion.set = function(motionId, args){
		if(this.motions[this.currentMotionId].update){
			this.lastMotionId = this.currentMotionId;
		}

		this.currentMotionId = motionId;

		if(this.motions[this.currentMotionId].init != null){
			this.motions[this.currentMotionId].init.apply(this, args);
		}
	}

	this.currentMotion.update = function(){
		if(this.motions[this.currentMotionId].update){
			this.motions[this.currentMotionId].update();
		}else{
			this.motions[this.lastMotionId].update();
		}
	}	

	this.currentMotion.init();
		
	//Attack State machine
	var cycleEyes = FuntionUtils.bindScope(this, function(){
		if(this.currentStats.abilityCount() != 1){
			
			do{
				this.currentStats.eyeType = eyeCycleModes[this.currentStats.get().cycleMode]();
				this.weapon = weapons[this.currentStats.eyeType];
			}while(!this.weapon.available());

		}else{
			this.currentStats.eyeType = eyeCycleModes[this.currentStats.get().cycleMode]();
			this.weapon = weapons[this.currentStats.eyeType];
		}
	});

	var activateAttack = FuntionUtils.bindScope(this, function(){

		if(this.blinkCount % 2 == 0){		
			this.weapon.fire();
		
			if(this.weapon.needsAiming()){
				this.currentMotion.set(Boss_1.AIM_MOTION);	
			}
		}else{
			this.weapon.charge();
		}
	});

	var stopCharging = FuntionUtils.bindScope(this, function(){
		this.blinkCount++;
		this.weapon.disable();
	});

	this.blinkTimer.delay 	 = this.currentStats.get().blinkTime;
	this.blinkTimer.callback = function(){ 
		this.blinkingTween = TweenMax.fromTo(this, 0.2, 
											{eyeHeight:this.eyeheightMax, yoyo:true, repeat:1}, 
											{eyeHeight:0, yoyo:true, repeat:1, onRepeat:cycleEyes, onComplete:activateAttack, onStart:stopCharging});
	}

	var gotoShake     = FuntionUtils.bindScope(this, function(){ this.currentMotion.set(Boss_1.SHAKE_MOTION); });
	var gotoIdle      = FuntionUtils.bindScope(this, function(){ this.currentMotion.set(Boss_1.IDLE_MOTION); });
	var restartAttack = FuntionUtils.bindScope(this, function(){ this.startAttack(); });

	var weapons = [];
	//Main weapons
	weapons[Boss_1.ROUND_EYE]  = new Boss_1_Weapon_Beam(this, target, gotoShake, gotoIdle, beamProperties);
	weapons[Boss_1.SNAKE_EYE]  = new Boss_1_Weapon_Twin_Beam(this, target, gotoShake, gotoIdle, beamProperties);
	weapons[Boss_1.INSECT_EYE] = new Boss_1_Backup(this, target, restartAttack, Boss_1.Backup_Properties[this.index], beamProperties);
	//Helper weapons
	weapons[Boss_1.ROUND_EYE_STRAIGHT] = new Boss_1_Weapon_Straight_Beam(this, gotoShake, gotoIdle, beamProperties);
	weapons[Boss_1.INSECT_EYE_ANGLED]  = new Boss_1_Weapon_Angled_Beam(this, gotoShake, gotoIdle, Boss_1.Angled_Beam_Properties[this.index], beamProperties);
	weapons[Boss_1.SNAKE_EYE_SNIPER]   = new Boss_1_Weapon_Sniper_Shot(this, target, restartAttack, Boss_1.Sniper_Properties[this.index], beamProperties);

	this.weapon = weapons[0];

	//Eye drawing logic
	var roundEye = FuntionUtils.bindScope(this, function(context){
		this.drawRoundEye(context);
	});
	var snakeEye = FuntionUtils.bindScope(this, function(context){
		this.drawSnakeEye(context);
	});
	var insectEye = FuntionUtils.bindScope(this, function(context){
		this.drawBugEyeCluster( 21, 0, 7, "#FFFFFF", context, true, true , true , true, false, false);
		this.drawBugEyeCluster(-21, 0, 7, "#FFFFFF", context, true, false, false, true, true , true );
		this.drawBugEyeCluster(  0, 0, 7, "#FFFFFF", context, true, true , true , true, true , true );
	});

	this.eyeDrawLogic = [];
	this.eyeDrawLogic[Boss_1.ROUND_EYE] 		 = roundEye;
	this.eyeDrawLogic[Boss_1.SNAKE_EYE] 		 = snakeEye;
	this.eyeDrawLogic[Boss_1.INSECT_EYE] 		 = insectEye;
	this.eyeDrawLogic[Boss_1.ROUND_EYE_STRAIGHT] = roundEye;
	this.eyeDrawLogic[Boss_1.INSECT_EYE_ANGLED]  = insectEye;
	this.eyeDrawLogic[Boss_1.SNAKE_EYE_SNIPER]   = snakeEye;

	this.generateTentacles();
}

Boss_1.prototype.gotoPosition = function(x, y, time, onFinish, ease, setAsAnchor){
	if(setAsAnchor){
		this.anchorPos = {x:x, y:y};
	}

	TweenMax.killTweensOf(this.distanceToAnchor);
	
	this.currentPos.x += Math.cos(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;
	this.currentPos.y += Math.sin(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;
	this.distanceToAnchor.distance = 0;

	TweenMax.to(this.currentPos, time, {x:x, y:y, ease:(ease != null ? ease : Linear.ease), onComplete:onFinish, onCompleteScope:this, overwrite:"none"});
}

Boss_1.prototype.gotoAnchor = function(time){
	var info = VectorUtils.getFullVectorInfo(this.anchorPos.x, this.anchorPos.y, this.currentPos.x, this.currentPos.y);
	this.distanceToAnchor.angle = info.angle;
	
	TweenMax.to(this.distanceToAnchor, time, {distance:info.distance, onComplete:function(){	
		this.currentPos.x += Math.cos(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;
		this.currentPos.y += Math.sin(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;	
		this.distanceToAnchor.distance = 0;
	}, onCompleteScope:this});
}

Boss_1.prototype.startAttack = function(){
	this.blinkCount = 0;
	this.blinkTimer.delay = this.currentStats.get().blinkTime;
	this.blinkTimer.start();
}

Boss_1.prototype.stopAttack = function(force){
	force ? this.weapon.forceDisable() : this.weapon.disable();
	this.blinkTimer.stop();
	
	if(this.blinkingTween)
		this.blinkingTween.kill();
}

Boss_1.prototype.generateTentacles = function(override){
	if((!this.currentStats.get().generateTentacles || this.index != 0) && !override){
		return;
	}

	this.tentacleCount = this.tentacleProperties[0]

	var tWidth       = this.tentacleProperties[1];
	var tHeight      = this.tentacleProperties[2];
	var tSegments    = this.tentacleProperties[3];
	var tDistance    = this.tentacleProperties[4];
	var tLenght      = this.tentacleProperties[5];
	var tRange       = this.tentacleProperties[6];
	var tFrequency   = this.tentacleProperties[7];
	var tAngleOffste = this.tentacleProperties[8];
	var equalT       = this.tentacleProperties[9];
	
	var tAngleStep = 360 / this.tentacleCount;

	if(this.tentacles.length != this.tentacleCount){
		for(var i=0; i<this.tentacleCount; i++){
			this.tentacles.push(null);
			this.tentaclePositions.push({x:0, y:0, offSetX:0, offSetY:0});
		}
	}

	for(var i=0; i<this.tentacleCount; i++){
		if(this.tentacles[i] != null){
			continue;
		}

		var t;

		if(i % 2 == 0){
			t = TopLevel.container.add("Tentacle", [{x:0, y:0}, tWidth, tHeight, tSegments, tAngleStep*i + tAngleOffste, true, this.index]);
			setTentacleVariables(t, tDistance, tAngleStep*i + tAngleOffste, tLenght, tRange, tFrequency);
		}else{
			t = TopLevel.container.add("Tentacle", [{x:0, y:0}, tWidth, tHeight, tSegments, tAngleStep*i + tAngleOffste, false, this.index]);
			setTentacleVariables(t, tDistance, tAngleStep*i + tAngleOffste, tLenght-2, tRange/2, tFrequency+0.1);
		}

		if(equalT){
			setTentacleVariables(t, tDistance, tAngleStep*i + tAngleOffste, tLenght, tRange, tFrequency);
		}

		this.tentaclePositions[i].offSetX = t.offSetX;
		this.tentaclePositions[i].offSetY = t.offSetY;

		this.tentacles[i] = t;		
		
		t.addOnDestroyCallback(this, function(go){
			var index = this.tentacles.indexOf(go);
			this.tentacles[index] = null;

			this.currentMotion.set(Boss_1.TENTACLE_DESTROYED, [this.tentaclePositions[index]]);
		});
	}
	
	this.executeOnAllTentacles(FuntionUtils.bindScope(this, function(t){
		t.updateAttributesTo(this.currentLevel);
	}));

	function setTentacleVariables(tentacle, distance, angle, length, range, frequency) {
		tentacle.offSetX = Math.cos(angle * (Math.PI/180)) * distance;
		tentacle.offSetY = Math.sin(angle * (Math.PI/180)) * distance;

		tentacle.setInitLenght(length); 
		tentacle.setInitRange(range);
		tentacle.setInitFrequency(frequency); 

		tentacle.setLengh(length);
		tentacle.setRange(range);
		tentacle.setFrequency(frequency);
	}
}

Boss_1.prototype.executeOnAllTentacles = function(f) {
	for(var i=0; i<this.tentacleCount; i++){
		var t = this.tentacles[i];
		if(t != null){ f(t, i); }
	}
}

Boss_1.prototype.draw = function(context) {
	context.fillStyle   = "#000000";
	context.strokeStyle = "#FFFFFF";
	context.lineWidth   = 2;

	context.beginPath();
	context.arc(0, 0, this.size, 0, Math.PI*2, false);	
	context.closePath();
	context.fill();
	context.stroke();

	context.beginPath();
	context.moveTo(-this.size, 0);	
	context.quadraticCurveTo(0, -this.eyeHeight, this.size, 0);
	context.moveTo(-this.size, 0);
	context.quadraticCurveTo(0, this.eyeHeight, this.size, 0);
	context.stroke();
	context.fill();

	context.clip();

	this.eyeDrawLogic[this.currentStats.eyeType](context);
}

Boss_1.prototype.drawRoundEye = function(context) {
	context.fillStyle = "#000000";
	context.beginPath();
	context.arc(0, 0, this.eyeheightMax/2, 0, Math.PI*2, false);
	context.moveTo(this.eyeheightMax/8, 0);
	context.arc(0, 0, this.eyeheightMax/8, 0, Math.PI*2, false);	
	context.closePath();
	context.stroke();
}

Boss_1.prototype.drawSnakeEye = function(context) {
	context.fillStyle = "#000000";
	context.beginPath();
	context.moveTo(0, -this.eyeheightMax/2);	
	context.quadraticCurveTo(-this.eyeheightMax/4,0,0,this.eyeheightMax/2);
	context.moveTo(0, -this.eyeheightMax/2);
	context.quadraticCurveTo(this.eyeheightMax/4,0,0,this.eyeheightMax/2);
	context.stroke();
}

Boss_1.prototype.drawBugEyeCluster = function(x, y, radius, color, context, top, topRight, bottomRight, bottom, bottomLeft, topLeft) {
	context.lineWidth = 1;

	this.drawBugEyePiece(x, y, radius, color, context);
	
	var xOffset = (radius * 2) - 4;
	var yOffset = (radius * 2) - 2;

	//top
	if(top) this.drawBugEyePiece(x, -yOffset, radius, color, context);
	//topRight
	if(topRight) this.drawBugEyePiece(x + xOffset, y + -yOffset/2, radius, color, context);
	//bottomRight
	if(bottomRight) this.drawBugEyePiece(x + xOffset, y + yOffset/2, radius, color, context);
	//bottom
	if(bottom) this.drawBugEyePiece(x, y + yOffset, radius, color, context);
	//bottomLeft
	if(bottomLeft) this.drawBugEyePiece(x + -xOffset, y + yOffset/2, radius, color, context);
	//topLeft
	if(topLeft) this.drawBugEyePiece(x + -xOffset, y + -yOffset/2, radius, color, context);
}

Boss_1.prototype.drawBugEyePiece = function(x, y, radius, color, context) {
	var angleStep = 360/6 * (Math.PI/180);
	var angle = 0;

	context.fillStyle = "#000000";
	context.strokeStyle = color;

	context.beginPath();
		
	context.moveTo(x + Math.cos(angle)*radius, y + Math.sin(angle)*radius);

	for(var i=0; i<6; i++){
		angle += angleStep;
		context.lineTo(x + Math.cos(angle)*radius, y + Math.sin(angle)*radius);
	}

	context.closePath();
	context.stroke();
}

Boss_1.prototype.update = function(delta) {
	this.currentMotion.update();

	this.x = this.currentPos.x + this.totalVariation.x + Math.cos(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;
	this.y = this.currentPos.y + this.totalVariation.y + Math.sin(this.distanceToAnchor.angle) * this.distanceToAnchor.distance;

	this.executeOnAllTentacles(FuntionUtils.bindScope(this, function(t){
		t.x = t.offSetX + this.x;
		t.y = t.offSetY + this.y;
	}));

	for(var i=0; i<this.tentaclePositions.length; i++){
		this.tentaclePositions[i].x = this.tentaclePositions[i].offSetX + this.x;
		this.tentaclePositions[i].y = this.tentaclePositions[i].offSetY + this.y;
	}

	this.weapon.update();
}

Boss_1.prototype.destroy = function(){
	this.stopAttack();
	this.bloodStream.off();
	this.explosionArea.stop();
	this.trembleTimer.stop();

	TweenMax.killTweensOf(this);
	TweenMax.killTweensOf(this.distanceToAnchor);
	TweenMax.killTweensOf(this.currentPos);

	this.executeOnAllTentacles(function(t){
		t.destroyWithOutCallBacks();
	});
}

Boss_1.prototype.onHPDiminished = function(other) { this.currentMotion.set(Boss_1.LIGHT_DAMAGED); }
Boss_1.prototype.onDamageBlocked = function(other) { this.currentMotion.set(Boss_1.LIGHT_DAMAGED); }

Boss_1.prototype.onDamageReceived = function(other) {
	this.blockDamage = true;
	this.currentMotion.set(Boss_1.BIG_DAMAGED, [other, FuntionUtils.bindScope(this, function(){ this.blockDamage = false; })]);
}

Boss_1.prototype.onAllDamageReceived = function(other) { 
	this.currentMotion.set(Boss_1.INIT_DEATH_MOTION); 
}

function Boss_1_Weapon() {}

Boss_1_Weapon.prototype.update = function() {}
Boss_1_Weapon.prototype.fire = function() {}
Boss_1_Weapon.prototype.charge = function() {}
Boss_1_Weapon.prototype.disable = function() {}
Boss_1_Weapon.prototype.forceDisable = function() {}
Boss_1_Weapon.prototype.needsAiming = function() {}
Boss_1_Weapon.prototype.available = function() {}

function Boss_1_Weapon_Beam(user, target, onStart, onComplete, beamProperties) {
	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, target, Boss_1.Straigh_Beam_Properties[user.index]);

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;
}

Boss_1_Weapon_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Beam.prototype.update = function() { }
Boss_1_Weapon_Beam.prototype.fire = function() { this.beam.fire(); }
Boss_1_Weapon_Beam.prototype.charge = function() { this.beam.charge(); }
Boss_1_Weapon_Beam.prototype.disable = function() { this.beam.disable(); }
Boss_1_Weapon_Beam.prototype.forceDisable = function() { this.beam.forceDisable(); }
Boss_1_Weapon_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Beam.prototype.available = function() { return true; };

function Boss_1_Weapon_Twin_Beam(user, target, onStart, onComplete, beamProperties) {
	this.beam1 = new StraightBeam(beamProperties);
	this.beam1.init(TopLevel.container, user, target, Boss_1.Twin_Beam_1_Properties[user.index]);

	this.beam2 = new StraightBeam(beamProperties);
	this.beam2.init(TopLevel.container, user, target, Boss_1.Twin_Beam_2_Properties[user.index]);

	this.beam1.onStart    = onStart;
	this.beam1.onComplete = onComplete;
}

Boss_1_Weapon_Twin_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Twin_Beam.prototype.update = function() { }
Boss_1_Weapon_Twin_Beam.prototype.fire = function() { this.beam1.fire(); this.beam2.fire(); }
Boss_1_Weapon_Twin_Beam.prototype.charge = function() { this.beam1.charge(); }
Boss_1_Weapon_Twin_Beam.prototype.disable = function() { this.beam1.disable(); this.beam2.disable();}
Boss_1_Weapon_Twin_Beam.prototype.forceDisable = function() { this.beam1.forceDisable(); this.beam2.forceDisable(); }
Boss_1_Weapon_Twin_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Twin_Beam.prototype.available = function() { return true; };

function Boss_1_Backup(user, target, onComplete, properties, beamProperties) {
	this.target  		= target;
	this.user    		= user;
	this.onComplete     = onComplete;
	
	this.amount  		= properties[0];
	this.helperDistance = properties[1];

	this.helpers    = [];
	this.nextHelper = 0;

	this.positions = {
		p1:{angle:270 * (Math.PI/180), active:false, n:"Boss_1_Helper_2", b:Boss_1.Helper_2_Body_Properties, a:Boss_1.Helper_2_Ability_Properties, t:Boss_1.Helper_2_Tentacle_Properties},
		p2:{angle:220 * (Math.PI/180), active:false, n:"Boss_1_Helper_1", b:Boss_1.Helper_1_Body_Properties, a:Boss_1.Helper_1_Ability_Properties, t:Boss_1.Helper_1_Tentacle_Properties},
		p3:{angle:320 * (Math.PI/180), active:false, n:"Boss_1_Helper_1", b:Boss_1.Helper_1_Body_Properties, a:Boss_1.Helper_1_Ability_Properties, t:Boss_1.Helper_1_Tentacle_Properties}
	};

	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, target, Boss_1.Straigh_Beam_Properties[user.index]);
}

Boss_1_Backup.inheritsFrom( Boss_1_Weapon );

Boss_1_Backup.prototype.update = function() { }
Boss_1_Backup.prototype.fire = function() {  
	if(this.helpers.length >= this.amount){ return; }

	var p;

	for (var pos in this.positions){
		p = this.positions[pos];

		if(!p.active){ 
			p.active = true;
			break; 
		}
	}

	var h = TopLevel.container.add(p.n, [this.user.x, this.user.y, this.target, p.b, p.a, p.t, Boss_1.Helper_Beam_Properties, this.user.index+1]);

	h.addOnDestroyCallback(this, function(go){
		for(var j=0; j<this.helpers.length; j++){
			var helper   = this.helpers[j].helper;
			var position = this.helpers[j].pos;

			if(helper === go){
				var index = this.helpers.indexOf(this.helpers[j]);
				this.helpers.splice(index, 1);
				position.active = false;
				break;
			}
		}
	});

	var x = this.user.anchorPos.x + Math.cos(p.angle) * this.helperDistance;
	var y = this.user.anchorPos.y + Math.sin(p.angle) * this.helperDistance;
	h.currentMotion.set(Boss_1.HELPER_INITIAL_MOTION, [x, y]);

	this.helpers.push( {pos:p, helper:h} );

	this.onComplete();
}

Boss_1_Backup.prototype.destroyAll = function() {
	for(var j=0; j<this.helpers.length; j++){
		TweenMax.killTweensOf(this.helpers[j].helper);
		TweenMax.killTweensOf(this.helpers[j].helper.distanceToAnchor);
		TweenMax.killTweensOf(this.helpers[j].helper.currentPos);

		this.helpers[j].helper.currentMotion.set(Boss_1.INIT_DEATH_MOTION);
	}
}

Boss_1_Backup.prototype.charge = function() { this.beam.charge(); }
Boss_1_Backup.prototype.disable = function() { this.beam.disable(); }
Boss_1_Backup.prototype.forceDisable = function() { this.beam.forceDisable(); }
Boss_1_Backup.prototype.needsAiming = function() { return false; }
Boss_1_Backup.prototype.available = function() { return this.helpers.length < this.amount; };

function Boss_1_Weapon_Straight_Beam(user, onStart, onComplete, beamProperties) {
	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, null, Boss_1.Straigh_Beam_Properties[user.index]);

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;
	
	this.user = user;
	this.sightGameObject = null;
	this.sightEnd = {x:0, y:0};
}

Boss_1_Weapon_Straight_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Straight_Beam.prototype.update = function() { 
	this.sightEnd.x = this.user.x;
	this.sightEnd.y = this.user.y + 800; 
}
Boss_1_Weapon_Straight_Beam.prototype.fire = function() { 
	this.beam.fire(90); 
	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}
}
Boss_1_Weapon_Straight_Beam.prototype.charge = function() { 
	this.beam.charge(); 
	if(this.sightGameObject == null){
		this.sightGameObject = TopLevel.container.add("Line", [this.user, this.sightEnd, "#FF0000", 2]);
	}
}
Boss_1_Weapon_Straight_Beam.prototype.disable = function() { 
	this.beam.disable();
	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}
}
Boss_1_Weapon_Straight_Beam.prototype.forceDisable = function() { 
	this.beam.forceDisable(); 
	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}
}
Boss_1_Weapon_Straight_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Straight_Beam.prototype.available = function() { return true; };

function Boss_1_Weapon_Angled_Beam(user, onStart, onComplete, properties, beamProperties) {
	this.user = user;
	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, null, Boss_1.Straigh_Beam_Properties[user.index]);

	this.rightAngle = properties[0];
	this.leftAngle = properties[1];

	this.sightGameObject = null;
	this.sightEnd = {x:0, y:0};

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;
}

Boss_1_Weapon_Angled_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Angled_Beam.prototype.update = function() { 	
	var x, y;

	if(this.user.x < TopLevel.canvas.width/2){
		x = this.user.x + Math.cos(this.rightAngle * (Math.PI/180)) * 800;
		y = this.user.y + Math.sin(this.rightAngle * (Math.PI/180)) * 800;
	}else{
		x = this.user.x + Math.cos(this.leftAngle * (Math.PI/180)) * 800;
		y = this.user.y + Math.sin(this.leftAngle * (Math.PI/180)) * 800;
	}

	this.sightEnd.x = x;
	this.sightEnd.y = y;
}
Boss_1_Weapon_Angled_Beam.prototype.fire = function() { 
	if(this.user.x < TopLevel.canvas.width/2){
		this.beam.fire(this.rightAngle);
	}else{
		this.beam.fire(this.leftAngle);
	}

	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}

	return true;
}

Boss_1_Weapon_Angled_Beam.prototype.charge = function() { 
	this.beam.charge(); 

	if(this.sightGameObject == null){
		this.sightGameObject = TopLevel.container.add("Line", [this.user, this.sightEnd, "#FF0000", 2], 0);
	}
}
Boss_1_Weapon_Angled_Beam.prototype.disable = function() { 
	this.beam.disable(); 
	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}
}
Boss_1_Weapon_Angled_Beam.prototype.forceDisable = function() { 
	this.beam.forceDisable();
	if(this.sightGameObject){ 
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}	
}
Boss_1_Weapon_Angled_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Angled_Beam.prototype.available = function() { return true; }

function Boss_1_Weapon_Sniper_Shot(user, target, onComplete, properties, beamProperties) {
	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, null, Boss_1.Straigh_Beam_Properties[user.index]);

	this.shotAmount      = properties[0];
	this.shotDelay       = properties[1];
	this.shotSize        = properties[2];
	this.shotSpeed       = properties[3];
	this.shotType        = properties[4];
	this.shotAngleOffset = properties[5];

	this.voleyAmount = properties[6];
	this.voleyDelay  = properties[7];

	this.angleOffSets = [0, this.shotAngleOffset, -this.shotAngleOffset];
	this.currentShot;

	this.voleyTimer = TimeOutFactory.getTimeOut(this.voleyDelay, 1, this, function(){
		if(this.voleyAmount > 0){
			this.voleyAmount--;
			this.currentShot = 0;
			this.shotTimer.start();
		}else{
			this.voleyAmount = properties[6];
			onComplete();
		}
	});

	this.shotTimer = TimeOutFactory.getTimeOut(this.shotDelay, this.shotAmount, this, function(){ 
		TopLevel.container.add(this.shotType, [user, target, this.shotSize, this.shotSpeed, this.angleOffSets[this.currentShot]]);

		if(this.currentShot < this.angleOffSets.length-1){
			this.currentShot++;
		}else{
			this.currentShot = 0;
		}
	}); 

	this.shotTimer.onComplete = FuntionUtils.bindScope(this, function(){
		this.voleyTimer.start();
	});
}

Boss_1_Weapon_Sniper_Shot.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Sniper_Shot.prototype.update = function() { }
Boss_1_Weapon_Sniper_Shot.prototype.fire = function() { this.voleyTimer.start(); return true; }
Boss_1_Weapon_Sniper_Shot.prototype.charge = function() { this.beam.charge(); }
Boss_1_Weapon_Sniper_Shot.prototype.disable = function() { this.beam.disable(); this.shotTimer.stop(); this.voleyTimer.stop(); }
Boss_1_Weapon_Sniper_Shot.prototype.forceDisable = function() { this.beam.forceDisable(); this.shotTimer.stop(); this.voleyTimer.stop(); }
Boss_1_Weapon_Sniper_Shot.prototype.needsAiming = function() { return false; }
Boss_1_Weapon_Sniper_Shot.prototype.available = function() { return true; }

function Tentacle() {       
    this.girth = 15;
    this.muscleRange = 50;
    this.muscleFreq = 0.2 * 100/250; 
    this.theta = 0;

    this.initLenght = this.girth;
    this.initRange = this.muscleRange;
    this.initFrequency = this.muscleFreq;

    this.minLength;

    this.thethaMuscle = 0;
    this.count 	= 0;
    this.segments = [];

	this.doRotation = false;
	this.lastRotation = 0;

	this.sin;
	this.cos;
}
Tentacle.inheritsFrom( Attributes );

Tentacle.prototype.init = function(anchor, initWidth, initHeight, segmentCount, initAngle, swingSide, userIndex) {
	this.parent.init.call(this);

	this.segmentCount = segmentCount;
	this.anchor 	  = anchor;
	this.initWidth 	  = initWidth;
	this.initHeight   = initHeight;	
	this.rotation     = initAngle;
	this.lastRotation = initAngle;
	this.swingSide    = swingSide;

	this.sin = Math.sin((this.rotation)*(Math.PI/180));
	this.cos = Math.cos((this.rotation)*(Math.PI/180));

	var segmentType	= userIndex != 0 ? "TentacleSegment_Show" : "TentacleSegment_Collide";

	var head   = TopLevel.container.add("TentacleSegment_Show", [this, null, null, 0]);
	var muscle = TopLevel.container.add(segmentType, [this, null, null, 1]);

	this.segments.push(head);
	this.segments.push(muscle);

	var onCollide = FuntionUtils.bindScope(this, this.onCollide);

	for(var i=2; i<this.segmentCount; i++){
		var segment = TopLevel.container.add(segmentType, [this, this.segments[i-2], this.segments[i-1], i, onCollide]);

		this.segments.push(segment);	
	}
}

Tentacle.prototype.lenghTo = function(value, time) { TweenMax.to(this, time, {girth:value}); }
Tentacle.prototype.RangeTo = function(value, time) { TweenMax.to(this, time, {muscleRange:value}); }
Tentacle.prototype.frequencyTo = function(value, time) { value *= 100/250; TweenMax.to(this, time, {muscleFreq:value}); }

Tentacle.prototype.setInitLenght    = function(value){ this.initLenght    = value; }
Tentacle.prototype.setInitRange     = function(value){ this.initRange     = value; }
Tentacle.prototype.setInitFrequency = function(value){ this.initFrequency = value; }

Tentacle.prototype.getInitLenght    = function(){ return NumberUtils.map(this.currentHp, 0, this.currentHpMax, this.minLength, this.initLenght); }
Tentacle.prototype.getInitRange     = function(){ return this.initRange;     }
Tentacle.prototype.getInitFrequency = function(){ return this.initFrequency; } 

Tentacle.prototype.addLengh     = function(value) { this.girth 		 += value; }
Tentacle.prototype.addRange     = function(value) { this.muscleRange += value; }
Tentacle.prototype.addFrequency = function(value) { this.muscleFreq  += value * 100/250; }
Tentacle.prototype.addAngle     = function(value) { this.theta 		 += value; }

Tentacle.prototype.setLengh      = function(value) { this.girth 	  = value; }
Tentacle.prototype.setRange      = function(value) { this.muscleRange = value; }
Tentacle.prototype.setFrequency  = function(value) { this.muscleFreq  = value * 100/250; }
Tentacle.prototype.setAngle      = function(value) { this.theta 	  = value; }

Tentacle.prototype.draw = function(context) {
	this.drawTentacleLine(context, "1");
	this.drawTentacleLine(context, "2");
	this.drawTentacleLine(context, "3");
	this.drawTentacleLine(context, "4");	
}

Tentacle.prototype.drawTentacleLine = function(context, rotateIndex, offsetX, offsetY){
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = 2;

	var normalizedStep = 1 / this.segments.length;
	var initStep = 1;

	context.beginPath();
	context.moveTo(this.segments[1]["rotated" + rotateIndex].x + initStep - this.centerX, this.segments[1]["rotated" + rotateIndex].y + initStep - this.centerY);
	for(var i=2; i<this.segments.length; i++){
		initStep -= normalizedStep;
		context.lineTo(this.segments[i]["rotated" + rotateIndex].x + (initStep) - this.centerX, this.segments[i]["rotated" + rotateIndex].y + (initStep) - this.centerY);
	}

	context.stroke();
	context.closePath();
}

Tentacle.prototype.update = function(delta) {
	if(this.swingSide){
		this.count += this.muscleFreq;
	}else{	
		this.count -= this.muscleFreq;
	}

	this.thetaMuscle = this.muscleRange*Math.sin(this.count);

	this.centerX = this.initWidth/2  + this.anchor.x;
	this.centerY = this.initHeight/2 + this.anchor.y;

	if(this.rotation != this.lastRotation){
		this.sin = Math.sin((this.rotation)*(Math.PI/180));
		this.cos = Math.cos((this.rotation)*(Math.PI/180));
	}

	this.lastRotation = this.rotation;
}

Tentacle.prototype.destroy = function(){
	for(var i=this.segmentCount-1; i>=0; i--){
		this.segments[i].alive = false;
		this.segments[i] = null;
	}

	this.segments.length = 0;
}

Tentacle.prototype.onHPDiminished = function(other) {
	this.girth = NumberUtils.map(this.currentHp, 0, this.currentHpMax, this.minLength, this.initLenght);
}

Tentacle.prototype.onDamageBlocked = function(other) {}
Tentacle.prototype.onDamageReceived = function(other) { this.alive = false; }
Tentacle.prototype.onAllDamageReceived = function(other) { this.alive = false; }

function TentacleSegment() {
	this.parentOnCollide = null;
	this.collider 		 = new SAT.Polygon(new SAT.Vector(0,0), [new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0)]);
}

TentacleSegment.inheritsFrom( Attributes );

TentacleSegment.prototype.init = function(tentacle, secondToPrevious, previous, index, parentOnCollide) {
	Attributes.prototype.init.call(this);	

	this.tentacle   	  = tentacle;
	this.secondToPrevious = secondToPrevious;
	this.previous 		  = previous;
	this.index 			  = index;
	this.parentOnCollide  = parentOnCollide;

	var n = NumberUtils.normalize(this.index+1, this.tentacle.segmentCount, 0);

	this.segmentWidth   = this.tentacle.initWidth*n;
	this.segmentHeight  = this.tentacle.initHeight*n; 

	this.point1 = {x:0, y:0};
	this.point2 = {x:0, y:0};
	this.point3 = {x:0, y:0};
	this.point4 = {x:0, y:0};

	this.rotated1 = {x:0, y:0};
	this.rotated2 = {x:0, y:0};
	this.rotated3 = {x:0, y:0};
	this.rotated4 = {x:0, y:0};
}

TentacleSegment.prototype.draw = function(context) {}

TentacleSegment.prototype.update = function(delta) {
	if(this.index == 0) {
		this.point1.x = Math.cos((Math.PI / 180) * this.tentacle.theta) + this.tentacle.anchor.x;
		this.point1.y = Math.sin((Math.PI / 180) * this.tentacle.theta) + this.tentacle.anchor.y;
	}
	else if(this.index == 1) { 
		this.point1.x = Math.cos((Math.PI / 180) * (this.tentacle.theta + this.tentacle.thetaMuscle)) + this.tentacle.anchor.x;
		this.point1.y = Math.sin((Math.PI / 180) * (this.tentacle.theta + this.tentacle.thetaMuscle)) + this.tentacle.anchor.y;
	}
	else {
		var dx = this.point1.x - this.secondToPrevious.point1.x;
		var dy = this.point1.y - this.secondToPrevious.point1.y;
		var d  = Math.sqrt (dx * dx + dy * dy);
		
		this.point1.x = this.previous.point1.x + ((dx * this.tentacle.girth) / d);
		this.point1.y = this.previous.point1.y + ((dy * this.tentacle.girth) / d);
	}

	this.x = this.tentacle.x - this.tentacle.centerX;
	this.y = this.tentacle.y - this.tentacle.centerY;

	this.point2.x = this.point1.x + this.segmentWidth;
	this.point2.y = this.point1.y;
	this.point3.x = this.point1.x + this.segmentWidth;
	this.point3.y = this.point1.y + this.segmentHeight;
	this.point4.x = this.point1.x;
	this.point4.y = this.point1.y + this.segmentHeight;

	this.rotatePoints(this.point1, this.rotated1, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point2, this.rotated2, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point3, this.rotated3, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point4, this.rotated4, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
}

TentacleSegment.prototype.rotatePoints = function(point, result, centerX, centerY, angleSin, angleCos) {
	result.x = (angleCos * (point.x-centerX) - angleSin * (point.y-centerY)) + centerX;
	result.y = (angleSin * (point.x-centerX) + angleCos * (point.y-centerY)) + centerY;
}

TentacleSegment.prototype.getColliderType = function(){
	return GameObject.POLYGON_COLLIDER;
}

TentacleSegment.prototype.getCollider = function(){
	if(this.segmentWidth == 0 || this.segmentHeight == 0){
		return null;
	}

	this.collider.pos.x = this.rotated1.x + this.x;
	this.collider.pos.y = this.rotated1.y + this.y;

	this.collider.points[0].x = 0;
	this.collider.points[0].y = 0;
	this.collider.points[1].x = (this.rotated2.x + this.x) - this.collider.pos.x;
	this.collider.points[1].y = (this.rotated2.y + this.y) - this.collider.pos.y;
	this.collider.points[2].x = (this.rotated3.x + this.x) - this.collider.pos.x;
	this.collider.points[2].y = (this.rotated3.y + this.y) - this.collider.pos.y;
	this.collider.points[3].x = (this.rotated4.x + this.x) - this.collider.pos.x;
	this.collider.points[3].y = (this.rotated4.y + this.y) - this.collider.pos.y;

	if((this.collider.points[1].x == 0 && this.collider.points[1].y == 0) &&
	   (this.collider.points[2].x == 0 && this.collider.points[2].y == 0) &&
	   (this.collider.points[3].x == 0 && this.collider.points[3].y == 0)){
		return null;
	}

	this.collider.recalc();

	return this.collider;
}

TentacleSegment.prototype.onHPDiminished = function(other) {
	if(this.parentOnCollide != null){
		this.parentOnCollide(other);
	}
}

TentacleSegment.prototype.onDamageBlocked = function(other) {}
TentacleSegment.prototype.onDamageReceived = function(other) {}
TentacleSegment.prototype.onAllDamageReceived = function(other) {}

