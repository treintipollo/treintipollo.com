var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	attributesGetter:null,
	lastUpdate: Date.now(),
	focus: true,
	blur: true,
	tweensTimeLine: null
};
window.TopLevel = TopLevel;

//TODO: Destruir y volver a crear la nave, cuando perdes todo el HP.
		//Animacion de muerte
		//Guardar el arma actual, sin el nivel.
		//Tirar algunos powerups

//TODO: Boss should enter from the top.
	//Eye Closed, blockdamage=true

//TODO: Boss should drop power ups.
		//When Damaged, 3 or 4
//TODO: Boss Should have more health. Body and Tentacles

//TODO: Check the Boss again and make configurable some of the hard coded numbers that where laying around.
	//TODO: Boss should recover faster after being knocked back.

//TODO: Ship emoticons.

//TODO: Utility methods to draw lines, sqaures and circles. Should recieve a context along with other parameters.

//TODO: Some kind of level, that ends with the boss.
		//Congratulations screen.

//TODO: Tweek base damages and damage multipliers

$(function(){
	TopLevel.canvas    = document.getElementById("game");
	TopLevel.context   = TopLevel.canvas.getContext("2d");
	
	TopLevel.container 		  = new ObjectsContainer(TopLevel.context);
	TopLevel.attributesGetter = new AttributesGetter();

	var createObjectPools = function(){
		TopLevel.container.createTypePool("Ship", Ship, 1);
		
		TopLevel.container.createTypePool("Star", Star, 30);
		
		TopLevel.container.createTypePool("ExhaustParticle"    , ExhaustParticle, 100);
		TopLevel.container.createTypePool("ShotChargeParticle" , ShotChargeParticle, 40);
		TopLevel.container.createTypePool("BurstParticle"      , BurstParticle, 500);
		TopLevel.container.createTypePool("BurstParticleRadius", BurstParticleRadius, 300);
		TopLevel.container.createTypePool("StraightParticle"   , StraightParticle, 3000);

		TopLevel.container.createTypePool("Shot"           , Shot, 40);
		TopLevel.container.createTypePool("PowerShot"      , PowerShot, 1);
		TopLevel.container.createTypePool("PowerShotSine"  , PowerShotSine, 2);
		TopLevel.container.createTypePool("PowerShotCircle", PowerShotCircle, 3);
		
		TopLevel.container.createTypePool("Rocket"       , Rocket, 10);
		TopLevel.container.createTypePool("LargeRocket"  , LargeRocket, 10);
		TopLevel.container.createTypePool("ClusterRocket", ClusterRocket, 10);
		TopLevel.container.createTypePool("Target"       , Target, 1);
		TopLevel.container.createTypePool("Explosion"    , Explosion, 50);
		TopLevel.container.createTypePool("Debry"        , Debry, 40);

		TopLevel.container.createTypePool("WeaponPowerUp", WeaponPowerUp, 1);
		TopLevel.container.createTypePool("PowerUpText"  , PowerUpText, 5);
		
		//TopLevel.container.createTypePool("EnemyRocket"       , EnemyRocket, 30);
		
		TopLevel.container.createTypePool("Boss_1"    	   , Boss_1, 4);
		TopLevel.container.createTypePool("Tentacle"   	   , Tentacle, 20);
		TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);
		TopLevel.container.createTypePool("BeamCollider"   , BeamCollider, 200);
		TopLevel.container.createTypePool("Line"           , Line, 2);
		TopLevel.container.createTypePool("Fireball"       , Fireball, 6);
		TopLevel.container.createTypePool("WhiteFlash"     , WhiteFlash, 2);
	}

	var createObjectConfigurations = function() {
		//Configurations
		TopLevel.container.createTypeConfiguration("Ship", "Ship", "Ship", 0, true , ObjectsContainer.PUSH);
		
		TopLevel.container.createTypeConfiguration("Small_Shot", "Shot", "Shot", 1, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Big_Shot"  , "Shot", "Shot", 1, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Single_Power_Shot_1", "PowerShot", "PowerShot", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_2", "PowerShot", "PowerShot", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Single_Power_Shot_3", "PowerShot", "PowerShot", 0, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Double_Power_Shot_1", "PowerShotSine", "PowerShot", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_2", "PowerShotSine", "PowerShot", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Double_Power_Shot_3", "PowerShotSine", "PowerShot", 0, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_1" , "PowerShotCircle", "PowerShot", 0, true , ObjectsContainer.PUSH);	
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_2" , "PowerShotCircle", "PowerShot", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Triple_Power_Shot_3" , "PowerShotCircle", "PowerShot", 0, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Rocket"       	 , "Rocket"       , "Rocket", 1, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("LargeRocket"  	 , "LargeRocket"  , "Rocket", 1, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("ClusterRocket"	 , "ClusterRocket", "Rocket", 1, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Explosion_Damage", "Explosion"	  , "Rocket", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Explosion_Effect", "Explosion"	  , "Rocket", 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Debry"			 , "Debry"		  , "Rocket", 2, true , ObjectsContainer.PUSH);
		
		TopLevel.container.createTypeConfiguration("WeaponPowerUp", "WeaponPowerUp", "WeaponPowerUp", 0, true , ObjectsContainer.PUSH);
		
		//TopLevel.container.createTypeConfiguration("EnemyRocket", "EnemyRocket", 3, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Boss_1"			, "Boss_1", "Boss_1", 0, true , ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_1", "Boss_1", "Boss_1", 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Boss_1_Helper_2", "Boss_1", "Boss_1", 0, true , ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("Tentacle"  		 		, "Tentacle"  	   , "Tentacle"		  , 0, false, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("TentacleSegment_Collide", "TentacleSegment", "TentacleSegment", 0, true , ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("TentacleSegment_Show"   , "TentacleSegment", "TentacleSegment", 0, false, ObjectsContainer.UNSHIFT);
		TopLevel.container.createTypeConfiguration("BeamCollider"  	        , "BeamCollider"   , "BeamCollider"	  , 0, true , ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Fireball"  		        , "Fireball"  	   , "Fireball" 	  , 0, true , ObjectsContainer.PUSH);
		
		TopLevel.container.createTypeConfiguration("Star"				, "Star"			  , "Star"			    , 4, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("ExhaustParticle"    , "ExhaustParticle"   , "ExhaustParticle"   , 1, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("ShotChargeParticle" , "ShotChargeParticle", "ShotChargeParticle", 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("BurstParticle"      , "BurstParticle"     , "BurstParticle"		, 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("BurstParticle_Blood", "BurstParticle"     , "BurstParticle"		, 1, false, ObjectsContainer.PUSH);	
		TopLevel.container.createTypeConfiguration("StraightParticle"   , "StraightParticle"  , "StraightParticle"	, 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Line"				, "Line"		      , "Line"				, 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("WhiteFlash"			, "WhiteFlash"	   	  , "WhiteFlash"		, 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("Target"       	 	, "Target"       	  , "Target"			, 0, false, ObjectsContainer.PUSH);
		TopLevel.container.createTypeConfiguration("PowerUpText"  	 	, "PowerUpText"    	  , "PowerUpText"		, 0, false, ObjectsContainer.PUSH);

		TopLevel.container.createTypeConfiguration("BurstParticleRadius", "BurstParticleRadius", "BurstParticleRadius", 0, false, ObjectsContainer.PUSH);
	}
	
	var createCollisionPairs = function(){
		//Collision pairs
		//TopLevel.container.addCollisionPair("Ship"     , "EnemyRocket");
		TopLevel.container.addCollisionPair("Ship"     , "WeaponPowerUp");
		TopLevel.container.addCollisionPair("Ship"     , "BeamCollider");
		TopLevel.container.addCollisionPair("Ship"     , "Boss_1");
		TopLevel.container.addCollisionPair("Ship"     , "Fireball");
		TopLevel.container.addCollisionPair("Ship"     , "TentacleSegment");

		/*TopLevel.container.addCollisionPair("Shot"     , "EnemyRocket");
		TopLevel.container.addCollisionPair("PowerShot", "EnemyRocket");
		TopLevel.container.addCollisionPair("Rocket"   , "EnemyRocket");
		TopLevel.container.addCollisionPair("Explosion_Damage", "EnemyRocket");
		TopLevel.container.addCollisionPair("Debry"    , "EnemyRocket");*/
		
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

		TopLevel.attributesGetter.setAttributes("Small_Shot", 0 , 0 , 0.5, {big:false} ); 
		TopLevel.attributesGetter.setAttributes("Big_Shot"	, 0 , 0 , 0.6, {big:true} );  

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
		TopLevel.attributesGetter.setAttributes("ClusterRocket"   ,  0, 0, 0.1); 
		TopLevel.attributesGetter.setAttributes("Explosion_Damage", 50, 1, 0.1); 
		TopLevel.attributesGetter.setAttributes("Explosion_Effect",  0, 0,   0); 
		TopLevel.attributesGetter.setAttributes("Debry"           ,  0, 0, 0.1); 
		
		TopLevel.attributesGetter.setAttributes("Boss_1", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1", 50 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_1", 20 , 1, 10); 
		TopLevel.attributesGetter.setAttributes("Boss_1_Helper_2", 20 , 1, 10); 

		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 
		TopLevel.attributesGetter.setAttributes("Tentacle", 50, 1, 10, { minLength:4 } ); 

		TopLevel.attributesGetter.setAttributes("TentacleSegment_Collide", 1, 0, 5); 
		
		TopLevel.attributesGetter.setAttributes("BeamCollider", 1 , 1 , 1); 
		TopLevel.attributesGetter.setAttributes("Fireball"	  , 0 , 0 , 1); 

		//TopLevel.attributesGetter.setAttributes("EnemyRocket", 70, 10, 0.4 );	
	}

	createObjectPools();
	createObjectConfigurations();
	createCollisionPairs();
	createAttributesTable();

	var starFactory = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
	starFactory.start();

	//var rocketFactory = new EnemyRocketFactory(TopLevel.canvas.width, TopLevel.canvas.height, 200, 500, 800, TopLevel.container, 10);
	//rocketFactory.start();

	var playerShipFactory = new PlayerShipFactory(TopLevel.container);

	var ship = playerShipFactory.createPlayerShip();

	//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.A, function(){
		var boss = TopLevel.container.add("Boss_1", [TopLevel.canvas.width/2, TopLevel.canvas.height/2- 100, 
												     ship, 
													 Boss_1.Main_Body_Properties, 
													 Boss_1.Main_Ability_Properties, 
													 Boss_1.Main_Tentacle_Properties,
													 Boss_1.Main_Beam_Properties], 
													 0, 
													 true, 
													 ObjectsContainer.UNSHIFT);		
	
		boss.startAttack();

	//});

	/*ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.S, function(){
	});

	ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.Z, function(){
	});

	ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.X, function(){
	});*/

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
