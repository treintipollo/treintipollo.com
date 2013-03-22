var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	attributesGetter:null,
	powerUpFactory:null,
	lastUpdate: Date.now(),
	focus: true,
	blur: true,
	tweensTimeLine: null
};
window.TopLevel = TopLevel;

//Bug, en el ultimo nivel no se resetea el nivel del enemy rockey factory.

//TODO: Some kind of level, that ends with the boss.
		//Design the some bosses. Attack, tentacle and helpers convinations.
		//Attack configurations
		
		//Boss should drop power ups.
			//When Damaged, 1 or 2

		//Congratulations screen.
		
		//More Powerups
			//Level up only
			//Health
			//Lives
			//Speed
		
		//Minimalistic Hud, showing lives, health, speed and weapon level.
		
		//Make a better baddie only section
			//Some more different baddies.
			//Different formations.
			
//TODO: Weapon Manger for player Ship

//TODO: Cambiar como se dispara
	//Otra tecla que no sea control
	//El Shot Weapon carga si no apretas nada.

//TODO: Usar TimeOutFactory dentro de ArrowKeyHandler.

//TODO: Poner un splash para que si el juego arranca sin saber si tiene el foco o no, no pase nada.
		//Usar hasFOcus del document.

//TODO: Ship emoticons.
//TODO: Boss Emoticons.
//TODO: Ship should generate some kind of particle when it takes light and heavy damage.

//TODO: Tweek base damages and damage multipliers
//TODO: Utility methods to draw lines, sqaures and circles. Should recieve a context along with other parameters.
		//TODO:Utility Object, so that the global scope has less litter.
//TODO: Hacer que el add del ObjectContainer te devuelva el objeto que va a usar, con todo configurado menos la inicializacion. 
		//De ahi puedo llamar directamente al init de ese objeto con los parametros que yo quiera, sin andar creado arrays intermedios.

