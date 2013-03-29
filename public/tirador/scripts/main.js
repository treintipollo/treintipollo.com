var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	lastUpdate: Date.now(),
	focus: true,
	blur: true,
	tweensTimeLine: null,

	attributesGetter: {
		attributesTable: {},

		setAttributes: function (id, hp, damageReceived, damageDealtMultiplier, additionalProperties) {
			if(this.attributesTable[id] == null){
				this.attributesTable[id] = [];
			}

			this.attributesTable[id].push({hp:hp, damageReceived:damageReceived, damageDealtMultiplier:damageDealtMultiplier, additionalProperties:additionalProperties});
		},

		getAttributes: function (id, level) {
			if(this.attributesTable[id]){
				return this.attributesTable[id][level];	
			}

			return null;
		},

		getFullAttributes: function (id) {
			return this.attributesTable[id];
		}
	},

	powerUpFactory: {
		powerUpTypes: {},
		multiPowerUpPrototypes: {},
		args: [],
		createInBulk: [],


		addPowerUp: function(type, x, y, stayInPlace, angle, amount){
			this.args[0] = x;
			this.args[1] = y;
			this.args[2] = stayInPlace;				

			//I don't even know what "type" I am talking about :P
			var trueType = type;
			if(this.multiPowerUpPrototypes[type]){
				this.args[3] = this.multiPowerUpPrototypes[type].prototypes;
				type 		 = this.multiPowerUpPrototypes[type].type;
			}

			var p = TopLevel.container.add(type, this.args);	

			p.addOnCollideCallback(this, function(other){
				var callbacks = this.powerUpTypes[trueType];

				for(var i=0; i<callbacks.length; i++){
					callbacks[i].callback.call(callbacks[i].scope, p);
				}
			});

			if(amount > 1){
				p.gotoPosition(p.x + Math.cos(angle)*50, p.y + Math.sin(angle)*50);
			}
		},

		addPowerUpTypes: function(type, pickUpCallback){
			this.powerUpTypes[type] = pickUpCallback;
		},

		addMultiPowerUpType: function(multiPowerUpId, type, prototypes, pickUpCallback){
			this.powerUpTypes[multiPowerUpId] 			= pickUpCallback;
			this.multiPowerUpPrototypes[multiPowerUpId] = {type:type, prototypes:prototypes};
		},

		create: function(x, y, type, amount, stayInPlace){
			var anlgeStep = (360/amount) * (Math.PI/180);

			for(var i=0; i<amount; i++){
				if(type)
					this.addPowerUp(type, x, y, stayInPlace,  anlgeStep*i, amount);
			}
		},

		addToBulkCreate: function(type, amount){
			for(var i=0; i<amount; i++){
				this.createInBulk.push(type);
			}
		},

		createBulk: function(x, y, stayInPlace){
			var anlgeStep = (360/this.createInBulk.length) * (Math.PI/180);

			for(var i=0; i<this.createInBulk.length; i++){
				this.addPowerUp(this.createInBulk[i], x, y, stayInPlace, anlgeStep*i, this.createInBulk.length);
			}

			this.createInBulk.length = 0;
		}
	},

	textFeedbackDisplayer: {
		feedbacks: {},

		addFeedBack: function(text, font, size, fillColor, strokeColor, lineWidth, align, baseline) {
			this.feedbacks[text] = { x:0, y:0, text:text, font:font, size:size, fillColor:fillColor, strokeColor:strokeColor, lineWidth:lineWidth, align:align, baseline:baseline };
		},

		showFeedBack: function(name){
			this.feedbacks[name].x = TopLevel.playerData.ship.x;
			this.feedbacks[name].y = TopLevel.playerData.ship.y;
			TopLevel.container.add("PowerUpText", this.feedbacks[name]);
		}
	},

	weaponFactory: {
		SHOT_WEAPON		    : 0,
		ROCKET_WEAPON	    : 1,
		CLONE_SHOT_WEAPON   : 2,
		HOMING_ROCKET_WEAPON: 3,

		weaponsTypes: [
			function(level, user){ return new ShotWeapon(this.SHOT_WEAPON                 , level, user, true, true, "Small_Shot", "Big_Shot"); }, 
			function(level, user){ return new RocketWeapon(this.ROCKET_WEAPON             , level, user, true); },
			function(level, user){ return new ShotWeapon(this.CLONE_SHOT_WEAPON           , level, user, false, false, "Clone_Small_Shot", "Clone_Big_Shot"); },
			function(level, user){ return new HomingRocketWeapon(this.HOMING_ROCKET_WEAPON, level, user, true); }
		],
		
		getInitializedWeapon: function(id, level, user, lastWeapon) {
			if(lastWeapon) lastWeapon.destroy();
			lastWeapon = this.weaponsTypes[id].call(this, level, user);
			lastWeapon.init(TopLevel.container);			
			return lastWeapon;
		},

		getWeapon: function(id, level, user) {
			var weapon = this.weaponsTypes[id](level, user);
			return weapon;
		},		
	},

	playerData: {
		weapon         : null,
		lastWeaponType : 0,
		speedPowerUps  : 0,
		ship           : null,

		speed          : 100,
		lives          : 1, 

		speedCap	   : 150,
		weaponDivider  : 4,
		speedDivider   : 4,

		init: function(ship) {
			this.reset();

			this.ship 		 = ship;
			this.ship.weapon = this.initWeapon();
		},

		reset: function() {
			this.speed  		= 100;
			this.speedPowerUps  = 0;

			if(this.weapon) this.weapon.destroy();
		},		

		initWeapon: function() {
			this.weapon = TopLevel.weaponFactory.getInitializedWeapon(this.lastWeaponType, 0, this.ship, this.weapon);
			//this.weapon = TopLevel.weaponFactory.getInitializedWeapon(this.lastWeaponType, 8, this.ship, this.weapon);
			this.lastWeaponType = this.weapon.getId();
			return this.weapon;
		},

		setWeapon: function(weaponId) {
			if(this.lastWeaponType == weaponId){
				this.powerUpWeapon();
			}else{
				this.weapon = TopLevel.weaponFactory.getInitializedWeapon(weaponId, this.weapon.getLevel(), this.ship, this.weapon);
				this.lastWeaponType = this.weapon.getId();
			}
		},

		powerUpWeapon  : function() { this.weapon.powerUp();   },
		powerDownWeapon: function() { this.weapon.powerDown(); },
		
		increaseSpeed: function() { 
			if(this.speed < this.speedCap){
				this.speed += 10; 
				this.speedPowerUps++;
			}
		},
		
		increaseLives: function() { this.lives++; },
		decreaseLives: function() { 
			TopLevel.powerUpFactory.addToBulkCreate("WeaponPowerUp", Math.floor(this.weapon.getLevel()/this.weaponDivider) );
			TopLevel.powerUpFactory.addToBulkCreate("SpeedPowerUp", Math.floor(this.speedPowerUps/this.speedDivider) );
			TopLevel.powerUpFactory.createBulk(this.ship.x, this.ship.y, true);

			this.reset();
			this.lives--; 
		},	

		increaseHP: function() {
			this.ship.recoverHP(5);
		},
	},

	playerShipFactory: {
		playerShipArguments: [],
		recreateTimer: null,
		playerActionsCallbacks: {},

		init: function() {
			this.recreateTimer = TimeOutFactory.getTimeOut(1000, 1, this, function(){ this.createPlayerShipNoArgs(); });
		},

		firstShip: function(x, y){
			return this.createPlayerShip(x, y);
		},

		createPlayerShipNoArgs: function() {
			this.setCallbacksToShip(TopLevel.container.add("Ship", this.playerShipArguments));
		},

		createPlayerShip: function(x, y) {
			this.playerShipArguments[0] = x;
			this.playerShipArguments[1] = y;
			this.playerShipArguments[2] = TopLevel.container;

			var ship = TopLevel.container.add("Ship", this.playerShipArguments);
			this.setCallbacksToShip(ship);

			return ship;
		},

		setCallbacksToShip: function(ship) {
			ship.addOnDestroyCallback(this, function(obj){
				this.playerShipArguments[0] = obj.x;
				this.playerShipArguments[1] = obj.y;

				this.recreateTimer.start();	
			});

			for(var k in this.playerActionsCallbacks){
				for(var i=0; i<this.playerActionsCallbacks[k].length; i++){
					var callbackObject = this.playerActionsCallbacks[k][i];
					ship[k](callbackObject.scope, callbackObject.callback);
				}
			}
		},

		addCallbacksToAction: function(actionName, callbacks) {
			this.playerActionsCallbacks[actionName] = callbacks;
		}
	}
};
window.TopLevel = TopLevel;

