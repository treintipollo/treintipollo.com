Boss_1.inheritsFrom( Attributes );

function Boss_1() {
	this.tentacleBlood = new ShotCharge(null, 0, 0, 0, 0, 0);
	this.explosionArea = new ExplosionsArea();
	this.bloodStream   = new BloodStream(this);
	this.whiteFlash    = new WhiteFlashContainer();

	this.blinkTimer    = TimeOutFactory.getTimeOut(0, 2, this, null); 
	this.trembleTimer  = TimeOutFactory.getTimeOut(1, 70, this, null);

	this.deathTimer   = TimeOutFactory.getTimeOut(3000, 1, this, function(){
		this.stopAttack();
		TweenMax.killTweensOf(this);
		TweenMax.killTweensOf(this.currentPos);

		this.currentMotion.set(this.currentStats.get().deathMotion);
	});

	this.currentStats = {
		init: function(scope, allAbilities){
			this.scope 		  = scope;
			this.allAbilities = allAbilities; 
			this.eyeType      = allAbilities[scope.currentLevel].eyeTypes[0];
		},

		getRandomEye: function(){ 
			return this.allAbilities[this.scope.currentLevel].eyeTypes[Random.getRandomInt(0, this.allAbilities[this.scope.currentLevel].eyeTypes.length-1)]; 
		},

		get: function(){ 
			return this.allAbilities[this.scope.currentLevel]; 
		},

		abilityCount: function(){ 
			return this.allAbilities[this.scope.currentLevel].eyeTypes.length; 
		}
    };
}

Boss_1.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}
			 		
