var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	
	setUpGame:null,

	attributesGetter: null,

	powerUpFactory: null,
	playerShipFactory: null,
	rocketFactory: null,
	starFactory:null,
	weaponFactory: null,

	playerData: null, 
	hudController:null,
	animationActors: null,

	pools: null,
	attributes: null,
	texts: null,
	configuration: null,
	collisionPairs: null,

	resetGame: function() {
		this.rocketFactory.stop();
		this.starFactory.stop();

		this.playerData.softReset();
		this.container.removeAll();		

		this.animationActors.reset();

		this.setUpGame();
	},

	textFeedbackDisplayer: {
		textArgs:[],

		showFeedBack: function(name, x, y) {
			if(!name)
				return;

			this.textArgs[0] = x;
			this.textArgs[1] = y;
			
			return TopLevel.container.add(name, this.textArgs);
		}
	},


};
window.TopLevel = TopLevel;
	
//TODO: PowerShip
	//Weapon
		//Class stump
		//Implementation details
			//Better feedback when charging
			//Better feedback when charged
			//Implement disable weapon
			//Implement enable weapon

//TODO: Mini story sequence.	
	//Ending.
		//After the last Big Boss, he shows up again.
			//Sequence after transformation and before the final fight.
				// Badguy sets up armour
			//Final Show Down!
				//Can only be damaged by the Super Plasma Beam.
				//Final attack for last piece of health.
					//TODO: 1) Shoot power shot from below (Guy)
					//TODO: 2) Summon mini bosses (Gal)

//TODO: Give End_2_Badguy a slightly different death animation than the one in ship, so it fits better with the ending sequence.

//TODO: Ending sequence
	//Credits Roll
	//Main Actors Roll
	//Badguy shows up again like in the beginning
	//Stop.
	//THE END
	//Thanks for playing.
	//Hope to see you again... IN SPACE!

//TODO: Make different ship drawing.
//TODO: Make male and female ship drawing swapable.
//TODO: Different Boss encounters for Male and Female game.

//More work on the HUD
	//Move things around
	//Add life bar for BadGuy and Big Boss when they show up.


//TODO: Use TimeOutFactory in ArrowKeyHandler.

//TODO: Tweek base damages and damage multipliers. Everything.
	   //Tweek powerup show up ratio.
	   //Tweek boss attacks.
	   //Tweek Bosses themselves.
	   //Tweek power up bonuses.
	   //Tweek weapons
	   		//Rocket Amount
	   		//Homing Amount (locked and unlocked)
	   			//Implement that difference.
	   			//Homing rockets explosion size.
	   		//Shot speed and amount.
	   		//Charge shot charging speed.
	   	//Tweek BadGuy speed
	   		//Make move speed configurable.
	   		//Make a slow and a fast version of each BadGuy type

//Esto no es para este juego.
	//TODO: Simplify GameObject, extend Delegate.
	//TODO: Be able to configure hitArea.
	//TODO: Get a better "inherit" method.
	//TODO:Single Utility Object, so that the global scope has less litter.
	//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
			//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.
//TODO: Optimizations
	//TODO: Reduce memory Footprint.
	//TODO: Optimize drawing method.
			//Cache procedural drawing in memory. Then draw that image in place each frame, instead of redrawing proceduraly each frame.
			//This will not be possible where procedural animations take place. Like the eye of the Boss or its tentacles. But things like Rockets and particles could be cached.
			//Reduce object pool sizes.
			//Reduce amount of objects created to cache data.
	//TODO: //I Could setup the GameObjects in a way in which I can specify if they need an update or not. 
			//That could reduce method calls greatly, since a lot of GameObjects don't use update at all.
			//Same could be done with drawing, as some GameObjects could only exist as data containers.