//Special enemies to carry power ups.
	//Single Enemy waves.
	//Cargo Ship
		//Delivery de Pizza, espacial. (Space Pizza).

//Minimalistic Hud, showing lives, health, speed and weapon level.

//Messages
	//Warning Message
		//Incoming Boss
	//Congratulations message
		//Boss defeated
		//Game Completed
	//Game Over

//TODO: Poner un splash para que si el juego arranca sin saber si tiene el foco o no, no pase nada.
		//Usar hasFOcus del document.

//TODO: Emoticons.
	//Ship.
	//Boss
	//Emoticon Manager

//TODO: Tweek base damages and damage multipliers. Everything.
	   //Tweek powerup show up ratio.
	   //Tweek boss attacks.
	   //Tweek power up bonuses.
	   //Tweek weapons
	   		//Rocket Amount
	   		//Homing Amount (when unlocked)
	   		//Shot speed and amount.
	   		//Charge shot speed.

//TODO: Usar TimeOutFactory dentro de ArrowKeyHandler.

//TODO: Utility methods to draw lines, sqaures and circles. Should recieve a context along with other parameters.
		//TODO:Utility Object, so that the global scope has less litter.

//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
		//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.

$(function(){
	TopLevel.canvas    = document.getElementById("game");
	TopLevel.context   = TopLevel.canvas.getContext("2d");
	
	ArrowKeyHandler.init();

	TopLevel.container 	= new ObjectsContainer(TopLevel.context);

	var createObjectPools = function(){
		TopLevel.container.createTypePool("Ship"	 , Ship		, 1);
		TopLevel.container.createTypePool("CloneShip", CloneShip, 10);

		TopLevel.container.createTypePool("Star", Star, 30);
		
		TopLevel.container.createTypePool("ExhaustParticle"    , ExhaustParticle, 500);
		TopLevel.container.createTypePool("ShotChargeParticle" , ShotChargeParticle, 40);
		TopLevel.container.createTypePool("BurstParticle"      , BurstParticle, 500);
		TopLevel.container.createTypePool("BurstParticleRadius", BurstParticleRadius, 300);
		TopLevel.container.createTypePool("StraightParticle"   , StraightParticle, 3000);

		TopLevel.container.createTypePool("Shot"           , Shot, 70);
		TopLevel.container.createTypePool("PowerShot"      , PowerShot, 1);
		TopLevel.container.createTypePool("PowerShotSine"  , PowerShotSine, 2);
		TopLevel.container.createTypePool("PowerShotCircle", PowerShotCircle, 3);
		
		TopLevel.container.createTypePool("SmallSwarmRocket"  , SmallSwarmRocket  , 20);
		TopLevel.container.createTypePool("LargeSwarmRocket"  , LargeSwarmRocket  , 20);
		TopLevel.container.createTypePool("ClusterSwarmRocket", ClusterSwarmRocket, 20);
		
		TopLevel.container.createTypePool("SmallHomingRocket"  , SmallHomingRocket  , 20);
		TopLevel.container.createTypePool("LargeHomingRocket"  , LargeHomingRocket  , 20);
		TopLevel.container.createTypePool("ClusterHomingRocket", ClusterHomingRocket, 20);

		TopLevel.container.createTypePool("Target"      , Target, 6);
		TopLevel.container.createTypePool("HomingTarget", HomingTarget, 6);

		TopLevel.container.createTypePool("Explosion"    , Explosion, 50);
		TopLevel.container.createTypePool("Debry"        , Debry, 40);

		TopLevel.container.createTypePool("ShotPowerUp"  		, ShotPowerUp, 2);
		TopLevel.container.createTypePool("RocketPowerUp"		, RocketPowerUp, 2);
		TopLevel.container.createTypePool("WeaponPowerUp"		, WeaponPowerUp, 8);
		TopLevel.container.createTypePool("HPPowerUp"    		, HPPowerUp, 1);
		TopLevel.container.createTypePool("SpeedPowerUp" 		, SpeedPowerUp, 8);
		TopLevel.container.createTypePool("LivesPowerUp" 		, LivesPowerUp, 1);
		TopLevel.container.createTypePool("MultiPowerUp" 		, MultiPowerUp, 2);
		TopLevel.container.createTypePool("HomingRocketPowerUp" , HomingRocketPowerUp, 2);

		TopLevel.container.createTypePool("EnemyRocket", EnemyRocket, 30);
		
		TopLevel.container.createTypePool("Boss_1"    	   , Boss_1, 4);
		TopLevel.container.createTypePool("Tentacle"   	   , Tentacle, 20);
		TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);
		TopLevel.container.createTypePool("BeamCollider"   , BeamCollider, 200);
		TopLevel.container.createTypePool("WhiteFlash"     , WhiteFlash, 2);

		TopLevel.container.createTypePool("Fireball"       , Fireball, 40);
		TopLevel.container.createTypePool("MultiShot"      , MultiShot, 20);

		TopLevel.container.createTypePool("Line"          , Line, 2);
		TopLevel.container.createTypePool("PercentageLine", PercentageLine, 66);
		TopLevel.container.createTypePool("PowerUpText"	  , PowerUpText, 3);		
	}

	var createObjectConfigurations = function() {
		//Configurations
		//Collidable GameObjects
		TopLevel.container.createTypeConfiguration("Ship", "Ship", "Ship", 0, true);
		TopLevel.container.createTypeConfiguration("CloneShip", "CloneShip", "CloneShip", 1, true);

		TopLevel.container.createTypeConfiguration("Small_Shot"      , "Shot", "Shot"     , 1, true);
		TopLevel.container.createTypeConfiguration("Big_Shot"        , "Shot", "Shot"     , 1, true);
		TopLevel.container.createTypeConfiguration("Clone_Small_Shot", "Shot", "CloneShot", 1, true);
		TopLevel.container.createTypeConfiguration("Clone_Big_Shot"  , "Shot", "CloneShot", 1, true);

		TopLevel.container.createTypeConfiguration("Single_Power_Shot_1", "PowerShot", "PowerShot", 0, true);
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_2", "PowerShot", "PowerShot", 0, true);
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_3", "PowerShot", "PowerShot", 0, true);

		TopLevel.container.createTypeConfiguration("Double_Power_Shot_1", "PowerShotSine", "PowerShot", 0, true);
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_2", "PowerShotSine", "PowerShot", 0, true);
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_3", "PowerShotSine", "PowerShot", 0, true);

		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_1" , "PowerShotCircle", "PowerShot", 0, true);	
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_2" , "PowerShotCircle", "PowerShot", 0, true);
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_3" , "PowerShotCircle", "PowerShot", 0, true);

		TopLevel.container.createTypeConfiguration("SmallSwarmRocket"  , "SmallSwarmRocket"  , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("LargeSwarmRocket"  , "LargeSwarmRocket"  , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("ClusterSwarmRocket", "ClusterSwarmRocket", "Rocket", 1, true );

		TopLevel.container.createTypeConfiguration("SmallHomingRocket"  , "SmallHomingRocket"  , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("LargeHomingRocket"  , "LargeHomingRocket"  , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("ClusterHomingRocket", "ClusterHomingRocket", "Rocket", 1, true );
		
		TopLevel.container.createTypeConfiguration("Explosion_Damage", "Explosion"	  , "Rocket", 0, true );
		TopLevel.container.createTypeConfiguration("Explosion_Effect", "Explosion"	  , "Rocket", 0, false);
		TopLevel.container.createTypeConfiguration("Debry"			 , "Debry"		  , "Rocket", 2, true );
		
		TopLevel.container.createTypeConfiguration("ShotPowerUp"  , "ShotPowerUp"  , "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("RocketPowerUp", "RocketPowerUp", "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("WeaponPowerUp", "WeaponPowerUp", "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("HPPowerUp"    , "HPPowerUp"    , "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("SpeedPowerUp" , "SpeedPowerUp" , "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("LivesPowerUp" , "LivesPowerUp" , "PowerUp", 0, true);
		TopLevel.container.createTypeConfiguration("MultiPowerUp" , "MultiPowerUp" , "PowerUp", 0, true);

		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_1", "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_2", "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_3", "EnemyRocket", "EnemyRocket", 3, true);

		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_1"  , "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_2"  , "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_3"  , "EnemyRocket", "EnemyRocket", 3, true);
		
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_1", "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_2", "EnemyRocket", "EnemyRocket", 3, true);
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_3", "EnemyRocket", "EnemyRocket", 3, true);

		TopLevel.container.createTypeConfiguration("Boss_1_A", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_B", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_C", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_D", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_E", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_F", "Boss_1", "Boss_1", 2, true, ObjectsContainer.UNSHIFT);

		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Beam_1", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_1", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_2", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_1", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_2", "Boss_1", "Boss_1", 0, true);

		TopLevel.container.createTypeConfiguration("SubBoss_1", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("SubBoss_2", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("SubBoss_3", "Boss_1", "Boss_1", 0, true);

		TopLevel.container.createTypeConfiguration("Tentacle"  	 , "Tentacle", "Tentacle", 3, false, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("WeakTentacle", "Tentacle", "Tentacle", 3, false, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("LongTentacle", "Tentacle", "Tentacle", 3, false, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("BabyTentacle", "Tentacle", "Tentacle", 1, false, ObjectsContainer.UNSHIFT);

		TopLevel.container.createTypeConfiguration("TentacleSegment_Collide", "TentacleSegment", "TentacleSegment", 3, true , ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("TentacleSegment_Show"   , "TentacleSegment", "TentacleSegment", 3, false, ObjectsContainer.UNSHIFT);

		TopLevel.container.createTypeConfiguration("BeamCollider"  	        , "BeamCollider"   , "BeamCollider"	  , 0, true );
		
		TopLevel.container.createTypeConfiguration("Fireball" , "Fireball" , "Fireball" , 0, true );
		TopLevel.container.createTypeConfiguration("MultiShot", "MultiShot", "MultiShot", 0, true );

		
		//Visual Only GameObjects
		TopLevel.container.createTypeConfiguration("Star"		, "Star"	   , "Star"		  , 4, false);
		TopLevel.container.createTypeConfiguration("WhiteFlash"	, "WhiteFlash" , "WhiteFlash" , 0, false);
		TopLevel.container.createTypeConfiguration("PowerUpText", "PowerUpText", "PowerUpText", 0, false, ObjectsContainer.PUSH, ObjectsContainer.CALL);
		
		TopLevel.container.createTypeConfiguration("Target"      , "Target"      , "Target", 0, false);
		TopLevel.container.createTypeConfiguration("HomingTarget", "HomingTarget", "Target", 0, true);

		TopLevel.container.createTypeConfiguration("Line"		   , "Line"	   		 , "Line"		   , 0, false);
		TopLevel.container.createTypeConfiguration("PercentageLine", "PercentageLine", "PercentageLine", 0, false);
		
		TopLevel.container.createTypeConfiguration("ExhaustParticle"    , "ExhaustParticle"    , "ExhaustParticle"    , 1, false);
		TopLevel.container.createTypeConfiguration("ShotChargeParticle" , "ShotChargeParticle" , "ShotChargeParticle" , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticle"      , "BurstParticle"      , "BurstParticle"	  , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticle_Blood", "BurstParticle"      , "BurstParticle"	  , 3, false);	
		TopLevel.container.createTypeConfiguration("StraightParticle"   , "StraightParticle"   , "StraightParticle"	  , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticleRadius", "BurstParticleRadius", "BurstParticleRadius", 0, false);

		//Boss Configurations
		Boss_1_ConfigurationGetter.createConfigurations();
	}
	
	var createCollisionPairs = function(){
		//Collision pairs
		TopLevel.container.addCollisionPair("Ship", "EnemyRocket");
		TopLevel.container.addCollisionPair("Ship", "PowerUp");
		TopLevel.container.addCollisionPair("Ship", "BeamCollider");
		TopLevel.container.addCollisionPair("Ship", "Boss_1");
		TopLevel.container.addCollisionPair("Ship", "Fireball");
		TopLevel.container.addCollisionPair("Ship", "TentacleSegment");
		TopLevel.container.addCollisionPair("Ship", "MultiShot");
		TopLevel.container.addCollisionPair("Ship", "CloneShot");
		TopLevel.container.addCollisionPair("Ship", "CloneShip");

		TopLevel.container.addCollisionPair("Shot"     , "CloneShip");		
		TopLevel.container.addCollisionPair("PowerShot", "CloneShip");
		TopLevel.container.addCollisionPair("Rocket"   , "CloneShip");

		TopLevel.container.addCollisionPair("Shot"     , "EnemyRocket");
		TopLevel.container.addCollisionPair("PowerShot", "EnemyRocket");
		TopLevel.container.addCollisionPair("Rocket"   , "EnemyRocket");

		TopLevel.container.addCollisionPair("Target"   , "EnemyRocket");
		TopLevel.container.addCollisionPair("Target"   , "Boss_1");		

		TopLevel.container.addCollisionPair("Shot"     , "Boss_1");		
		TopLevel.container.addCollisionPair("PowerShot", "Boss_1");
		TopLevel.container.addCollisionPair("Rocket"   , "Boss_1");
		
		TopLevel.container.addCollisionPair("Shot"     , "TentacleSegment");
		TopLevel.container.addCollisionPair("PowerShot", "TentacleSegment");
		TopLevel.container.addCollisionPair("Rocket"   , "TentacleSegment");
	}
	
	var createAttributesTable = function(){
		//id, hp, damageReceived, damageDealtMultiplier
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );

		TopLevel.attributesGetter.setAttributes("CloneShip", 10 , 3 , 10 );

		TopLevel.attributesGetter.setAttributes("Small_Shot", 0 , 0 , 0.5, {big:false} ); 
		TopLevel.attributesGetter.setAttributes("Big_Shot"	, 0 , 0 , 0.6, {big:true} );
		TopLevel.attributesGetter.setAttributes("Clone_Small_Shot", 0 , 0 , 3, {big:false} ); 
		TopLevel.attributesGetter.setAttributes("Clone_Big_Shot"  , 0 , 0 , 3, {big:true} );  

		TopLevel.attributesGetter.setAttributes("Single_Power_Shot_1", 50, 1, 2.0 ); 
		TopLevel.attributesGetter.setAttributes("Single_Power_Shot_2", 50, 1, 3.0 ); 
		TopLevel.attributesGetter.setAttributes("Single_Power_Shot_3", 50, 1, 4.0 ); 

		TopLevel.attributesGetter.setAttributes("Double_Power_Shot_1", 50, 1, 1.0 ); 
		TopLevel.attributesGetter.setAttributes("Double_Power_Shot_2", 50, 1, 1.5 ); 
		TopLevel.attributesGetter.setAttributes("Double_Power_Shot_3", 50, 1, 2.0 ); 

		TopLevel.attributesGetter.setAttributes("Triple_Power_Shot_1", 50, 1, 0.66 );
		TopLevel.attributesGetter.setAttributes("Triple_Power_Shot_2", 50, 1, 1.0  );
		TopLevel.attributesGetter.setAttributes("Triple_Power_Shot_3", 50, 1, 1.33 );

		TopLevel.attributesGetter.setAttributes("SmallSwarmRocket"  ,  0, 0, 0.8); 
		TopLevel.attributesGetter.setAttributes("LargeSwarmRocket"  ,  0, 0, 0.9); 
		TopLevel.attributesGetter.setAttributes("ClusterSwarmRocket",  0, 0, 0.5);

		TopLevel.attributesGetter.setAttributes("SmallHomingRocket"  ,  0, 0, 0.8); 
		TopLevel.attributesGetter.setAttributes("LargeHomingRocket"  ,  0, 0, 0.9); 
		TopLevel.attributesGetter.setAttributes("ClusterHomingRocket",  0, 0, 0.5); 
		
		TopLevel.attributesGetter.setAttributes("Explosion_Damage", 50, 1, 0.1); 
		TopLevel.attributesGetter.setAttributes("Explosion_Effect",  0, 0,   0); 
		TopLevel.attributesGetter.setAttributes("Debry"           ,  0, 0, 0.4); 
		
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 25 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 25 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 25 , 1, 10); 

		TopLevel.attributesGetter.setAttributes("Boss_1_B", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_B", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_B", 30 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_C", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_C", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_C", 10 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_C", 30 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_D", 40 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_D", 40 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_D", 40 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_E", 20 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_E", 20 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_E", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_E", 50 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_F", 30 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_F", 30 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_F", 20 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_F", 40 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_Beam_1", 20 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_Sniper_1", 20 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_Sniper_2", 20 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_Multi_1", 20 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_Multi_2", 20 , 1, 10);

		TopLevel.attributesGetter.setAttributes("SubBoss_1", 40 , 1, 10);
		TopLevel.attributesGetter.setAttributes("SubBoss_2", 50 , 1, 10);
		TopLevel.attributesGetter.setAttributes("SubBoss_3", 60 , 1, 10); 

		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } );

		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10, { minLength:4 } );

		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 

		TopLevel.attributesGetter.setAttributes("BabyTentacle", 100, 0.1, 10, { minLength:4 } );

		TopLevel.attributesGetter.setAttributes("TentacleSegment_Collide", 1, 0, 5); 
		
		TopLevel.attributesGetter.setAttributes("BeamCollider", 1 , 1 , 1); 
		TopLevel.attributesGetter.setAttributes("Fireball"	  , 0 , 0 , 1); 
		TopLevel.attributesGetter.setAttributes("MultiShot"	  , 0 , 0 , 5);

		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_1", 0, 0, 3 , {mainDim:7  } );
		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_2", 0, 0, 3 , {mainDim:8  } );
		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_3", 2, 2, 3 , {mainDim:9  } );

		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_1"  , 2, 1, 5 , {mainDim:11} );
		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_2"  , 2, 1, 5 , {mainDim:11} );
		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_3"  , 3, 1, 5 , {mainDim:12} );
		
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_1", 4, 1, 10, {mainDim:14} );
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_2", 4, 1, 10, {mainDim:14} );
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_3", 5, 1, 10, {mainDim:15} );	
	}
	
	var createTextFeedback = function() {
		TopLevel.textFeedbackDisplayer.addFeedBack("POWER UP!"	, "Russo One", 20, "#FFFFFF", "#FFFF00", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("POWER DOWN"	, "Russo One", 20, "#FFFFFF", "#777777", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("SHOT!"		, "Russo One", 20, "#FFFFFF", "#FF0000", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("ROCKETS!"	, "Russo One", 20, "#FFFFFF", "#0000FF", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("HOMING!"	, "Russo One", 20, "#FFFFFF", "#00FF00", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("SPEED UP!"	, "Russo One", 20, "#FFFFFF", "#00FF00", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("HEALTH UP!"	, "Russo One", 20, "#FFFFFF", "#FF0000", 1, "center", "middle");
		TopLevel.textFeedbackDisplayer.addFeedBack("1-UP!"		, "Russo One", 20, "#FFFFFF", "#777777", 1, "center", "middle");
	}


	var createPowerUps = function() {
		TopLevel.powerUpFactory.addPowerUpTypes("ShotPowerUp", [ 
				{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.SHOT_WEAPON); } },
				{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("SHOT!"); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("RocketPowerUp", [
				{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.ROCKET_WEAPON); } },
				{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("ROCKETS!"); } }
		]); 

		TopLevel.powerUpFactory.addPowerUpTypes("HomingRocketPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.HOMING_ROCKET_WEAPON); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("HOMING!"); } }
		]);
		
		TopLevel.powerUpFactory.addPowerUpTypes("WeaponPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.powerUpWeapon(); 		   } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("POWER UP!"); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("HPPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseHP(); 				} },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("HEALTH UP!"); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("SpeedPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseSpeed(); 		   } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("SPEED UP!"); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("LivesPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseLives(); 	   } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("1-UP!"); } }
		]);

		//This implementation of multi purpose powerups almost defeats of the purpose of the previous callback structure. Almost :P
		TopLevel.powerUpFactory.addMultiPowerUpType("MultiWeaponPowerUp", "MultiPowerUp", 
			[{id:"ShotPowerUp"  , pro:ShotPowerUp.prototype}, 
			 {id:"RocketPowerUp", pro:RocketPowerUp.prototype},
			 {id:"HomingPowerUp", pro:HomingRocketPowerUp.prototype}], 

			[{scope:TopLevel.playerData, callback:function(powerUp){ 
				if(powerUp.id == "ShotPowerUp"){ this.setWeapon(TopLevel.weaponFactory.SHOT_WEAPON); }
				if(powerUp.id == "RocketPowerUp"){ this.setWeapon(TopLevel.weaponFactory.ROCKET_WEAPON); }
				if(powerUp.id == "HomingPowerUp"){ this.setWeapon(TopLevel.weaponFactory.HOMING_ROCKET_WEAPON); }
			} },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){  
				if(powerUp.id == "ShotPowerUp"){ this.showFeedBack("SHOT!"); }
				if(powerUp.id == "RocketPowerUp"){ this.showFeedBack("ROCKETS!"); }
				if(powerUp.id == "HomingPowerUp"){ this.showFeedBack("HOMING!"); }
			} }]
		);
	}

	var configurePlayerShipFactory = function() {
		TopLevel.playerShipFactory.addCallbacksToAction("addInitCallback", [
			{scope:TopLevel.playerData, callback:function(obj){ this.init(obj); } }
		]);

		TopLevel.playerShipFactory.addCallbacksToAction("addDamageReceivedCallback", [
			{scope:TopLevel.playerData			 , callback:function(){ this.powerDownWeapon(); 		 } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(){ this.showFeedBack("POWER DOWN"); } }
		]);
		
		TopLevel.playerShipFactory.addCallbacksToAction("addAllDamageReceivedCallback", [
			{scope:TopLevel.playerData, callback:function(){ this.decreaseLives(); } }
		]);

		TopLevel.playerShipFactory.init();
	}

	//All those configuration functions above are executed here.
	createObjectPools();
	createObjectConfigurations();
	createCollisionPairs();
	createAttributesTable();
	createPowerUps();
	createTextFeedback();
	configurePlayerShipFactory();

	var starFactory   = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
	var rocketFactory = new EnemyRocketFactory();

	var ship = TopLevel.playerShipFactory.firstShip(TopLevel.canvas.width/2, TopLevel.canvas.height + 50);

	var w = TopLevel.canvas.width;
	var h = TopLevel.canvas.height;

	var bossArgs = [w/2,-200, ship];
	var bossDrops = {};

	var currentBoss = -1;
	var bosses      = [{name:"Boss_1_A", createNext:false, args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"HPPowerUp"},
					   {name:"Boss_1_B", createNext:false, args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
					   {name:"Boss_1_C", createNext:false, args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"HPPowerUp"},
					   
					   {name:"SubBoss_1", createNext:true , args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
					   {name:"SubBoss_1", createNext:false, args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

					   {name:"Boss_1_D", createNext:false, args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
					   
					   {name:"SubBoss_2", createNext:true , args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
					   {name:"SubBoss_2", createNext:false, args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

					   {name:"Boss_1_E", createNext:false, args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"LivesPowerUp"},
					   
					   {name:"SubBoss_1", createNext:true , args:bossArgs, targetPos:{x:w/2-150, y:h/2-150, time:3}, powerUp:null},
					   {name:"SubBoss_1", createNext:true , args:bossArgs, targetPos:{x:w/2+150, y:h/2-150, time:3}, powerUp:null},
					   {name:"SubBoss_3", createNext:false, args:bossArgs, targetPos:{x:w/2,     y:h/2-200, time:3}, powerUp:null},

					   {name:"Boss_1_F", createNext:false , args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null}];

	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 40, 200, 350, 800, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 30, 200, 350, 800, 10, true , "WeaponPowerUp,SpeedPowerUp");
	
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, 100, 500, 600, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, 100, 500, 600, 10, true,  "WeaponPowerUp,SpeedPowerUp");
	
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, 100, 500, 500, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, 100, 500, 500, 10, true,  "WeaponPowerUp,SpeedPowerUp");

	/*var boss = TopLevel.container.add("Boss_1_D", [TopLevel.canvas.width/2, -200, ship]);		
	
	boss.gotoPosition(TopLevel.canvas.width/2, TopLevel.canvas.height/2-100, 3, function(){
		this.startAttack();
	}, null, true);*/

	rocketFactory.onWaveComplete = FuntionUtils.bindScope(this, function(){
		var bossesCreated = 0;

		do{
			currentBoss++;
			bossesCreated++;
			currentBoss = currentBoss >= bosses.length ? 0 : currentBoss;

			var bossInit = bosses[currentBoss];

			debugger;

			var boss = TopLevel.container.add(bossInit.name, bossInit.args);		

			bossDrops[boss.typeId] = bosses[currentBoss].powerUp;

			boss.gotoPosition(bossInit.targetPos.x, bossInit.targetPos.y, bossInit.targetPos.time, function(){
				this.startAttack();
			}, null, true);

			boss.addOnDestroyCallback(this, function(obj){
				TopLevel.powerUpFactory.create(obj.x, obj.y, bossDrops[obj.typeId], 1, false);
				
				bossesCreated--;
				if(bossesCreated <= 0){
					rocketFactory.start();
				}
			});
			
		}while(bossInit.createNext)

	});
	
	starFactory.start();
	rocketFactory.start();

	//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.A, FuntionUtils.bindScope(this, function(){

	//}));

	/*ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.D, FuntionUtils.bindScope(this, function(){
		TopLevel.powerUpFactory.create(TopLevel.canvas.width/2, TopLevel.canvas.height/2, "MultiWeaponPowerUp", 1, true);
	}));*/

	/*ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.D, FuntionUtils.bindScope(this, function(){
		TopLevel.powerUpFactory.create(TopLevel.canvas.width/2, TopLevel.canvas.height/2, "LivesPowerUp", 1, true);
	}));*/

	var frameRequest;
	
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback) {
			return window.setTimeout(callback, 1000 / 60);;
		};
	}

	if (!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}

	frameRequest = window.requestAnimationFrame(mainLoop);

	function mainLoop() {
		var now = Date.now();
		var dt = now - TopLevel.lastUpdate;
		TopLevel.lastUpdate = now;

		if(dt < 30){
			TopLevel.container.update(dt/1000);
			TopLevel.container.draw();
		}
		
		frameRequest = window.requestAnimationFrame(mainLoop);
	}

	$(window).on("blur", function(event) {
		
		if(TopLevel.blur){
			TopLevel.blur = false;
			TopLevel.focus = true;

			TimeOutFactory.pauseAllTimeOuts();
			
			TopLevel.tweensTimeLine = TimelineLite.exportRoot();
			TopLevel.tweensTimeLine.pause();

			window.cancelAnimationFrame(frameRequest);
		}
		
	});

	$(window).on("focus", function(event) {
		if(TopLevel.focus){
			TopLevel.blur = true;
			TopLevel.focus = false;

			TimeOutFactory.resumeAllTimeOuts();
			TopLevel.tweensTimeLine.resume();
			frameRequest = window.requestAnimationFrame(mainLoop);
		}
	});
});
