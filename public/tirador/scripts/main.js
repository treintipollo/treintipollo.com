var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	lastUpdate: Date.now(),
	
	initialized: false,
	showSplash:true,
	hideSplash:true,
	setUpGame:null,

	focus: true,
	blur: true,
	
	tweensTimeLine: null,

	resetGame: function() {
		this.showSplash  = true;
		this.hideSplash  = true;

		this.rocketFactory.stop();
		this.starFactory.stop();

		this.container.removeAll();
		
		this.playerData.softReset();

		this.setUpGame();
	},

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

			if(!p) return;

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
		textArgs:[],

		showFeedBack: function(name, x, y){
			this.textArgs[0] = x;
			this.textArgs[1] = y;
			
			return TopLevel.container.add(name, this.textArgs);
		}
	},

	weaponFactory: {
		SHOT_WEAPON		    : 0,
		ROCKET_WEAPON	    : 1,
		CLONE_SHOT_WEAPON   : 2,
		HOMING_ROCKET_WEAPON: 3,

		weaponsTypes: [
			function(level, user){ return new ShotWeapon(this.SHOT_WEAPON, "Shot", level, user, true, true, "Small_Shot", "Big_Shot"); }, 
			function(level, user){ return new RocketWeapon(this.ROCKET_WEAPON, "Rocket", level, user, true); },
			function(level, user){ return new ShotWeapon(this.CLONE_SHOT_WEAPON, "Clone", level, user, false, false, "Clone_Small_Shot", "Clone_Big_Shot"); },
			function(level, user){ return new HomingRocketWeapon(this.HOMING_ROCKET_WEAPON, "Homing", level, user, true); }
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

	playerData: Object.make(Delegate.prototype, {
		constructor    : Delegate,

		INIT 			  :"init",
		SOFT_RESET        :"softReset",
		RESET 			  :"reset",
		WEAPON_INIT       :"weaponInitialized",
		WEAPON_SET        :"weaponSet",
		WEAPON_POWER_UP   :"weaponPowerUp",
		WEAPON_POWER_DOWN :"weaponPowerDown",
		SPEED_UP          :"speedUp",
		LIVES_UP          :"increaseLives",
		HP_UP             :"increaseHp",
		HP_DOWN           :"decreaseHp",
		LIVES_DOWN        :"decreaseLives",
		STAGE_UP          :"increaseStage",

		weapon         : null,
		lastWeaponType : 0,
		speedPowerUps  : 0,
		ship           : null,
		speed          : 0,
		lives          : 1, 
		gameStage      : 0,

		livesReset     : 1,
		speedReset     : 125,
		speedCap	   : 170,
		weaponDivider  : 4,
		speedDivider   : 4,

		init: function(ship) {
			this.reset();

			this.ship = ship;
			this.initWeapon();

			ship.addHpDeminishedCallback(this, function(other){ this.execute(this.HP_DOWN, this); });
			ship.addDamageReceivedCallback(this, function(other){ this.execute(this.HP_DOWN, this); });   		
			
			this.execute(this.INIT, this);
		},

		hasLives: function() { return this.lives >= 0 },

		increaseStage: function () { 
			this.gameStage++; 
			this.execute(this.STAGE_UP, this);
		},

		softReset: function() {
			this.speed  		= this.speedReset;
			this.speedPowerUps  = 0;
			this.lives          = this.livesReset;
			this.gameStage      = 0;

			if(this.weapon) this.weapon.destroy();

			this.lastWeaponType = 0;
			this.initWeapon();

			this.execute(this.SOFT_RESET, this);
		},

		reset: function() {
			this.speed  		= this.speedReset;
			this.speedPowerUps  = 0;
			if(this.weapon) this.weapon.destroy();

			this.execute(this.RESET, this);
		},		

		initWeapon: function() {
			this.weapon = TopLevel.weaponFactory.getInitializedWeapon(this.lastWeaponType, 0, this.ship, this.weapon);
			//this.weapon = TopLevel.weaponFactory.getInitializedWeapon(this.lastWeaponType, 8, this.ship, this.weapon);
			this.lastWeaponType = this.weapon.getId();
			this.ship.weapon    = this.weapon;

			this.execute(this.WEAPON_INIT, this);
		},

		setWeapon: function(weaponId) {
			if(this.lastWeaponType == weaponId){
				this.powerUpWeapon();
			}else{
				this.weapon         = TopLevel.weaponFactory.getInitializedWeapon(weaponId, this.weapon.getLevel(), this.ship, this.weapon);
				this.lastWeaponType = this.weapon.getId();
				this.ship.weapon    = this.weapon;

				this.execute(this.WEAPON_SET, this);
			}
		},

		powerUpWeapon  : function() { 
			this.weapon.powerUp();
			this.ship.weapon = this.weapon;   
			this.execute(this.WEAPON_POWER_UP, this);
		},

		powerDownWeapon: function() {
			this.weapon.powerDown(); 
			this.ship.weapon = this.weapon;
			this.execute(this.WEAPON_POWER_DOWN, this); 
		},
		
		increaseSpeed: function() { 
			if(this.speed < this.speedCap){
				this.speed += 10; 
				this.speedPowerUps++;
				this.execute(this.SPEED_UP, this);
			}
		},
		
		increaseLives: function() { 
			this.lives++; 
			this.execute(this.LIVES_UP, this);
		},

		decreaseLives: function() { 
			TopLevel.powerUpFactory.addToBulkCreate("WeaponPowerUp", Math.floor(this.weapon.getLevel()/this.weaponDivider) );
			TopLevel.powerUpFactory.addToBulkCreate("SpeedPowerUp", Math.floor(this.speedPowerUps/this.speedDivider) );
			TopLevel.powerUpFactory.createBulk(this.ship.x, this.ship.y, true);

			this.reset();
			this.lives--; 
			this.execute(this.LIVES_DOWN, this);
		},	

		increaseHP: function() {
			this.ship.recoverHP(5);
			this.execute(this.HP_UP, this);
		},
	}),

	playerShipFactory: {
		playerShipArguments: [],
		recreateTimer: null,
		playerActionsCallbacks: {},
		firstPosX: 0, 
		firstPosY: 0,

		init: function(onShipRecreated) {
			this.recreateTimer = TimeOutFactory.getTimeOut(0, 1, this, function(){ 
				var allLivesLost = onShipRecreated();

				if(allLivesLost){
					this.createPlayerShip(this.firstPosX, this.firstPosY);
				}else{
					this.createPlayerShipNoArgs(); 
				}
			});
		},

		firstShip: function(x, y){
			this.firstPosX = x;
			this.firstPosY = y;

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
	},

	hudController: {
		updateWeapon : function(playerData) {
			var name  = playerData.ship.weapon.getName();
			var level = playerData.ship.weapon.getLevel() + 1;
			$("#weapon").text( (name + " x " + level).toString() );
		},
		
		updateLives : function(playerData) {
			var lives = playerData.lives;
			$("#lives").text( "Lives x " + lives.toString() );
		},

		updateSpeed : function(playerData) {
			var speed = playerData.speedPowerUps + 1;
			$("#speed").text( "Speed x " + speed.toString() );
		},

		updateStage : function(playerData) {
			var stage = playerData.gameStage + 1;
			$("#level").text( (" - " + stage + " - ").toString() );
		},

		updateHP : function(playerData) {
			var totalHp   = playerData.ship.getTotalHp();
			var currentHp = playerData.ship.getCurrentHp();

			var domHp    = $(".hp");
			var domMeter = $(".hp>span");

			var totalWidth = domHp.width();

			var hpPercentage    = currentHp / totalHp;
			var meterPercentage = totalWidth * hpPercentage;

			domMeter.stop(true);
			domMeter.animate({ width:meterPercentage }, 500);
		},

		init: function(playerData){
			playerData.add(playerData.INIT, this, function(playerData){
				this.updateWeapon(playerData);
				this.updateLives(playerData);
				this.updateSpeed(playerData);
				this.updateStage(playerData);
				this.updateHP(playerData);
			});
			playerData.add(playerData.WEAPON_INIT, this, function(playerData){
				this.updateWeapon(playerData);
			});
			playerData.add(playerData.WEAPON_SET, this, function(playerData){
				this.updateWeapon(playerData);
			});
			playerData.add(playerData.WEAPON_POWER_UP, this, function(playerData){
				this.updateWeapon(playerData);
			});
			playerData.add(playerData.WEAPON_POWER_DOWN, this, function(playerData){
				this.updateWeapon(playerData);
			});
			playerData.add(playerData.SPEED_UP, this, function(playerData){
				this.updateSpeed(playerData);
			});
			playerData.add(playerData.LIVES_UP, this, function(playerData){
				this.updateLives(playerData);	
			});
			playerData.add(playerData.LIVES_DOWN, this, function(playerData){
				this.updateHP(playerData);	
			});
			playerData.add(playerData.HP_UP, this, function(playerData){
				this.updateHP(playerData);
			});
			playerData.add(playerData.HP_DOWN, this, function(playerData){
				this.updateHP(playerData);
			});
			playerData.add(playerData.STAGE_UP, this, function(playerData){
				this.updateStage(playerData);
			});
		}
	},

	rocketFactory: null,
	starFactory:null
};
window.TopLevel = TopLevel;
	
//BUG: Se cuelga cuando perdes contra el boss con hijos que disparan laser
//BUG: Make screen smaller and wider.

//TODO: Mini story sequence.
		//Intro.
		//Ending.

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
	   		//Homing Amount (locked and unlocked)
	   			//Implement that difference.
	   			//Homing rockets explosion size.
	   		//Shot speed and amount.
	   		//Charge shot charging speed.


//TODO: Optimizations
	//TODO: Reduce memory Footprint.
			//Reduce object pool sizes.
			//Reduce amount of objects created to cache data.
	//TODO: Optimize drawing method.
			//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
			//This will not be possible where procedural animations take place. Like the eye of the Boss or its tentacles. But things like Rockets and particles could be cached.
	//TODO: //I Could setup the GameObjects in a way in which I can specify if they need an update or not. 
			//That could reduce method calls greatly, since a lot of GameObjects don't use update at all.
			//Same could be done with drawing, as some GameObjects could only exist as data containers.

//TODO: Use TimeOutFactory in ArrowKeyHandler.

//TODO:Single Utility Object, so that the global scope has less litter.

//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
		//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.

$(function(){
	var frameRequest, mainLoop;

	//Setting up the onBlur and onFocus events.
	//If the game is not initialized because it has no focus, these will be created anyway.
	//Once the document gains fucos, it will create the game, if it hasn't so already.
	var onBlur = function(event){
		if(TopLevel.blur){
			TopLevel.blur = false;
			TopLevel.focus = true;

			TimeOutFactory.pauseAllTimeOuts();
			
			TopLevel.tweensTimeLine = TimelineLite.exportRoot();
			TopLevel.tweensTimeLine.pause();

			window.cancelAnimationFrame(frameRequest);
		}
	}

	var onFocus = function(event){
		//In the case the game is not already created when the document gains focus for the first time, it is created here.
		if(!TopLevel.initialized){
			creation();
		}else{
			if(TopLevel.focus){
				TopLevel.blur = true;
				TopLevel.focus = false;

				TimeOutFactory.resumeAllTimeOuts();

				TopLevel.tweensTimeLine.resume();
				
				frameRequest = window.requestAnimationFrame(mainLoop);
			}
		}
	}

	$(window).on("blur", onBlur);
	$(window).on("focus", onFocus);

	//From here on, are all the creation functions.
	//--------------------------------------------

	//This is the main creation function, the game officially starts when this is called.
	var creation = function() {
		TopLevel.initialized = true;

		TopLevel.canvas    		 = document.getElementById("game");
		TopLevel.context   		 = TopLevel.canvas.getContext("2d");
		TopLevel.container 	     = new ObjectsContainer(TopLevel.context);
		TopLevel.rocketFactory   = new EnemyRocketFactory();
		TopLevel.starFactory     = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
		
		ArrowKeyHandler.init();

		//GameObject pooling method
		createObjectPools();
		
		//All things related to GameObject configuration
		createObjectConfigurations();
		createCollisionPairs();
		createAttributesTable();
		createPowerUps();
		configurePlayerShipFactory();

		//This takes care of updating the HUD
		TopLevel.hudController.init(TopLevel.playerData);

		//The reference to the player ship held in PlayerData
		TopLevel.playerData.ship = TopLevel.playerShipFactory.firstShip(TopLevel.canvas.width/2, TopLevel.canvas.height + 50);
		//Used to reset the game when needed.
		TopLevel.setUpGame = setUpGame;

		//This is the game basic logic. It takes care of creating the baddies in the order specified.
		setUpGame();

		//This is the main update loop. It uses requestAnimationFrame 
		setUpGameLoop();
	}

	var setUpGame = function() {	
		var starFactory   = TopLevel.starFactory;
		var rocketFactory = TopLevel.rocketFactory;

		var ship = TopLevel.playerData.ship;

		var w = TopLevel.canvas.width;
		var h = TopLevel.canvas.height;

		var bossArgs = [w/2,-200, ship];
		var bossDrops = {};

		var currentBoss = -1;
		// var bosses      = [{name:"Boss_1_A", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null},
		// 				   {name:"Boss_1_B", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"HPPowerUp"},
		// 				   {name:"Boss_1_C", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
						   
		// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
		// 				   {name:"SubBoss_1", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

		// 				   {name:"Boss_1_D", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
						   
		// 				   {name:"SubBoss_2", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
		// 				   {name:"SubBoss_2", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

		// 				   {name:"Boss_1_E", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"LivesPowerUp"},
						   
		// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-150, y:h/2-150, time:3}, powerUp:null},
		// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+150, y:h/2-150, time:3}, powerUp:null},
		// 				   {name:"SubBoss_3", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2,     y:h/2-200, time:3}, powerUp:null},

		// 				   {name:"Boss_1_F", createNext:false , intro:"warning", winMessage:"complete", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null}];
		
		var bosses      = [{name:"Boss_1_B", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
						   {name:"Boss_1_C", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},
						   
						   {name:"Boss_1_D", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"HPPowerUp"},
						   {name:"Boss_1_E", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"LivesPowerUp"},
						   
						   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-150, y:h/2-150, time:3}, powerUp:null},
						   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+150, y:h/2-150, time:3}, powerUp:null},
						   {name:"SubBoss_3", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2,     y:h/2-200, time:3}, powerUp:null},

						   {name:"Boss_1_F", createNext:false , intro:"warning", winMessage:"complete", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null}];

		//First Set
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 40, -50, 200, 350, 800, 10, false, "SpeedPowerUp");	
		// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -50, -70, 600, 10, false, "MultiWeaponPowerUp");
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 30, -50, 200, 350, 800, 10, true , "WeaponPowerUp,MultiWeaponPowerUp,SpeedPowerUp");
		
		//Second Set
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
		// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -90, -100, 600, 10, false, "MultiWeaponPowerUp");
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, true,  "WeaponPowerUp,SpeedPowerUp");
		
		//Third Set
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 20, 100, 500, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
		// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -200, -250, 600, 10, false, "MultiWeaponPowerUp");
		// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 500, 500, 10, true,  "WeaponPowerUp,SpeedPowerUp");

		//First Set
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 25, -50, 200, 350, 800, 5, false, "SpeedPowerUp");	
		rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -50, -70, 600, 10, false, "HPPowerUp");
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 25, -50, 200, 350, 800, 5, true , "WeaponPowerUp,MultiWeaponPowerUp");
		
		//Second Set
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
		rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -90, -100, 600, 10, false, "HPPowerUp");
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, true,  "WeaponPowerUp");
		
		//Third Set
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 200, 500, 10, false, "MultiWeaponPowerUp");
		rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -200, -250, 600, 10, false, "HPPowerUp");
		rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 500, 500, 10, true,  "WeaponPowerUp,SpeedPowerUp");

		rocketFactory.onWaveComplete = FuntionUtils.bindScope(this, function(){
			var bossesCreated = 0;

			do{
				currentBoss++;
				bossesCreated++;
				currentBoss = currentBoss >= bosses.length ? 0 : currentBoss;

				var bossInit = bosses[currentBoss];

				if(bossInit.intro == "none"){

					var boss = TopLevel.container.add(bossInit.name, bossInit.args);		

					bossDrops[boss.typeId] = bosses[currentBoss].powerUp;

					boss.gotoPosition(bossInit.targetPos.x, bossInit.targetPos.y, bossInit.targetPos.time, function(){
						this.startAttack();
					}, null, true);

					boss.addOnDestroyCallback(this, function(obj){
						TopLevel.powerUpFactory.create(obj.x, obj.y, bossDrops[obj.typeId], 1, false);
						
						bossesCreated--;
						if(bossesCreated <= 0){
							TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.winMessage, -200, TopLevel.canvas.height/2 );

							TopLevel.playerData.increaseStage();

							rocketFactory.start();
						}
					});

				}else{
					var intro = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.intro, -200, TopLevel.canvas.height/2 );

					intro.addOnDestroyCallback(this, function(obj){
						
						var boss = TopLevel.container.add(bossInit.name, bossInit.args);		

						bossDrops[boss.typeId] = bosses[currentBoss].powerUp;

						boss.gotoPosition(bossInit.targetPos.x, bossInit.targetPos.y, bossInit.targetPos.time, function(){
							this.startAttack();
						}, null, true);

						boss.addOnDestroyCallback(this, function(obj){
							TopLevel.powerUpFactory.create(obj.x, obj.y, bossDrops[obj.typeId], 1, false);
							TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.winMessage, -200, TopLevel.canvas.height/2 );

							TopLevel.playerData.increaseStage();

							rocketFactory.start();
						});
					});
				}
				
			}while(bossInit.createNext)

		});
		
		starFactory.start();
	}

	var setUpGameLoop = function() {
		mainLoop = function() {
			var now = Date.now();
			var dt = now - TopLevel.lastUpdate;
			TopLevel.lastUpdate = now;

			if(dt < 30){
				TopLevel.container.update(dt/1000);
				TopLevel.container.draw();
			}
			
			frameRequest = window.requestAnimationFrame(mainLoop);
		}

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
	}

	var createObjectPools = function(){
		//This Pools can not be reduced by means of clever coding.
		//-------------------------------------------------------
		TopLevel.container.createTypePool("Ship"	 , Ship		, 1);
		TopLevel.container.createTypePool("CloneShip", CloneShip, 10);
		TopLevel.container.createTypePool("CargoShip", CargoShip, 1);

		TopLevel.container.createTypePool("Star"	 , Star, 30);
		TopLevel.container.createTypePool("Shot"     , Shot, 70);
		TopLevel.container.createTypePool("Target"      , Target, 6);
		TopLevel.container.createTypePool("HomingTarget", HomingTarget, 6);
		TopLevel.container.createTypePool("Explosion"    , Explosion, 40);
		TopLevel.container.createTypePool("Debry"        , Debry, 30);

		TopLevel.container.createTypePool("Boss_1"    	   , Boss_1, 4);
		TopLevel.container.createTypePool("Tentacle"   	   , Tentacle, 20);
		TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);
		
		TopLevel.container.createTypePool("EnemyRocket", EnemyRocket, 30);
		TopLevel.container.createTypePool("Fireball"      , Fireball, 40);
		TopLevel.container.createTypePool("MultiShot"     , MultiShot, 20);

		TopLevel.container.createTypePool("Line"          , Line, 3);
		TopLevel.container.createTypePool("PercentageLine", PercentageLine, 66);
		TopLevel.container.createTypePool("Text"	      , ConcreteText, 6);
		TopLevel.container.createTypePool("WhiteFlash"    , WhiteFlash, 2);

		TopLevel.container.createTypePool("Splash"    , Splash, 1);

		//The Pools below could be reduced drastically with a little extra work.
		//---------------------------------------------------------------------
		//Provided all of this is implemented It would reduce pools from 5456 objects in memory to 2533. That's about a 53% memory footprint reduction!
		//A little less since I would have to create additional configuration objects, but still, probably over 50%.

		//This pool can be reduced drastically by implementing line Vs. Circle and line Vs. Polygon colision detection
		//Also, Boss beam would look better as a result, and the code in StraightBeam would be slightly simplified. From 200 objects to maybe 3. That's like a 98%!
		TopLevel.container.createTypePool("BeamCollider"   , BeamCollider, 200);
		
		//All the things below can be solved by extending the configurationSystem, to be able to receive an object with initialization arguments.

		//This looks like a place where I can reduce the pool size, significantly. From 120 to 20 Objects. A Wooping 84%!
		//I would need to have a base Rocket, which receives the prototypes for Small, Large and Cluster for drawing aswell as Swarm and Homing for behaviour.
		TopLevel.container.createTypePool("SmallSwarmRocket"  , SmallSwarmRocket  , 20);
		TopLevel.container.createTypePool("LargeSwarmRocket"  , LargeSwarmRocket  , 20);
		TopLevel.container.createTypePool("ClusterSwarmRocket", ClusterSwarmRocket, 20);
		TopLevel.container.createTypePool("SmallHomingRocket"  , SmallHomingRocket  , 20);
		TopLevel.container.createTypePool("LargeHomingRocket"  , LargeHomingRocket  , 20);
		TopLevel.container.createTypePool("ClusterHomingRocket", ClusterHomingRocket, 20);
		//This pools could definetely be reduced. From 4340 objects to maybe 2500. That's like a 42% decrease!
		//It would take quite a bit of work because all the particle structure is a kind of shaky.
		TopLevel.container.createTypePool("ExhaustParticle"    , ExhaustParticle, 500);
		TopLevel.container.createTypePool("ShotChargeParticle" , ShotChargeParticle, 40);
		TopLevel.container.createTypePool("BurstParticle"      , BurstParticle, 500);
		TopLevel.container.createTypePool("BurstParticleRadius", BurstParticleRadius, 300);
		TopLevel.container.createTypePool("StraightParticle"   , StraightParticle, 3000);
		//Small gain, but instead of pooling 10 objects I could pool only five if I used MultiPowerUp for all my powerUp needs.
		TopLevel.container.createTypePool("ShotPowerUp"  		, ShotPowerUp, 1);
		TopLevel.container.createTypePool("RocketPowerUp"		, RocketPowerUp, 1);
		TopLevel.container.createTypePool("HomingRocketPowerUp" , HomingRocketPowerUp, 1);
		TopLevel.container.createTypePool("WeaponPowerUp"		, WeaponPowerUp, 2);
		TopLevel.container.createTypePool("HPPowerUp"    		, HPPowerUp, 1);
		TopLevel.container.createTypePool("SpeedPowerUp" 		, SpeedPowerUp, 2);
		TopLevel.container.createTypePool("LivesPowerUp" 		, LivesPowerUp, 1);
		TopLevel.container.createTypePool("MultiPowerUp" 		, MultiPowerUp, 2);
		//Insignificant gain possible here. Using a method similar that to the rockets. 50% reduction. Out of 6 objects is not that much :/ 
		TopLevel.container.createTypePool("PowerShot"      , PowerShot, 1);
		TopLevel.container.createTypePool("PowerShotSine"  , PowerShotSine, 2);
		TopLevel.container.createTypePool("PowerShotCircle", PowerShotCircle, 3);
	}

	var createObjectConfigurations = function() {
		//This index denotes de main layer. It is convenient for it to be larger than 0 because that way there can be things that are on top of it.
		//GameObjects with smaller layer indexes will be drawn last, showing up as on top of other GameObjects with higher layer indexes.
		//Smallest layer index is 0.
		var middleLayerIndex = 2;

		//Configurations
		//Collidable GameObjects
		TopLevel.container.createTypeConfiguration("Ship", "Ship", middleLayerIndex).setCollisionId("Ship").saveOnReset();

		TopLevel.container.createTypeConfiguration("Splash", "Splash", middleLayerIndex);

		TopLevel.container.createTypeConfiguration("Small_Shot"      , "Shot", middleLayerIndex+1).setCollisionId("Shot").setArgs({big:false});
		TopLevel.container.createTypeConfiguration("Big_Shot"        , "Shot", middleLayerIndex+1).setCollisionId("Shot").setArgs({big:true});
		TopLevel.container.createTypeConfiguration("Clone_Small_Shot", "Shot", middleLayerIndex+1).setCollisionId("CloneShot").setArgs({big:false});
		TopLevel.container.createTypeConfiguration("Clone_Big_Shot"  , "Shot", middleLayerIndex+1).setCollisionId("CloneShot").setArgs({big:true});

		TopLevel.container.createTypeConfiguration("Single_Power_Shot_1", "PowerShot"	   , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_2", "PowerShot"	   , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_3", "PowerShot"	   , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_1", "PowerShotSine"  , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_2", "PowerShotSine"  , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_3", "PowerShotSine"  , middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_1", "PowerShotCircle", middleLayerIndex).setCollisionId("PowerShot");	
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_2", "PowerShotCircle", middleLayerIndex).setCollisionId("PowerShot");
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_3", "PowerShotCircle", middleLayerIndex).setCollisionId("PowerShot");

		TopLevel.container.createTypeConfiguration("SmallSwarmRocket"   , "SmallSwarmRocket"   , middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("LargeSwarmRocket"   , "LargeSwarmRocket"   , middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("ClusterSwarmRocket" , "ClusterSwarmRocket" , middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("SmallHomingRocket"  , "SmallHomingRocket"  , middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("LargeHomingRocket"  , "LargeHomingRocket"  , middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("ClusterHomingRocket", "ClusterHomingRocket", middleLayerIndex+1).setCollisionId("Rocket");
		TopLevel.container.createTypeConfiguration("Debry"			    , "Debry"	  		   , middleLayerIndex+2).setCollisionId("Rocket");
		
		TopLevel.container.createTypeConfiguration("ShotPowerUp"  , "ShotPowerUp"  , middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("RocketPowerUp", "RocketPowerUp", middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("WeaponPowerUp", "WeaponPowerUp", middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("HPPowerUp"    , "HPPowerUp"    , middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("SpeedPowerUp" , "SpeedPowerUp" , middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("LivesPowerUp" , "LivesPowerUp" , middleLayerIndex).setCollisionId("PowerUp");
		TopLevel.container.createTypeConfiguration("MultiPowerUp" , "MultiPowerUp" , middleLayerIndex).setCollisionId("PowerUp");

		TopLevel.container.createTypeConfiguration("CloneShip"			, "CloneShip"  , middleLayerIndex+2).setCollisionId("Common_Baddy");
		TopLevel.container.createTypeConfiguration("CargoShip"			, "CargoShip"  , middleLayerIndex+2).setCollisionId("Common_Baddy");

		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_1", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:7 } );
		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_2", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:8 } );
		TopLevel.container.createTypeConfiguration("Small_EnemyRocket_3", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:9 } );
		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_1"  , "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:11} );
		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_2"  , "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:11} );
		TopLevel.container.createTypeConfiguration("Mid_EnemyRocket_3"  , "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:12} );
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_1", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:14} );
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_2", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:14} );
		TopLevel.container.createTypeConfiguration("Large_EnemyRocket_3", "EnemyRocket", middleLayerIndex+3).setCollisionId("Common_Baddy").setArgs( {mainDim:15} );

		TopLevel.container.createTypeConfiguration("Fireball" 			, "Fireball"   , middleLayerIndex).setCollisionId("Bullet_Baddy");
		TopLevel.container.createTypeConfiguration("MultiShot"			, "MultiShot"  , middleLayerIndex).setCollisionId("Bullet_Baddy");

		TopLevel.container.createTypeConfiguration("Boss_1_A", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Boss_1_B", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Boss_1_C", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Boss_1_D", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Boss_1_E", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Boss_1_F", "Boss_1", middleLayerIndex+2).setCollisionId("Boss_1").setAddMode( ObjectsContainer.UNSHIFT );

		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Beam_1"  , "Boss_1", middleLayerIndex).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_1", "Boss_1", middleLayerIndex).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Sniper_2", "Boss_1", middleLayerIndex).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_1" , "Boss_1", middleLayerIndex).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_Multi_2" , "Boss_1", middleLayerIndex).setCollisionId("Boss_1");

		TopLevel.container.createTypeConfiguration("SubBoss_1", "Boss_1", middleLayerIndex+1).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("SubBoss_2", "Boss_1", middleLayerIndex+1).setCollisionId("Boss_1");
		TopLevel.container.createTypeConfiguration("SubBoss_3", "Boss_1", middleLayerIndex+1).setCollisionId("Boss_1");

		TopLevel.container.createTypeConfiguration("BeamCollider", "BeamCollider", middleLayerIndex).setCollisionId("BeamCollider");

		//-------------------------------------------------------
		//-------------------------------------------------------
		//GameObjects with non collidable counterparts
		TopLevel.container.createTypeConfiguration("TentacleSegment_Collide", "TentacleSegment", middleLayerIndex+3).setCollisionId("TentacleSegment").setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("HomingTarget"			, "HomingTarget"   , middleLayerIndex).setCollisionId("Target").saveOnReset();
		TopLevel.container.createTypeConfiguration("Explosion_Damage"		, "Explosion"	   , middleLayerIndex).setCollisionId("Rocket");
		
		//GameObjects with collidable counterparts
		TopLevel.container.createTypeConfiguration("TentacleSegment_Show", "TentacleSegment", middleLayerIndex+3).setAddMode( ObjectsContainer.UNSHIFT );
		TopLevel.container.createTypeConfiguration("Explosion_Effect"	 , "Explosion"		, middleLayerIndex);
		TopLevel.container.createTypeConfiguration("Target"      		 , "Target"   		, middleLayerIndex).saveOnReset();

		//-------------------------------------------------------
		//-------------------------------------------------------
		//Visual Only GameObjects
		TopLevel.container.createTypeConfiguration("Tentacle"  	 , "Tentacle", middleLayerIndex+3).setAddMode( ObjectsContainer.UNSHIFT ).setArgs({ minLength:4 });
		TopLevel.container.createTypeConfiguration("WeakTentacle", "Tentacle", middleLayerIndex+3).setAddMode( ObjectsContainer.UNSHIFT ).setArgs({ minLength:4 });
		TopLevel.container.createTypeConfiguration("LongTentacle", "Tentacle", middleLayerIndex+3).setAddMode( ObjectsContainer.UNSHIFT ).setArgs({ minLength:4 });
		TopLevel.container.createTypeConfiguration("BabyTentacle", "Tentacle", middleLayerIndex+1).setAddMode( ObjectsContainer.UNSHIFT ).setArgs({ minLength:4 });
		
		TopLevel.container.createTypeConfiguration("Star"		, "Star"	   , middleLayerIndex+4).saveOnReset();
		TopLevel.container.createTypeConfiguration("WhiteFlash"	, "WhiteFlash" , middleLayerIndex);

		TopLevel.container.createTypeConfiguration("pUp"    , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"POWER UP!" , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#FFFF00", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("pDown"  , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"POWER DOWN", font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#777777", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("shot"   , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"SHOT!"     , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("rockets", "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"ROCKETS!"  , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#0000FF", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("homing" , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"HOMING!"   , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#00FF00", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("speed"  , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"SPEED UP!" , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#00FF00", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("health" , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"HEALTH UP!", font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:1, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("1up"    , "Text", middleLayerIndex).setArgs({ tProto:PowerUpText.prototype, text:"1-UP!"     , font:"Russo One", size:20, fill:"#FFFFFF", stroke:"#777777", lineWidth:1, align:"center", baseline:"middle" });

		TopLevel.container.createTypeConfiguration("warning" , "Text", middleLayerIndex-1).setArgs({ introSpeed:0.7, tProto:WarningText.prototype, text:"WARNING!", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("boom"    , "Text", middleLayerIndex-1).setArgs({ introSpeed:0.5, tProto:WarningText.prototype, text:"BOOM! :D", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("nice"    , "Text", middleLayerIndex-1).setArgs({ introSpeed:0.7, tProto:WarningText.prototype, text:"NICE!", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#0000FF", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("complete", "Text", middleLayerIndex-1).setArgs({ introSpeed:0.7, tProto:WarningText.prototype, text:"COMPLETE!", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("gameover", "Text", middleLayerIndex-1).setArgs({ introSpeed:0.7, tProto:WarningText.prototype, text:"DEAD MEAT", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#FF0000", lineWidth:3, align:"center", baseline:"middle" });

		TopLevel.container.createTypeConfiguration("space"    , "Text", middleLayerIndex).setArgs({ tProto:GameText.prototype, text:"SPACE", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#777777", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("shooting" , "Text", middleLayerIndex).setArgs({ tProto:GameText.prototype, text:"SHOOTING", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#777777", lineWidth:3, align:"center", baseline:"middle" });
		TopLevel.container.createTypeConfiguration("adventure", "Text", middleLayerIndex).setArgs({ tProto:GameText.prototype, text:"ADVENTURE", font:"Russo One", size:60, fill:"#FFFFFF", stroke:"#777777", lineWidth:3, align:"center", baseline:"middle" });

		TopLevel.container.createTypeConfiguration("Line"		   , "Line"	   		 , middleLayerIndex);
		TopLevel.container.createTypeConfiguration("PercentageLine", "PercentageLine", middleLayerIndex);
		
		TopLevel.container.createTypeConfiguration("ExhaustParticle"    , "ExhaustParticle"    , middleLayerIndex+1);
		TopLevel.container.createTypeConfiguration("ShotChargeParticle" , "ShotChargeParticle" , middleLayerIndex);
		TopLevel.container.createTypeConfiguration("BurstParticle"      , "BurstParticle"      , middleLayerIndex);
		TopLevel.container.createTypeConfiguration("BurstParticle_Blood", "BurstParticle"      , middleLayerIndex+3);	
		TopLevel.container.createTypeConfiguration("StraightParticle"   , "StraightParticle"   , middleLayerIndex);
		TopLevel.container.createTypeConfiguration("BurstParticleRadius", "BurstParticleRadius", middleLayerIndex);

		//-------------------------------------------------------
		//-------------------------------------------------------
		//Boss Configurations
		Boss_1_ConfigurationGetter.createConfigurations();
	}
	
	var createCollisionPairs = function(){
		//Collision pairs
		TopLevel.container.addCollisionPair("Ship", "PowerUp");
		TopLevel.container.addCollisionPair("Ship", "BeamCollider");
		TopLevel.container.addCollisionPair("Ship", "Common_Baddy");
		TopLevel.container.addCollisionPair("Ship", "Bullet_Baddy");
		TopLevel.container.addCollisionPair("Ship", "Boss_1");
		TopLevel.container.addCollisionPair("Ship", "TentacleSegment");
		
		TopLevel.container.addCollisionPair("Shot", "Common_Baddy");		
		TopLevel.container.addCollisionPair("Shot", "Boss_1");		
		TopLevel.container.addCollisionPair("Shot", "TentacleSegment");
		
		TopLevel.container.addCollisionPair("PowerShot", "Common_Baddy");
		TopLevel.container.addCollisionPair("PowerShot", "Boss_1");
		TopLevel.container.addCollisionPair("PowerShot", "TentacleSegment");
		
		TopLevel.container.addCollisionPair("Rocket", "Common_Baddy");
		TopLevel.container.addCollisionPair("Rocket", "Boss_1");
		TopLevel.container.addCollisionPair("Rocket", "TentacleSegment");
		
		TopLevel.container.addCollisionPair("Target", "Common_Baddy");
		TopLevel.container.addCollisionPair("Target", "Boss_1");		
	}
	
	var createAttributesTable = function(){
		//id, hp, damageReceived, damageDealtMultiplier
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );
		TopLevel.attributesGetter.setAttributes("Ship", 10 , 1 , 10 );

		TopLevel.attributesGetter.setAttributes("CloneShip", 10 , 3 , 10 );
		TopLevel.attributesGetter.setAttributes("CargoShip", 10 , 1 , 10 );

		TopLevel.attributesGetter.setAttributes("Small_Shot", 0 , 0 , 0.5); 
		TopLevel.attributesGetter.setAttributes("Big_Shot"	, 0 , 0 , 0.6);
		TopLevel.attributesGetter.setAttributes("Clone_Small_Shot", 0 , 0 , 3); 
		TopLevel.attributesGetter.setAttributes("Clone_Big_Shot"  , 0 , 0 , 3);  

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

		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10);

		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10); 
		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10); 
		TopLevel.attributesGetter.setAttributes("WeakTentacle", 20, 1, 10);

		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10); 

		TopLevel.attributesGetter.setAttributes("BabyTentacle", 100, 0.1, 10);

		TopLevel.attributesGetter.setAttributes("TentacleSegment_Collide", 1, 0, 5); 
		
		TopLevel.attributesGetter.setAttributes("BeamCollider", 1 , 1 , 1); 
		TopLevel.attributesGetter.setAttributes("Fireball"	  , 0 , 0 , 1); 
		TopLevel.attributesGetter.setAttributes("MultiShot"	  , 0 , 0 , 5);

		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_1", 0, 0, 3);
		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_2", 0, 0, 3);
		TopLevel.attributesGetter.setAttributes("Small_EnemyRocket_3", 2, 2, 3);

		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_1"  , 2, 1, 5);
		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_2"  , 2, 1, 5);
		TopLevel.attributesGetter.setAttributes("Mid_EnemyRocket_3"  , 3, 1, 5);
		
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_1", 4, 1, 10);
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_2", 4, 1, 10);
		TopLevel.attributesGetter.setAttributes("Large_EnemyRocket_3", 5, 1, 10);	
	}
	
	var createPowerUps = function() {
		TopLevel.powerUpFactory.addPowerUpTypes("ShotPowerUp", [ 
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.SHOT_WEAPON); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("shot", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("RocketPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.ROCKET_WEAPON); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("rockets", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]); 

		TopLevel.powerUpFactory.addPowerUpTypes("HomingRocketPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.HOMING_ROCKET_WEAPON); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("homing", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);
		
		TopLevel.powerUpFactory.addPowerUpTypes("WeaponPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.powerUpWeapon(); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("pUp", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("HPPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseHP(); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("health", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("SpeedPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseSpeed(); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("speed", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);

		TopLevel.powerUpFactory.addPowerUpTypes("LivesPowerUp", [
			{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseLives(); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("1up", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
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
				if(powerUp.id == "ShotPowerUp"){ this.showFeedBack("shot", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
				if(powerUp.id == "RocketPowerUp"){ this.showFeedBack("rockets", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
				if(powerUp.id == "HomingPowerUp"){ this.showFeedBack("homing", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
			} }]
		);
	}

	var configurePlayerShipFactory = function() {
		TopLevel.playerShipFactory.addCallbacksToAction("addInitCallback", [
			{scope:TopLevel.playerData, callback:function(obj){ this.init(obj); } }
		]);

		TopLevel.playerShipFactory.addCallbacksToAction("addDamageReceivedCallback", [
			{scope:TopLevel.playerData			 , callback:function(){ this.powerDownWeapon(); } },
			{scope:TopLevel.textFeedbackDisplayer, callback:function(){ this.showFeedBack("pDown", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
		]);
		
		TopLevel.playerShipFactory.addCallbacksToAction("addAllDamageReceivedCallback", [
			{scope:TopLevel.playerData, callback:function(){ 
				this.decreaseLives(); 
				if(!this.hasLives()){
					TopLevel.textFeedbackDisplayer.showFeedBack("gameover", -200, TopLevel.canvas.height/2 );
				}
			} },
		]);

		//Super nasty logic to execute the Splash intro and outro animations :P
		//The good thing is that all this very specific code is kept outside Ship.js
		var splash;

		TopLevel.playerShipFactory.addCallbacksToAction("addInitialPositionReachedCallback", [
			{scope:TopLevel, callback:function(ship){ 

				if(this.showSplash){
					this.showSplash = false;

					splash = this.container.add("Splash", [
						function(){
							ship.addFirstShotCallback(TopLevel, function(ship){
								if(this.hideSplash){
									this.hideSplash = false;
									splash.exit();
									splash = null;
								}
							});
						},
						function(){							
							ship.destroyCallbacks("firstShotDelegate");
							TopLevel.rocketFactory.start();
						}
					]);

					splash.enter();				
				}
			} }
		]);

		TopLevel.playerShipFactory.init(function(){
			if(!TopLevel.playerData.hasLives()){
				TopLevel.resetGame();
				return true;
			}	
			return false;
		});
	}

	//In the case the Game is opened with out focus, like in a browser restart, game will not be created right now.
	//It will be created once the document gains focus
	if(document.hasFocus()){ 
		creation();

		// ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.Z, FuntionUtils.bindScope(this, function() {

		// 	$(".hp>span").data("origWidth", $(".hp>span").width())
		// 	  			 .width(0)
		// 	   			 .animate({ width: $(".hp>span").data("origWidth") }, 1000);

		// }));
	}
});
	
//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.Z, FuntionUtils.bindScope(this, function(){
	//TopLevel.container.add("CargoShip", [100, 100, 10, TopLevel.container]);		
//}));

//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.D, FuntionUtils.bindScope(this, function(){
	//TopLevel.powerUpFactory.create(TopLevel.canvas.width/2-100, TopLevel.canvas.height/2, "MultiWeaponPowerUp", 1, true);
//}));

//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.C, FuntionUtils.bindScope(this, function(){
	//TopLevel.powerUpFactory.create(TopLevel.canvas.width/2+100, TopLevel.canvas.height/2, "MultiWeaponPowerUp", 1, true);
//}));