$(function(){
	//This is the main creation function, the game officially starts when this is called.
	var creation = function() {
		TopLevel.canvas    = document.getElementById("game");
		TopLevel.context   = TopLevel.canvas.getContext("2d");
		TopLevel.container = new ObjectsContainer(TopLevel.context).setDefaultLayer(2);

		TopLevel.weaponFactory     = new WeaponFactory();
		TopLevel.playerShipFactory = new PlayerShipFactory();
		TopLevel.powerUpFactory    = new PowerUpFactory();
		TopLevel.rocketFactory     = new EnemyRocketFactory();
		TopLevel.starFactory       = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
		
		TopLevel.attributesGetter = new AttributesGetter();

		TopLevel.hudController   = new HudController();
		TopLevel.playerData      = new PlayerController();
		TopLevel.animationActors = new CutSceneController();

		TopLevel.pools          = new PoolCreator();
		TopLevel.configuration  = new ConfigurationCreator();
		TopLevel.texts          = new TextConfigurationCreator();
		TopLevel.collisionPairs = new CollisionPairCreator();
		TopLevel.attributes     = new AttributeCreator();

		TopLevel.playerShipFactoryConfiguration = new PlayerShipFactoryConfiguration();
		TopLevel.powerUpConfiguration           = new PowerUpConfiguration();

		ArrowKeyHandler.init();

		//GameObject pooling method
		TopLevel.pools.create();
		//All things related to GameObject configuration
		TopLevel.configuration.create();
		TopLevel.texts.create();
		TopLevel.collisionPairs.create();				
		TopLevel.attributes.create();
		
		//Boss Configurations
		Boss_1_ConfigurationGetter.createConfigurations();

		TopLevel.powerUpConfiguration.setUp();
		TopLevel.playerShipFactoryConfiguration.setUp();

		//This takes care of updating the HUD
		TopLevel.hudController.init(TopLevel.playerData);

		//The reference to the player ship held in PlayerData
		//TopLevel.playerData.ship = TopLevel.playerShipFactory.firstShip(TopLevel.canvas.width/2 - 45, TopLevel.canvas.height + 50);
		TopLevel.playerData.ship = TopLevel.playerShipFactory.firstPowerShip(TopLevel.canvas.width/2, TopLevel.canvas.height - 100);
		//Used to reset the game when needed.
		TopLevel.setUpGame = setUpGame;

		TopLevel.animationActors.ship = TopLevel.playerData.ship;
		TopLevel.animationActors.getEnd_2_BadGuy("End_2_BadGuy");

		//This is the game basic logic. It takes care of creating the baddies in the order specified.
		setUpGame();
	}

	//TODO: Do something to pick this stuff up from a configuration Object when the game actually starts and not before.
	//That way I can have different configurations for each selectable ship.
	var setUpGame = function() {	
		var bossDrops = {};

		var getFightBadGuy    = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getFightBadguy);
		
		var getEnd_1_BadGuy   = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getEnd_1_BadGuy);
		var getEnd_2_BadGuy   = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getEnd_2_BadGuy);
		
		var getMainBoss       = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMainBoss);       
		var getMiniBossCenter = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossCenter); 
		var getMiniBossRight  = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossRight);  
		var getMiniBossLeft   = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossLeft); 

		var currentBoss = -1;
			
		var bosses = [
			// {main:{id:"Boss_1_C", get:getMainBoss}, next:false, last:false, sub:{id:"Middle_1_BadGuy", get:getFightBadGuy}, intro:"warning", win:"boom", drop:"MultiWeaponPowerUp"},							   
			// {main:{id:"Boss_1_D", get:getMainBoss}, next:false, last:false, sub:{id:"Middle_1_BadGuy", get:getFightBadGuy}, intro:"warning", win:"boom", drop:"HPPowerUp"},
		 //    {main:{id:"Boss_1_E", get:getMainBoss}, next:false, last:false, sub:{id:"Middle_2_BadGuy", get:getFightBadGuy}, intro:"warning", win:"boom", drop:"LivesPowerUp"},
		   
		 //    {main:{id:"SubBoss_1", get:getMiniBossLeft}  , next:true , last:false, sub:null, intro:null, win:"nice", drop:"MultiWeaponPowerUp"},
		 //    {main:{id:"SubBoss_1", get:getMiniBossRight} , next:true , last:false, sub:null, intro:null, win:"nice", drop:"MultiWeaponPowerUp"},
		 //    {main:{id:"SubBoss_3", get:getMiniBossCenter}, next:false, last:false, sub:{id:"Middle_2_BadGuy", get:getFightBadGuy}, intro:"watchout", win:"nice", drop:"HPPowerUp"},

		 //    {main:{id:"Boss_1_F", get:getMainBoss}, next:false, last:false, sub:{id:"Middle_3_BadGuy", get:getFightBadGuy}, intro:"warning", win:"complete", drop:"HPPowerUp"},

		 	{main:{id:"End_2_BadGuy", intro:"ready", win:null, get:getEnd_2_BadGuy}, next:false, last:false, sub:{id:"End_1_BadGuy", intro:null, win:null, get:getEnd_1_BadGuy}, drop:null},

		    //{main:{id:"End_1_BadGuy", get:getEnd_1_BadGuy}, next:false, last:true, sub:null, intro:"ready", win:null, drop:null}
		    //{main:{id:"End_2_BadGuy", get:getEnd_2_BadGuy}, next:false, last:true, sub:null, intro:"ready", win:null, drop:null}
	    ];

		//First Set
		//TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 25, -50, 200, 350, 800, 5, false, "SpeedPowerUp");	
		//TopLevel.rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -50, -70, 600, 10, false, "HPPowerUp");
		TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 25, -50, 200, 350, 800, 5, true , "WeaponPowerUp,MultiWeaponPowerUp");
		
		//Second Set
		TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
		TopLevel.rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -90, -100, 600, 10, false, "HPPowerUp");
		TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, true,  "WeaponPowerUp");
		
		//Third Set
		TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 200, 500, 10, false, "MultiWeaponPowerUp");
		TopLevel.rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -200, -250, 600, 10, false, "HPPowerUp");
		TopLevel.rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 500, 500, 10, true,  "WeaponPowerUp,SpeedPowerUp");

		TopLevel.rocketFactory.onWaveComplete = FuntionUtils.bindScope(this, function(){
			var bossesCreated = 0;

			var createSubBossIntro = function(bossInit) {
				if(bossInit.next) return;

				if(!bossInit.sub){
					createBossIntro(bossInit);
					return;
				}

				var intro = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.sub.intro, -200, TopLevel.canvas.height/2 );

				if(intro){
					intro.addOnDestroyCallback(this, function(){
						createSubBoss(bossInit);
					});
				}else{
					createSubBoss(bossInit);		
				}
			}

			var createSubBoss = function(bossInit) {
				bossInit.sub.get(bossInit.sub.id).addOnRecicleCallback(this, function(){

					var win = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.sub.win, -200, TopLevel.canvas.height / 2);
						
					if(win){
						win.addOnDestroyCallback(this, function(){
							createBossIntro(bossInit);
						});
					}else{
						createBossIntro(bossInit);
					}

				}, true);		
			}

			var createBossIntro = function(bossInit) {
				if(!bossInit.main) return;
				if(bossInit.next) return;

				var intro = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.main.intro, -200, TopLevel.canvas.height/2 );

				if(intro){
					intro.addOnDestroyCallback(this, function(){
						createBoss(bossInit);
					});
				}else{
					createBoss(bossInit);
				}
			}

			var createBoss = function(bossInit) {
				if(bossInit.next) return;

				var onBossDestroy = function(obj){
					TopLevel.powerUpFactory.create(obj.x, obj.y, bossDrops[obj.typeId].pop(), 1, false);

					bossesCreated--;
					if(bossesCreated <= 0){
						var win = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.main.win, -200, TopLevel.canvas.height / 2);
						
						win.addOnDestroyCallback(this, function(){
							if(!bossInit.last){
								TopLevel.playerData.increaseStage();
								TopLevel.rocketFactory.start();
							}
						});
					}
				}

				var currentBossIndex = currentBoss;

				do {
					if(!bosses[currentBossIndex].main){
						bossesCreated--;
						currentBossIndex--;
						continue;	
					} 

					var boss = bosses[currentBossIndex].main.get(bosses[currentBossIndex].main.id);
					
					if(!bossDrops[boss.typeId]){
						bossDrops[boss.typeId] = [];
					}

					bossDrops[boss.typeId].push(bosses[currentBossIndex].drop);

					boss.addOnDestroyCallback(this, onBossDestroy);
					
					currentBossIndex--;

				}while(currentBossIndex >= 0 && bosses[currentBossIndex].next)
			}

			do{
				currentBoss++;
				bossesCreated++;
				currentBoss = currentBoss >= bosses.length ? 0 : currentBoss;

				createSubBossIntro(bosses[currentBoss]);			
				
			}while(bosses[currentBoss].next);
		});

		TopLevel.starFactory.start();
	}
	
	//Game creation starts here.
	new GameSetUp(creation);
});