Boss_1.prototype.init = function(x, y, target) {
	this.parent.init.call(this);

	//This gets all the necessary data for this boss to work.	
	this.config = Boss_1_ConfigurationGetter.getConfiguration(this.typeId);

	CircleCollider.prototype.init.call(this, this.config.bodyProps[0]);

	this.x          	  = x;
	this.y          	  = y;
	this.currentPos       = {x:x, y:y};
	this.anchorPos        = {x:x, y:y};
	this.totalVariation   = {x:0, y:0};
	
	this.size         	  = this.config.bodyProps[0];
	this.eyeHeight    	  = this.config.bodyProps[1];
	this.eyeheightMax 	  = this.config.bodyProps[1];
	this.isBoss			  = this.config.bodyProps[2];

    this.currentStats.init(this, this.config.abilities);

	this.tentacles 		    = [];
	this.tentaclePositions  = [];

	this.counter      = 0;
	this.shakeCounter = 0;
	this.blinkCount   = 0;

	var shake = function(){
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
	}
	
	var aim = function(){
		this.shakeCounter = 0;
	}

	var idle = function(){
		this.counter++;
		this.totalVariation.x += Math.cos((this.counter*2) / (this.eyeheightMax*2));
		this.totalVariation.y += Math.cos((this.counter*2) / (this.eyeheightMax));
	}

	var death_init = function(){  
		this.deathTimer.start();

		this.blockDamage = true;

		this.executeOnAllTentacles(function(t){
			t.blockDamage = true;
		});

		this.stopAttack();
		
		this.weapons[this.config.INSECT_EYE].destroyAll();

		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax+(this.eyeheightMax/2), ease:Power4.easeOut});

	}

	var death_explosions_blood = function(){  
		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax/2, ease:Power4.easeOut});

		var sideChanges = 10;
	
		var explode = function(){
			this.explosionArea.stop();

			this.explosionArea.init(this, 60, 25, 10, 60, FuntionUtils.bindScope(this, function(){
				var length, newX, newY, info, tries;

				tries = 0;

				do{
					newX = this.anchorPos.x + Random.getRandomInt(-70, 70);
					newY = this.anchorPos.y + Random.getRandomInt(-70, 70);
					info = VectorUtils.getFullVectorInfo(this.x, this.y, newX, newY);

					if(tries > 10){
						break;	
					}
					tries++;

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
	}

	var death_explosions_retreate = function(){
		TweenMax.to(this, 3, {eyeHeight:this.eyeheightMax/2, ease:Power4.easeOut});

		this.explosionArea.stop();

		this.explosionArea.init(this, 30, 15, -1, 50);
		this.gotoPosition(this.x, -200, 5, FuntionUtils.bindScope(this, function(){
			this.alive = false;
		}));	
	}

	var tentacleDamage = function(tentacle){  
		shrinkTentacles.call(this);

		this.stopAttack();	
	
		this.tentacleBlood.parent = tentacle;
		this.tentacleBlood.initFromObject(this.config.tentacleBloodProps, this);
		this.tentacleBlood.on();
		
		TweenMax.to(this, 0.7, {eyeHeight:this.eyeheightMax/2, ease:Back.easeOut, onCompleteScope:this, onComplete:function(){
			this.startAttack();
			this.currentMotion.set(this.config.IDLE_MOTION);
			
			TweenMax.to(this, 0.5, {rotation:0, ease:Back.easeOut});
			TweenMax.to(this, 2, {eyeHeight:this.eyeheightMax, ease:Back.easeInOut});

			this.tentacleBlood.off();
		}});	
	}

	var damage = function(hitter, onComplete){
		shrinkTentacles.call(this);

		this.stopAttack();
		
		var moveVector = VectorUtils.getFullVectorInfo(hitter.x, hitter.y, this.x, this.y);

		TweenMax.to(this, 1, {rotation:Random.getRandomArbitary(-360, 360), ease:Power4.easeOut});
		TweenMax.to(this, 0.2, {eyeHeight:this.eyeheightMax/2, ease:Back.easeOut});

		this.gotoPosition(this.currentPos.x + (moveVector.dir.x * 80), this.currentPos.y + (moveVector.dir.y * 80), 1, function(){	
			this.gotoAnchor(this.currentStats.get().recoverFromKnockTime);
			this.startAttack();
			this.currentMotion.set(this.config.IDLE_MOTION);

			TweenMax.to(this, 0.5, {rotation:0, ease:Back.easeOut});
			TweenMax.to(this, 2, {eyeHeight:this.eyeheightMax, ease:Back.easeInOut});

			this.tentacleBlood.off();

			this.generateTentacles();

			onComplete();
		
		}, Power4.easeOut);	

		this.currentTentacleMotion.set(this.currentStats.get().tentacleMotion);
	}

	var shrinkTentacles = function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght()/2, 0.3);
			t.frequencyTo(t.getInitFrequency()*3, 0.1);		
		});
	}

	var shrinkTentacles_2 = function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght(), 0.3);	
			t.frequencyTo(t.getInitFrequency()*3, 0.1);
			t.RangeTo(80, 0.1);
		});
	}

	var growTentacles = function(){
		this.executeOnAllTentacles(function(t){
			t.lenghTo(t.getInitLenght(), 3);
			t.frequencyTo(t.getInitFrequency(), 1.0);
		});

		this.startAttack();
	}
	
	var helperInitialMotion = function(x, y){
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
	}

	var tremble = function(x, y){
		this.trembleTimer.start();
	}

	this.trembleTimer.callback = function(){
		this.scaleX = Random.getRandomArbitary(0.9, 1.1);
		this.scaleY = Random.getRandomArbitary(0.9, 1.1);
	}

	this.trembleTimer.onComplete = function() {
		this.scaleX = 1;
		this.scaleY = 1;
	}

	//Motion state machine
	this.currentMotion = new StateMachine(true, this);

	this.config.SHAKE_MOTION 		  = this.currentMotion.add(shrinkTentacles, shake, null);
	this.config.AIM_MOTION 			  = this.currentMotion.add(null, aim, null);
	this.config.IDLE_MOTION 		  = this.currentMotion.add(growTentacles, idle, null);
	this.config.DEATH_1_MOTION 		  = this.currentMotion.add(function(){ death_explosions_blood.call(this); shrinkTentacles_2.call(this); }, shake, null);
	this.config.DEATH_2_MOTION 		  = this.currentMotion.add(function(){ death_explosions_retreate.call(this); shrinkTentacles_2.call(this); }, shake, null);
	this.config.INIT_DEATH_MOTION 	  = this.currentMotion.add(death_init, aim, null);
	
	this.config.TENTACLE_DESTROYED 	  = this.currentMotion.add(tentacleDamage, shake, null);
	this.config.BIG_DAMAGED 		  = this.currentMotion.add(damage, shake, null);
	
	this.config.LIGHT_DAMAGED 		  = this.currentMotion.add(tremble, null, null);
	this.config.HELPER_INITIAL_MOTION = this.currentMotion.add(helperInitialMotion, idle, null);
	this.config.INIT_STATE 			  = this.currentMotion.add(null, idle, null);

	this.currentMotion.set(this.config.INIT_STATE);

	var idleTentacles = function(){
		var t, tPos;

		for(var i=0; i<this.tentaclePositions.length; i++){
			var t 	 = this.tentacles[i];
			var tPos = this.tentaclePositions[i];
			
			if(t){
				tPos.offSetX = t.offSetX;
				tPos.offSetY = t.offSetY;
				
				t.x = t.offSetX + this.x;
				t.y = t.offSetY + this.y;
			}	

			tPos.x = tPos.offSetX + this.x;
			tPos.y = tPos.offSetY + this.y;
		}
	}

	var oscillateTentacles = function(){
		var t, tPos, tConfig, d, a, x, y;

		for(var i=0; i<this.tentaclePositions.length; i++){
			t       = this.tentacles[i];
			tPos    = this.tentaclePositions[i];
			tConfig = this.config.tentacleProps[i];

			d = tConfig.distance;
			
			a = (this.tentacleRotation+tConfig.angle) * (Math.PI/180);

			tPos.offsetX = Math.cos(a) * d;
			tPos.offsetY = Math.sin(a) * d;

			x = this.x + tPos.offsetX;
			y = this.y + tPos.offsetY;

			if(t){
				t.x = x; 
				t.y = y;
				t.rotation = this.tentacleRotation+tConfig.angle;
			}

			tPos.x = x;
			tPos.y = y;
		}
	}

	var initIdleTentacles = function() {
		var t, tConfig;

		for(var i=0; i<this.tentaclePositions.length; i++){
			t = this.tentacles[i];
			tConfig = this.config.tentacleProps[i];
			if(t){ t.rotationTo(tConfig.angle, 1); }
		}
	}

	var initOscillation = function(){
		this.tentacleRotation = 0;	
		this.oscillationTween = TweenUtils.startValueOscilation.call(this, 
											"tentacleRotation", 
											this.currentStats.get().tentacleOscillationTime, 
											this.currentStats.get().tentacleOscillationMin, 
											this.currentStats.get().tentacleOscillationmax, 
											Sine.easeOut);
	}

	var oscillationComplete = function(){
		this.oscillationTween.kill();
	}

	//Tentacle motion state machine
	this.currentTentacleMotion = new StateMachine(true, this);

	this.config.TENTACLE_IDLE_MOTION 	   = this.currentTentacleMotion.add(initIdleTentacles, idleTentacles, null);
	this.config.TENTACLE_OSCILATION_MOTION = this.currentTentacleMotion.add(initOscillation, oscillateTentacles, oscillationComplete);

	this.currentTentacleMotion.set(this.currentStats.get().tentacleMotion);

	//Eye cycling modes
	var eyeCycleModes = [];
	eyeCycleModes[this.config.RANDOM_MIX_UP_EYE_CYCLE] = function(){
		return this.currentStats.getRandomEye();
	};

	eyeCycleModes[this.config.RANDOM_EYE_CYCLE] = function(){
		var nextEye = this.currentStats.eyeType;

		if(this.blinkCount % 2 != 0){
			nextEye = this.currentStats.getRandomEye();
		}

		return nextEye;
	}

	//Attack State machine
	var cycleEyes = function(){
		if(this.deathTimer.isRunning) return;

		if(this.currentStats.abilityCount() != 1){
			do{
				this.currentStats.eyeType = eyeCycleModes[this.currentStats.get().cycleMode].call(this);
				this.weapon = this.weapons[this.currentStats.eyeType];
			}while(!this.weapon.available());

		}else{
			this.currentStats.eyeType = eyeCycleModes[this.currentStats.get().cycleMode].call(this);
			this.weapon = this.weapons[this.currentStats.eyeType];
		}
	}

	var activateAttack = function(){
		if(this.deathTimer.isRunning) return;

		if(this.blinkCount % 2 == 0){	
			this.weapon.fire();
		
			if(this.weapon.needsAiming()){
				this.currentMotion.set(this.config.AIM_MOTION);	
			}
		}else{
			this.weapon.charge();
		}
	}

	var stopCharging = function(){
		if(this.deathTimer.isRunning) return;

		this.blinkCount++;
		this.weapon.disable();
	}

	this.blinkTimer.delay = this.currentStats.get().blinkTime;

	this.blinkTimer.callback = function(){ 
		if(this.deathTimer.isRunning) return;

		this.blinkingTween = TweenMax.fromTo(this, 0.2, 
											{eyeHeight:this.eyeheightMax}, 
											{eyeHeight:0, yoyo:true, repeat:1, 
											onRepeatScope:this,
											onRepeat:cycleEyes, 
											onCompleteScope:this,
											onComplete:activateAttack, 
											onStartScope:this,
											onStart:stopCharging});
	}

	var gotoShake     = FuntionUtils.bindScope(this, function(){ this.currentMotion.set(this.config.SHAKE_MOTION); });
	var gotoIdle      = FuntionUtils.bindScope(this, function(){ this.currentMotion.set(this.config.IDLE_MOTION); });
	var restartAttack = FuntionUtils.bindScope(this, function(){ this.startAttack(); });

	this.weapons = [];
	//Main weapons
	this.weapons[this.config.ROUND_EYE]  = new Boss_1_Weapon_Beam(this, target, gotoShake, gotoIdle);
	this.weapons[this.config.SNAKE_EYE]  = new Boss_1_Weapon_Twin_Beam(this, target, gotoShake, gotoIdle);
	this.weapons[this.config.INSECT_EYE] = new Boss_1_Backup(this, target, restartAttack);
	this.weapons[this.config.MULTI_EYE]  = new Boss_1_Weapon_PowerShot(this, target, restartAttack);
	this.weapons[this.config.CLONE_EYE]  = new Boss_1_Weapon_Clones(this, target, restartAttack);
	//Helper weapons
	this.weapons[this.config.ROUND_EYE_STRAIGHT] = new Boss_1_Weapon_Straight_Beam(this, gotoShake, gotoIdle);
	this.weapons[this.config.INSECT_EYE_ANGLED]  = new Boss_1_Weapon_Angled_Beam(this, gotoShake, gotoIdle);
	this.weapons[this.config.SNAKE_EYE_SNIPER]   = new Boss_1_Weapon_Sniper_Shot(this, target, restartAttack);
	this.weapons[this.config.INSECT_EYE_FOLLOW]  = new Boss_1_Weapon_Follow(this, target, restartAttack);

	this.weapon = this.weapons[0];

	this.color = "#FFFFFF";

	//Eye drawing logic
	var roundEye = function(context){
		this.drawEyeShape(context, 0, 0, 1, this.color);
		this.drawRoundEye(context, 0, 0, 1, this.color);
	}
	var snakeEye = function(context){
		this.drawEyeShape(context, 0, 0, 1, this.color);
		this.drawSnakeEye(context, 0, 0, 1, this.color);
	}
	var insectEye = function(context){
		this.drawEyeShape(context, 0, 0, 1);
		this.drawBugEyeCluster( 21  ,  0, 7, this.color, context, true, true , true , true, false, false);
		this.drawBugEyeCluster(-21  ,  0, 7, this.color, context, true, false, false, true, true , true );
		this.drawBugEyeCluster(  0  ,  0, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster( 21/2,-30, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster(-21/2,-30, 7, this.color, context, true, false, false, true, true , true );
		this.drawBugEyeCluster( 21/2, 30, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster(-21/2, 30, 7, this.color, context, true, false, false, true, true , true );
		this.drawBugEyeCluster(21*2 ,-24, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster(21*2 , 24, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster(-21*2,-24, 7, this.color, context, true, true , true , true, true , true );
		this.drawBugEyeCluster(-21*2, 24, 7, this.color, context, true, true , true , true, true , true );
	}

	var multiEye = function(context){
		var eyeProps;

		for(var i=0; i<this.config.multiEyeProps.length; i++){
			eyeProps = this.config.multiEyeProps[i];			
			context.save();
			this.drawEyeShape(context, eyeProps.xOffset, eyeProps.yOffset, eyeProps.scale);
			this.drawRoundEye(context, eyeProps.xOffset, eyeProps.yOffset, eyeProps.scale);
			context.restore();
		}
	}

	var cloneEye = function(context){
		var eyeProps;

		for(var i=0; i<this.config.cloneEyeProps.length; i++){
			eyeProps = this.config.cloneEyeProps[i];			
			context.save();
			this.drawEyeShape(context, eyeProps.xOffset, eyeProps.yOffset, eyeProps.scale);
			this.drawSnakeEye(context, eyeProps.xOffset, eyeProps.yOffset, eyeProps.scale);
			context.restore();
		}
	}

	this.eyeDrawLogic = [];
	this.eyeDrawLogic[this.config.ROUND_EYE] 		  = roundEye;
	this.eyeDrawLogic[this.config.SNAKE_EYE] 		  = snakeEye;
	this.eyeDrawLogic[this.config.INSECT_EYE] 		  = insectEye;

	this.eyeDrawLogic[this.config.ROUND_EYE_STRAIGHT] = roundEye;
	this.eyeDrawLogic[this.config.INSECT_EYE_ANGLED]  = roundEye;
	this.eyeDrawLogic[this.config.SNAKE_EYE_SNIPER]   = snakeEye;
	
	this.eyeDrawLogic[this.config.MULTI_EYE]  		  = multiEye;
	this.eyeDrawLogic[this.config.CLONE_EYE]   		  = cloneEye;
	this.eyeDrawLogic[this.config.INSECT_EYE_FOLLOW]  = insectEye;

	this.generateTentacles();
}

Boss_1.prototype.gotoPosition = function(x, y, time, onFinish, ease, setAsAnchor){
	if(setAsAnchor)
		this.anchorPos = {x:x, y:y}; 

	if(this.goToAnchorTween) 
		this.goToAnchorTween.kill();
	
	return TweenMax.to(this.currentPos, time, {x:x, y:y, ease:(ease != null ? ease : Linear.ease), onComplete:onFinish, onCompleteScope:this, overwrite:"none"});;
}

Boss_1.prototype.gotoAnchor = function(time){
	this.goToAnchorTween = TweenMax.to(this.currentPos, time, {x:this.anchorPos.x, y:this.anchorPos.y, overwrite:"none"});
}

Boss_1.prototype.startAttack = function(){
	if(this.deathTimer.isRunning) return;
	
	this.blinkCount = 0;
	this.blinkTimer.delay = this.currentStats.get().blinkTime;
	this.blinkTimer.start();
}

Boss_1.prototype.stopAttack = function(force){
	force ? this.weapon.forceDisable() : this.weapon.disable();
	
	this.blinkTimer.stop();
	
	if(this.blinkingTween) {
		this.blinkingTween.kill();
		this.blinkingTween = null;
	}
}

Boss_1.prototype.generateTentacles = function(override){
	if((!this.currentStats.get().generateTentacles || !this.isBoss) && !override){
		return;
	}

	this.tentacleCount = this.config.tentacleProps.length;

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

		var tProps = this.config.tentacleProps[i];
		var t = TopLevel.container.add(tProps.type, [{x:0, y:0}, tProps.width, tProps.height, tProps.segments, tProps.angle, tProps.side, this.isBoss]);
		setTentacleVariables(t, tProps.distance, tProps.angle, tProps.length, tProps.range, tProps.frequency);
		
		this.tentacles[i] = t;		
		
		t.addOnDestroyCallback(this, function(go){
			var index = this.tentacles.indexOf(go);
			this.tentacles[index] = null;

			this.currentMotion.set(this.config.TENTACLE_DESTROYED, [this.tentaclePositions[index]]);
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
	context.strokeStyle = this.color;
	context.lineWidth   = 2;

	context.beginPath();
	context.arc(0, 0, this.size, 0, Math.PI*2, false);	
	context.closePath();

	context.fill();
	context.stroke();

	this.eyeDrawLogic[this.currentStats.eyeType].call(this, context);
}

Boss_1.prototype.drawEyeShape = function(context, offSetX, offSetY, eyeSizeMultiplier, color) {
	var eyeSize   = this.size 	   * eyeSizeMultiplier;
	var eyeHeight = this.eyeHeight * eyeSizeMultiplier

	offSetX *= this.size;
	offSetY *= this.size;

	context.beginPath();
	
	context.moveTo(-eyeSize + offSetX, offSetY);	
	context.quadraticCurveTo(offSetX, -eyeHeight+offSetY, eyeSize+offSetX, offSetY);
	context.moveTo(-eyeSize + offSetX, offSetY);
	context.quadraticCurveTo(offSetX, eyeHeight+offSetY, eyeSize+offSetX, offSetY);
	
	context.stroke();
	context.fill();

	context.clip();
}

Boss_1.prototype.drawRoundEye = function(context, offSetX, offSetY, eyeSizeMultiplier, color) {
	var eyeheightMax = this.eyeheightMax * eyeSizeMultiplier;

	offSetX *= this.size;
	offSetY *= this.size;

	context.fillStyle = "#000000";
	
	context.beginPath();
	context.arc(offSetX, offSetY, eyeheightMax/2, 0, Math.PI*2, false);	
	context.moveTo(eyeheightMax/8+offSetX, offSetY);
	context.arc(offSetX, offSetY, eyeheightMax/8, 0, Math.PI*2, false);	
	context.closePath();

	context.stroke();
}

Boss_1.prototype.drawSnakeEye = function(context, offSetX, offSetY, eyeSizeMultiplier) {
	var eyeheightMax = this.eyeheightMax * eyeSizeMultiplier;

	offSetX *= this.size;
	offSetY *= this.size;

	context.fillStyle = "#000000";
	context.beginPath();

	context.moveTo(offSetX, (-eyeheightMax/2)+offSetY);	
	context.quadraticCurveTo((-eyeheightMax/4)+offSetX,offSetY,offSetX,(eyeheightMax/2)+offSetY);
	
	context.moveTo(offSetX, (-eyeheightMax/2)+offSetY);
	context.quadraticCurveTo((eyeheightMax/4)+offSetX,offSetY,offSetX,(eyeheightMax/2)+offSetY);
	
	context.stroke();
}

Boss_1.prototype.drawBugEyeCluster = function(x, y, radius, color, context, top, topRight, bottomRight, bottom, bottomLeft, topLeft) {
	context.lineWidth = 1;

	this.drawBugEyePiece(x, y, radius, color, context);
	
	var xOffset = (radius * 2) - 4;
	var yOffset = (radius * 2) - 2;

	//top
	if(top) this.drawBugEyePiece(x, y + -yOffset, radius, color, context);
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

	this.x = this.currentPos.x + this.totalVariation.x;
	this.y = this.currentPos.y + this.totalVariation.y;

	this.currentTentacleMotion.update();
	this.weapon.update();
}

Boss_1.prototype.destroy = function(){
	this.stopAttack();
	TweenMax.killTweensOf(this);
	TweenMax.killTweensOf(this.currentPos);

	this.tentacleBlood.off();
	this.bloodStream.off();
	this.explosionArea.stop();
	this.trembleTimer.stop();

	for(var i=0; i<this.weapons.length; i++){
		this.weapons[i].destroyAll();
		this.weapons[i] = null;
	}
	this.weapons.length = 0;

	this.currentMotion.destroy();
	this.currentTentacleMotion.destroy();


	this.executeOnAllTentacles(function(t){
		t.destroyWithOutCallBacks();
	});
}

Boss_1.prototype.onHPDiminished = function(other) { this.currentMotion.set(this.config.LIGHT_DAMAGED); }
Boss_1.prototype.onDamageBlocked = function(other) { }

Boss_1.prototype.onDamageReceived = function(other) {
	this.explosionArea.init(this, this.size, this.size/2, 15, 100);

	this.blockDamage = true;
	this.currentMotion.set(this.config.BIG_DAMAGED, [other, FuntionUtils.bindScope(this, function(){ this.blockDamage = false; })]);
}

Boss_1.prototype.onLastDamageLevelReached = function(other) {
	this.explosionArea.init(this, this.size, this.size/3, -1, 200);
	TweenMax.to(this, 0.7, {colorProps:{color:"#FF0000"}, yoyo:true, repeat:-1, ease:Linear.ease});
}

Boss_1.prototype.onAllDamageReceived = function(other) { 
	this.currentMotion.set(this.config.INIT_DEATH_MOTION); 
}


//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon() {}

Boss_1_Weapon.prototype.update = function() {}
Boss_1_Weapon.prototype.fire = function() {}
Boss_1_Weapon.prototype.charge = function() {}
Boss_1_Weapon.prototype.disable = function() {}
Boss_1_Weapon.prototype.forceDisable = function() {}
Boss_1_Weapon.prototype.needsAiming = function() {}
Boss_1_Weapon.prototype.available = function() {}
Boss_1_Weapon.prototype.destroyAll = function() {}

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Beam(user, target, onStart, onComplete) {
	if (typeof StraightBeam === "undefined") { return; }

	this.beam = new StraightBeam(user.config.beamProps);
	this.beam.init(TopLevel.container, user, target, user.config.straightBeamProps);

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;

	this.user = user;
	this.target = target;
	this.createSightProperties();
}

Boss_1_Weapon_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Beam.prototype.createSightProperties = function() { this.sightGameObject = null; this.sightEnd = {x:0, y:0}; }
Boss_1_Weapon_Beam.prototype.createSight = function() {
	if(this.sightGameObject == null){ 
		this.sightGameObject = TopLevel.container.add("Line", [this.user, this.sightEnd, "#FF0000", 2]); 
	}
}
Boss_1_Weapon_Beam.prototype.destroySight = function() {
	if(this.sightGameObject){
		this.sightGameObject.alive = false; 
		this.sightGameObject       = null;
	}
}
Boss_1_Weapon_Beam.prototype.update = function() { 
	var dx = 0; 
	var dy = 0;

	do{
		dx += -(this.user.x - this.target.x);
		dy += -(this.user.y - this.target.y);

		this.sightEnd.x = this.target.x + dx; 
		this.sightEnd.y = this.target.y + dy;
	}while( ScreenUtils.isInScreenBounds(this.sightEnd) )
}
Boss_1_Weapon_Beam.prototype.fire = function() { this.beam.fire(); this.destroySight();}
Boss_1_Weapon_Beam.prototype.charge = function() { this.beam.charge(); this.createSight(); }
Boss_1_Weapon_Beam.prototype.disable = function() { this.beam.disable(); this.destroySight(); }
Boss_1_Weapon_Beam.prototype.forceDisable = function() { this.beam.forceDisable(); this.destroySight(); }
Boss_1_Weapon_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Beam.prototype.available = function() { return true; };
Boss_1_Weapon_Beam.prototype.destroyAll = function() { this.beam.destroy(); this.destroySight(); }

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Twin_Beam(user, target, onStart, onComplete) {
	this.beam1 = new StraightBeam(user.config.beamProps);
	this.beam1.init(TopLevel.container, user, target, user.config.twinBeam1Props);

	this.beam2 = new StraightBeam(user.config.beamProps);
	this.beam2.init(TopLevel.container, user, target, user.config.twinBeam2Props);

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
Boss_1_Weapon_Twin_Beam.prototype.available = function() { return true; }
Boss_1_Weapon_Twin_Beam.prototype.destroyAll = function() { this.beam1.destroy(); this.beam2.destroy(); }

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Backup(user, target, onComplete) {
	this.target  		= target;
	this.user    		= user;
	this.onComplete     = onComplete;
	
	this.amount  		= user.config.backUpProps[0];
	this.helperDistance = user.config.backUpProps[1];
	this.positions      = jQuery.extend(true, {}, user.config.backUpProps[2]);

	this.helpers    = [];
	this.nextHelper = 0;

	this.beam = new StraightBeam(user.config.beamProps);
	this.beam.init(TopLevel.container, user, target, user.config.straightBeamProps);
}

Boss_1_Backup.inheritsFrom( Boss_1_Weapon );

Boss_1_Backup.prototype.update = function() { }
Boss_1_Backup.prototype.fire = function() {  
	this.onComplete();

	if(this.helpers.length >= this.amount){ return; }

	var p;

	for (var pos in this.positions){
		p = this.positions[pos];

		if(!p.active){ 
			p.active = true;
			break; 
		}
	}

	var h = TopLevel.container.add(p.helperName, [this.user.x, this.user.y, this.target]);

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

	h.currentMotion.set(this.user.config.HELPER_INITIAL_MOTION, [x, y]);

	this.helpers.push( {pos:p, helper:h} );
}

Boss_1_Backup.prototype.destroyAll = function() {
	if(!this.beam) return;

	for(var j=0; j<this.helpers.length; j++){
		TweenMax.killTweensOf(this.helpers[j].helper);
		TweenMax.killTweensOf(this.helpers[j].helper.currentPos);

		this.helpers[j].helper.currentPos.active = false;

		this.helpers[j].helper.destroyMode = GameObject.NO_CALLBACKS;
		this.helpers[j].helper.currentMotion.set(this.user.config.INIT_DEATH_MOTION);
	}

	this.beam.destroy();	
	this.beam = null;
}

Boss_1_Backup.prototype.charge = function() { this.beam.charge(); }
Boss_1_Backup.prototype.disable = function() { if(this.beam) this.beam.disable(); }
Boss_1_Backup.prototype.forceDisable = function() { if(this.beam) this.beam.forceDisable(); }
Boss_1_Backup.prototype.needsAiming = function() { return false; }
Boss_1_Backup.prototype.available = function() { return this.helpers.length < this.amount; };

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Straight_Beam(user, onStart, onComplete) {
	this.beam = new StraightBeam(user.config.beamProps);
	this.beam.init(TopLevel.container, user, null, user.config.straightBeamProps);

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;
	
	this.user = user;
	this.createSightProperties();
}

Boss_1_Weapon_Straight_Beam.inheritsFrom( Boss_1_Weapon_Beam );

Boss_1_Weapon_Straight_Beam.prototype.update = function() { this.sightEnd.x = this.user.x; this.sightEnd.y = this.user.y + 800; }
Boss_1_Weapon_Straight_Beam.prototype.fire = function() { this.beam.fire(90); this.destroySight(); }
Boss_1_Weapon_Straight_Beam.prototype.charge = function() { this.beam.charge(); this.createSight(); }
Boss_1_Weapon_Straight_Beam.prototype.disable = function() { this.beam.disable(); this.destroySight(); }
Boss_1_Weapon_Straight_Beam.prototype.forceDisable = function() { this.beam.forceDisable(); this.destroySight(); }
Boss_1_Weapon_Straight_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Straight_Beam.prototype.available = function() { return true; }

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Angled_Beam(user, onStart, onComplete, properties, beamProperties) {
	this.beam = new StraightBeam(user.config.beamProps);
	this.beam.init(TopLevel.container, user, null, user.config.straightBeamProps);

	this.rightAngle = user.config.angledBeamProps[0];
	this.leftAngle  = user.config.angledBeamProps[1];
	
	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;

	this.user 			 = user;
	this.createSightProperties();
}

Boss_1_Weapon_Angled_Beam.inheritsFrom( Boss_1_Weapon_Beam );

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
	this.user.x < TopLevel.canvas.width/2 ? this.beam.fire(this.rightAngle) : this.beam.fire(this.leftAngle);
	this.destroySight();
}

Boss_1_Weapon_Angled_Beam.prototype.charge = function() { this.beam.charge(); this.createSight(); }
Boss_1_Weapon_Angled_Beam.prototype.disable = function() { this.beam.disable(); this.destroySight(); }
Boss_1_Weapon_Angled_Beam.prototype.forceDisable = function() { this.beam.forceDisable(); this.destroySight();}
Boss_1_Weapon_Angled_Beam.prototype.needsAiming = function() { return true; }
Boss_1_Weapon_Angled_Beam.prototype.available = function() { return true; }

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Sniper_Shot(user, target, onComplete) {
	this.user = user;

	this.beam = new StraightBeam(user.config.beamProps);
	this.beam.init(TopLevel.container, user, null, user.config.straightBeamProps);

	var shotArguments = [];

	this.spreadIndex = 0;
	this.shotIndex   = 0;
	
	this.shotTimer = TimeOutFactory.getTimeOut(-1, -1, this, null); 

	this.shotTimer.callback = function(){ 
		for(var i=0; i<this.currentSpread.spreadInfo[this.shotIndex].length; i++){

			var shotProps = user.config.getShotType( this.currentSpread.spreadInfo[this.shotIndex][i] );

			shotArguments[0] = user;
			shotArguments[1] = target;
			shotArguments[2] = shotProps.size;
			shotArguments[3] = shotProps.speed;
			shotArguments[4] = shotProps.angleOffset;

			TopLevel.container.add(shotProps.type, shotArguments);
		}

		this.shotIndex++;
	}

	this.shotTimer.onComplete = onComplete;
}

Boss_1_Weapon_Sniper_Shot.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Sniper_Shot.prototype.update = function() { }
Boss_1_Weapon_Sniper_Shot.prototype.fire = function() { 
	this.shotIndex = 0;

	this.currentSpread = this.user.config.sniperProps.spreads[this.spreadIndex];
	this.shotTimer.startNewDelayAndRepeateCount(this.currentSpread.spreadDelay, this.currentSpread.spreadInfo.length); 

	this.spreadIndex++;
	if(this.spreadIndex >= this.user.config.sniperProps.spreads.length){
		this.spreadIndex = 0;
	}
}
Boss_1_Weapon_Sniper_Shot.prototype.charge = function() { this.beam.charge(); }
Boss_1_Weapon_Sniper_Shot.prototype.disable = function() { this.beam.disable(); this.shotTimer.stop(); }
Boss_1_Weapon_Sniper_Shot.prototype.forceDisable = function() { this.beam.forceDisable(); this.shotTimer.stop(); }
Boss_1_Weapon_Sniper_Shot.prototype.needsAiming = function() { return false; }
Boss_1_Weapon_Sniper_Shot.prototype.available = function() { return true; }
Boss_1_Weapon_Sniper_Shot.prototype.destroyAll = function() { 
	this.beam.destroy(); 
	this.shotTimer.remove(); 
}

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_PowerShot(user, target, onComplete) {
	this.user = user;

	this.spots = [];

	var eyeProps;
	for(var i=0; i<user.config.multiEyeProps.length; i++){
		eyeProps = user.config.multiEyeProps[i];
		this.spots.push( { x:0, y:0, offsetX:eyeProps.xOffset*user.size, offsetY:eyeProps.yOffset*user.size } );
	}

	this.gun = new MultiGun(this.spots, user, target, onComplete, user.config.multiShotProps);
}

Boss_1_Weapon_PowerShot.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_PowerShot.prototype.update = function() { 
	var spot;
	for(var i=0; i<this.spots.length; i++){
		spot = this.spots[i];
		spot.x = this.user.x + spot.offsetX;
		spot.y = this.user.y + spot.offsetY; 	
	}
}
Boss_1_Weapon_PowerShot.prototype.fire = function() {  this.gun.fire(); }
Boss_1_Weapon_PowerShot.prototype.charge = function() { this.gun.charge(); }
Boss_1_Weapon_PowerShot.prototype.disable = function() { this.gun.disable();  }
Boss_1_Weapon_PowerShot.prototype.forceDisable = function() { this.gun.forceDisable(); }
Boss_1_Weapon_PowerShot.prototype.needsAiming = function() { return false; }
Boss_1_Weapon_PowerShot.prototype.available = function() { return true; }
Boss_1_Weapon_PowerShot.prototype.destroyAll = function() { 
	this.spots.length = 0;
	this.gun.destroy();
}

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Clones(user, target, onComplete) {
	this.onComplete = onComplete;
	this.spots = [];
	this.user = user;

	var eyeProps;
	for(var i=0; i<user.config.cloneEyeProps.length; i++){
		eyeProps = user.config.cloneEyeProps[i];
		this.spots.push( { x:0, y:0, offsetX:eyeProps.xOffset*user.size, offsetY:eyeProps.yOffset*user.size } );
	}
	this.gun = new MultiGun(this.spots, user, target, null, user.config.multiShotProps);

	this.currentWave = 0;
	var cloneArguments = [];

	this.cloneWaveTimer = TimeOutFactory.getTimeOut(user.config.cloneProps.cloneWaveDelay, user.config.cloneProps.cloneWaveAmount, this, function(){
		
		if(this.currentWave >= user.config.cloneProps.cloneWaves.length){
			this.currentWave = 0;
		}

		for(var i=0; i<user.config.cloneProps.cloneWaves[this.currentWave].length; i++){
			var cloneProps = user.config.getCloneType( user.config.cloneProps.cloneWaves[this.currentWave][i] );

			var eyeIndex = Random.getRandomInt(0, user.config.cloneEyeProps.length-1);
			var x = user.x + (user.size * user.config.cloneEyeProps[eyeIndex].xOffset);
			var y = user.y + (user.size * user.config.cloneEyeProps[eyeIndex].yOffset);
			
			cloneArguments[0] = x;
			cloneArguments[1] = y;
			cloneArguments[2] = user.x;
			cloneArguments[3] = user.y;
			cloneArguments[4] = cloneProps;

			TopLevel.container.add(cloneProps.name, cloneArguments);		


		}
		
		this.currentWave++;
	});

	this.cloneWaveTimer.onComplete = onComplete;
}

Boss_1_Weapon_Clones.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Clones.prototype.update = function() {
	var spot;
	for(var i=0; i<this.spots.length; i++){
		spot = this.spots[i];
		spot.x = this.user.x + spot.offsetX;
		spot.y = this.user.y + spot.offsetY; 	
	}
}
Boss_1_Weapon_Clones.prototype.fire = function() { this.cloneWaveTimer.start()}
Boss_1_Weapon_Clones.prototype.charge = function() { this.gun.charge(); }
Boss_1_Weapon_Clones.prototype.disable = function() { this.cloneWaveTimer.stop(); this.gun.disable(); }
Boss_1_Weapon_Clones.prototype.forceDisable = function() { this.cloneWaveTimer.stop(); this.gun.disable(); }
Boss_1_Weapon_Clones.prototype.needsAiming = function() { return false; }
Boss_1_Weapon_Clones.prototype.available = function() { return true; }
Boss_1_Weapon_Clones.prototype.destroyAll = function() { 
	this.cloneWaveTimer.remove();
	this.gun.destroy();
}

//-------------------------------------------------
//-------------------------------------------------

function Boss_1_Weapon_Follow(user, target, onComplete) {
	this.user   = user;
	this.target = target;
	this.onComplete = onComplete;
}

Boss_1_Weapon_Follow.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Follow.prototype.update = function() { }
Boss_1_Weapon_Follow.prototype.fire = function() { 
	this.followTween = this.user.gotoPosition(this.target.x, this.target.y, this.user.config.followProps.speed, this.onComplete, true); 
}
Boss_1_Weapon_Follow.prototype.charge = function() {  }
Boss_1_Weapon_Follow.prototype.disable = function() { if(this.followTween) this.followTween.kill(); }
Boss_1_Weapon_Follow.prototype.forceDisable = function() {  }
Boss_1_Weapon_Follow.prototype.needsAiming = function() { return false; }
Boss_1_Weapon_Follow.prototype.available = function() { return true; }
Boss_1_Weapon_Follow.prototype.destroyAll = function() { }

function Tentacle() {       
    this.girth = 15;
    this.muscleRange = 50;
    this.muscleFreq = 0.2 * 100/250; 

    this.initLenght = this.girth;
    this.initRange = this.muscleRange;
    this.initFrequency = this.muscleFreq;

    this.minLength;

    this.theta 		  = 0;
    this.thethaMuscle = 0;
    this.count 		  = 0;
	this.lastRotation = 0;
    
    this.segments = [];

	this.doRotation = false;

	this.sin;
	this.cos;

	this.lengthTween;
}
Tentacle.inheritsFrom( Attributes );

Tentacle.prototype.init = function(anchor, initWidth, initHeight, segmentCount, initAngle, swingSide, isBossTentacle) {
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

	this.theta 		  = 0;
    this.thethaMuscle = 0;
    this.count 		  = 0;
	this.lastRotation = 0;

	var segmentType	= isBossTentacle ? "TentacleSegment_Collide" : "TentacleSegment_Show";

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

Tentacle.prototype.lenghTo 	   = function(value, time) { this.lengthTween = TweenMax.to(this, time, {girth:value}); }
Tentacle.prototype.RangeTo 	   = function(value, time) { TweenMax.to(this, time, {muscleRange:value}); }
Tentacle.prototype.frequencyTo = function(value, time) { value *= 100/250; TweenMax.to(this, time, {muscleFreq:value}); }
Tentacle.prototype.rotationTo  = function(value, time) { TweenMax.to(this, time, {shortRotation:{rotation:value}}); }

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
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = 2;

	var normalizedStep = 1 / this.segments.length;
	
	context.beginPath();

	var initStep = 1;
	var rotatePoint = 'rotated1';
	context.moveTo(this.segments[1][rotatePoint].x + initStep - this.centerX, this.segments[1][rotatePoint].y + initStep - this.centerY);
	for(var i=2; i<this.segments.length; i++){
		initStep -= normalizedStep;
		context.lineTo(this.segments[i][rotatePoint].x + (initStep) - this.centerX, this.segments[i][rotatePoint].y + (initStep) - this.centerY);
	}

	var initStep = 1;
	var rotatePoint = 'rotated4';
	context.moveTo(this.segments[1][rotatePoint].x + initStep - this.centerX, this.segments[1][rotatePoint].y + initStep - this.centerY);
	for(var i=2; i<this.segments.length; i++){
		initStep -= normalizedStep;
		context.lineTo(this.segments[i][rotatePoint].x + (initStep) - this.centerX, this.segments[i][rotatePoint].y + (initStep) - this.centerY);
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

	TweenMax.killTweensOf(this);
}

Tentacle.prototype.onHPDiminished = function(other) {
	if(this.lengthTween != null){
		this.lengthTween.kill();
	}

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

TentacleSegment.prototype.draw = function(context) {
	/*context.strokeStyle = "#FF0000";

	context.beginPath();
	context.moveTo(this.rotated1.x, this.rotated1.y);
	context.lineTo(this.rotated2.x, this.rotated2.y);
	context.lineTo(this.rotated3.x, this.rotated3.y);
	context.lineTo(this.rotated4.x, this.rotated4.y);
	context.closePath();

	context.stroke();*/
}

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

	this.rotated1.x = (this.tentacle.cos * (this.point1.x-this.tentacle.centerX) - this.tentacle.sin * (this.point1.y-this.tentacle.centerY)) + this.tentacle.centerX;
	this.rotated1.y = (this.tentacle.sin * (this.point1.x-this.tentacle.centerX) + this.tentacle.cos * (this.point1.y-this.tentacle.centerY)) + this.tentacle.centerY;

	this.rotated2.x = (this.tentacle.cos * (this.point2.x-this.tentacle.centerX) - this.tentacle.sin * (this.point2.y-this.tentacle.centerY)) + this.tentacle.centerX;
	this.rotated2.y = (this.tentacle.sin * (this.point2.x-this.tentacle.centerX) + this.tentacle.cos * (this.point2.y-this.tentacle.centerY)) + this.tentacle.centerY;

	this.rotated3.x = (this.tentacle.cos * (this.point3.x-this.tentacle.centerX) - this.tentacle.sin * (this.point3.y-this.tentacle.centerY)) + this.tentacle.centerX;
	this.rotated3.y = (this.tentacle.sin * (this.point3.x-this.tentacle.centerX) + this.tentacle.cos * (this.point3.y-this.tentacle.centerY)) + this.tentacle.centerY;

	this.rotated4.x = (this.tentacle.cos * (this.point4.x-this.tentacle.centerX) - this.tentacle.sin * (this.point4.y-this.tentacle.centerY)) + this.tentacle.centerX;
	this.rotated4.y = (this.tentacle.sin * (this.point4.x-this.tentacle.centerX) + this.tentacle.cos * (this.point4.y-this.tentacle.centerY)) + this.tentacle.centerY;
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

