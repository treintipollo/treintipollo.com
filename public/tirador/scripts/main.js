var TopLevel = {
	canvas: null,
	context: null,
	container:null,
	lastUpdate: Date.now(),
	focus: true,
	blur: true,
	tweensTimeLine: null
};
window.TopLevel = TopLevel;

//TODO: A Cool Boss.

//TODO: Ship emoticon

//TODO: Make a proper Utils Object

//TODO: Global ObjectContainer, it's stupid to pass that reference around every where.
//TODO: Change to un minified version of TweenMax.js

$(function(){
	TopLevel.canvas    = document.getElementById("game");
	TopLevel.context   = TopLevel.canvas.getContext("2d");
	TopLevel.container = new ObjectsContainer(TopLevel.context);

	TopLevel.container.createTypePool("Star"              , Star, 30);
	TopLevel.container.createTypePool("Ship"              , Ship, 1);
	TopLevel.container.createTypePool("ExhaustParticle"   , ExhaustParticle, 100);
	TopLevel.container.createTypePool("ShotChargeParticle", ShotChargeParticle, 40);
	TopLevel.container.createTypePool("BurstParticle"     , BurstParticle, 800);
	TopLevel.container.createTypePool("StraightParticle"  , StraightParticle, 3000);

	TopLevel.container.createTypePool("Shot"              , Shot, 40);
	TopLevel.container.createTypePool("PowerShot"         , PowerShot, 1);
	TopLevel.container.createTypePool("PowerShotSine"     , PowerShotSine, 2);
	TopLevel.container.createTypePool("PowerShotCircle"   , PowerShotCircle, 3);
	TopLevel.container.createTypePool("Target"            , Target, 1);
	TopLevel.container.createTypePool("Explosion"         , Explosion, 50);
	TopLevel.container.createTypePool("Debry"             , Debry, 40);
	TopLevel.container.createTypePool("WeaponPowerUp"     , WeaponPowerUp, 1);
	TopLevel.container.createTypePool("PowerUpText"       , PowerUpText, 5);
	TopLevel.container.createTypePool("Rocket"            , Rocket, 10);
	TopLevel.container.createTypePool("LargeRocket"       , LargeRocket, 10);
	TopLevel.container.createTypePool("ClusterRocket"     , ClusterRocket, 10);
	//TopLevel.container.createTypePool("EnemyRocket"       , EnemyRocket, 30);
	
	TopLevel.container.createTypePool("BeamCollider"       , BeamCollider, 200);

	TopLevel.container.createTypePool("Boss_1"    	   , Boss_1, 4);
	TopLevel.container.createTypePool("Tentacle"   	   , Tentacle, 20);
	TopLevel.container.createTypePool("TentacleSegment", TentacleSegment, 400);

	TopLevel.container.addCollisionPair("Ship"     , "EnemyRocket");
	TopLevel.container.addCollisionPair("Ship"     , "WeaponPowerUp");
	TopLevel.container.addCollisionPair("Ship"     , "BeamCollider");

	TopLevel.container.addCollisionPair("Shot"     , "EnemyRocket");
	TopLevel.container.addCollisionPair("PowerShot", "EnemyRocket");
	TopLevel.container.addCollisionPair("Rocket"   , "EnemyRocket");
	TopLevel.container.addCollisionPair("Explosion", "EnemyRocket");
	TopLevel.container.addCollisionPair("Debry"    , "EnemyRocket");
	TopLevel.container.addCollisionPair("Shot"     , "TentacleSegment");
	TopLevel.container.addCollisionPair("Rocket"   , "TentacleSegment");

	var starFactory = new StartFactory(TopLevel.canvas.width, TopLevel.canvas.height, 50, 200, 600, 1, TopLevel.container);
	starFactory.start();

	//var rocketFactory = new EnemyRocketFactory(TopLevel.canvas.width, TopLevel.canvas.height, 200, 500, 800, TopLevel.container, 10);
	//rocketFactory.start();

	var ship = TopLevel.container.add("Ship", [TopLevel.canvas.width/2, TopLevel.canvas.height - 100, TopLevel.container], 0, true);

	//ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.A, function(){
		TopLevel.container.add("Boss_1", [TopLevel.canvas.width/2, TopLevel.canvas.height/2- 100, ship, Boss_1.Main_Body_Properties, Boss_1.Main_Ability_Properties, Boss_1.Main_Beam_Properties], 0);		
	//});

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