$(function(){
	TopLevel.canvas    = document.getElementById("game");
	TopLevel.context   = TopLevel.canvas.getContext("2d");
	
	TopLevel.container 		  = new ObjectsContainer(TopLevel.context);
	TopLevel.attributesGetter = new AttributesGetter();
	TopLevel.powerUpFactory   = new PowerUpFactory(TopLevel.container);

	Boss_1_ConfigurationGetter.createConfigurations();
	TopLevel.powerUpFactory.addPowerUpTypes("WeaponPowerUp");

	var createObjectPools = function(){
		TopLevel.container.createTypePool("Ship"	 , Ship		, 1);
		TopLevel.container.createTypePool("CloneShip", CloneShip, 7);

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
		
		TopLevel.container.createTypePool("Rocket"       , Rocket, 10);
		TopLevel.container.createTypePool("LargeRocket"  , LargeRocket, 10);
		TopLevel.container.createTypePool("ClusterRocket", ClusterRocket, 10);
		TopLevel.container.createTypePool("Target"       , Target, 1);
		TopLevel.container.createTypePool("Explosion"    , Explosion, 50);
		TopLevel.container.createTypePool("Debry"        , Debry, 40);

		TopLevel.container.createTypePool("WeaponPowerUp", WeaponPowerUp, 10);
		TopLevel.container.createTypePool("PowerUpText"  , PowerUpText, 5);
		
		TopLevel.container.createTypePool("EnemyRocket", EnemyRocket, 30);
		
		TopLevel.container.createTypePool("Boss_1"    	   , Boss_1, 4);
		TopLevel.container.createTypePool("Tentacle"   	   , Tentacle, 20);
		TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);
		TopLevel.container.createTypePool("BeamCollider"   , BeamCollider, 200);
		TopLevel.container.createTypePool("WhiteFlash"     , WhiteFlash, 2);

		TopLevel.container.createTypePool("Fireball"       , Fireball, 30);
		TopLevel.container.createTypePool("MultiShot"      , MultiShot, 10);

		TopLevel.container.createTypePool("Line"          , Line, 2);
		TopLevel.container.createTypePool("PercentageLine", PercentageLine, 30);
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

		TopLevel.container.createTypeConfiguration("Rocket"       	 , "Rocket"       , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("LargeRocket"  	 , "LargeRocket"  , "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("ClusterRocket"	 , "ClusterRocket", "Rocket", 1, true );
		TopLevel.container.createTypeConfiguration("Explosion_Damage", "Explosion"	  , "Rocket", 0, true );
		TopLevel.container.createTypeConfiguration("Explosion_Effect", "Explosion"	  , "Rocket", 0, false);
		TopLevel.container.createTypeConfiguration("Debry"			 , "Debry"		  , "Rocket", 2, true );
		
		TopLevel.container.createTypeConfiguration("WeaponPowerUp", "WeaponPowerUp", "WeaponPowerUp", 0, true);
		
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

		TopLevel.container.createTypeConfiguration("Boss_1_Helper_1", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_2", "Boss_1", "Boss_1", 0, true);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_3", "Boss_1", "Boss_1", 0, true);

		TopLevel.container.createTypeConfiguration("Tentacle"  	 , "Tentacle", "Tentacle", 3, false, ObjectsContainer.UNSHIFT);
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
		TopLevel.container.createTypeConfiguration("Target"     , "Target"     , "Target"	  , 0, false);
		TopLevel.container.createTypeConfiguration("PowerUpText", "PowerUpText", "PowerUpText", 0, false);

		TopLevel.container.createTypeConfiguration("Line"		   , "Line"	   		 , "Line"		   , 0, false);
		TopLevel.container.createTypeConfiguration("PercentageLine", "PercentageLine", "PercentageLine", 0, false);
		
		TopLevel.container.createTypeConfiguration("ExhaustParticle"    , "ExhaustParticle"    , "ExhaustParticle"    , 1, false);
		TopLevel.container.createTypeConfiguration("ShotChargeParticle" , "ShotChargeParticle" , "ShotChargeParticle" , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticle"      , "BurstParticle"      , "BurstParticle"	  , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticle_Blood", "BurstParticle"      , "BurstParticle"	  , 2, false);	
		TopLevel.container.createTypeConfiguration("StraightParticle"   , "StraightParticle"   , "StraightParticle"	  , 0, false);
		TopLevel.container.createTypeConfiguration("BurstParticleRadius", "BurstParticleRadius", "BurstParticleRadius", 0, false);
	}
	
	var createCollisionPairs = function(){
		//Collision pairs
		TopLevel.container.addCollisionPair("Ship", "EnemyRocket");
		TopLevel.container.addCollisionPair("Ship", "WeaponPowerUp");
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

		TopLevel.attributesGetter.setAttributes("Rocket"          ,  0, 0, 0.8); 
		TopLevel.attributesGetter.setAttributes("LargeRocket"     ,  0, 0, 0.9); 
		TopLevel.attributesGetter.setAttributes("ClusterRocket"   ,  0, 0, 0.5); 
		TopLevel.attributesGetter.setAttributes("Explosion_Damage", 50, 1, 0.1); 
		TopLevel.attributesGetter.setAttributes("Explosion_Effect",  0, 0,   0); 
		TopLevel.attributesGetter.setAttributes("Debry"           ,  0, 0, 0.4); 
		
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_A", 50 , 1, 10); 

		TopLevel.attributesGetter.setAttributes("Boss_1_B", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_B", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_B", 50 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_C", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_C", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_C", 50 , 1, 10);

		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_1", 20 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_2", 20 , 1, 10);
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_3", 40 , 1, 10); 

		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } );

		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("LongTentacle", 100, 0.1, 10, { minLength:4 } ); 

		TopLevel.attributesGetter.setAttributes("BabyTentacle", 100, 0.1, 10, { minLength:4 } );

		TopLevel.attributesGetter.setAttributes("TentacleSegment_Collide", 1, 0, 5); 
		
		TopLevel.attributesGetter.setAttributes("BeamCollider", 1 , 1 , 1); 
		TopLevel.attributesGetter.setAttributes("Fireball"	  , 0 , 0 , 1); 
		TopLevel.attributesGetter.setAttributes("MultiShot"	  , 0 , 0 , 7);

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

	createObjectPools();
	createObjectConfigurations();
	createCollisionPairs();
	createAttributesTable();

	var starFactory = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
	var rocketFactory = new EnemyRocketFactory();

	var playerShipFactory = new PlayerShipFactory(TopLevel.container);
	var ship = playerShipFactory.createPlayerShip();
	
	var currentBoss = 0;
	var bosses = ["Boss_1_A","Boss_1_B","Boss_1_C"];

	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 40, 200, 350, 800, 10, false);
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 40, 200, 350, 800, 10, true);
	
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 60, 100, 500, 600, 10, false);
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 60, 100, 500, 600, 10, true);
	
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 80, 100, 500, 500, 10, false);
	rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 80, 100, 500, 500, 10, true);

	rocketFactory.onWaveComplete = FuntionUtils.bindScope(this, function(){
		currentBoss = currentBoss >= bosses.length ? 0 : currentBoss;

		var boss = TopLevel.container.add(bosses[currentBoss], [TopLevel.canvas.width/2, -200, ship]);		
	
		boss.gotoPosition(TopLevel.canvas.width/2, TopLevel.canvas.height/2-100, 3, function(){
			this.startAttack();
		}, null, true);

		boss.addOnDestroyCallback(this, function(){
			currentBoss++;
			rocketFactory.start();
		});	
	});
	
	starFactory.start();
	rocketFactory.start();

	/*ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.A, FuntionUtils.bindScope(this, function(){
		TopLevel.container.add("CloneShip", [TopLevel.canvas.width/2, 
											 TopLevel.canvas.height/2, 
											 {x:TopLevel.canvas.width/2, y:TopLevel.canvas.height/2-200}, 
											 80, 
											 "#FFFFFF",
											 ['#227AF5','#4E94F5','#1B5FBF']]);
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
