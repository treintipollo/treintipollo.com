"use strict";

{
	class Level6 extends Level
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			modulePackageGetter.registerPackage("Meteor_Actor"		   , 10 , MeteorLogic		  , MeteorRenderer		   , null				  , CircleCollider        );
			modulePackageGetter.registerPackage("MeteorLauncher_Actor" , 1  , MeteorLauncherLogic , null				   , null				  , null				  );
			modulePackageGetter.registerPackage("Ufo_Actor" 		   , 5  , UfoSlowLogic		  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("UfoTeleport_Actor"    , 5  , UfoTeleportLogic 	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("UfoScroll_Actor" 	   , 5  , UfoScrollLogic	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("UfoLazor_Actor" 	   , 5  , UfoLaserLogic	 	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("Lazor_Actor" 		   , 5  , LaserLogic 		  , LaserRenderer  		   , null				  , null				  );
			modulePackageGetter.registerPackage("Bomb_Actor" 		   , 5  , BombLogic		      , BombRenderer  		   , null				  , BombColliderCircle	  );
			modulePackageGetter.registerPackage("UfoCoordinator_Actor" , 1  , UfoCoordinatorLogic , null  				   , null				  , null				  );
			modulePackageGetter.registerPackage("MeteorHP_Actor"	   , 10 , MeteorHPLogic	 	  , MeteorHPRenderer	   , null				  , MeteorHPCollider  	  );
			
			// Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "Ufo_Actor"	           );
			collisionManager.addPair("Missile_Actor" , "UfoTeleport_Actor"     );
			collisionManager.addPair("Missile_Actor" , "UfoScroll_Actor"       );
			collisionManager.addPair("Missile_Actor" , "UfoLazor_Actor"        );
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"          );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor"        );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"          );
			collisionManager.addPair("City_Actor"    , "Bomb_Actor"   	       );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" 	   );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Meteor"		   , "Meteor_Actor"	        , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorHP"  	   , "MeteorHP_Actor"		, [new Point(), 50, 15, null], [50, 2, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [50, 48, 45, 42, 38, 35, 32, 30, 28, 25, 22, 20, 18, 15, 12]);
			initParamsGetter.register("MeteorLauncher" , "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1.5, ["Meteor", "MeteorHP"], [0.9, 0.1]], null, null, null);
			initParamsGetter.register("Bomb"		   , "Bomb_Actor"		    , [40, 0, 1, 18, 5, 0.3], [10, 3, 2], null, [10]);
			initParamsGetter.register("Lazor"		   , "Lazor_Actor"		    , [null, null, 5, 2], [0], null, null);
			initParamsGetter.register("UfoCoordinator" , "UfoCoordinator_Actor" , [actorManager, actorManager.Stage.stageWidth, ["Ufo","UfoTeleport","UfoScroll","UfoLazor"], [0.25, 0.25, 0.25, 0.25], 5], null, null, null);
			
			let slowUfoBaseParams = new UfoBaseInitialization(3, 3, 5, 120, 5, actorManager.Stage.stageHeight - 250, actorManager);
			let teleportUfoBaseParams = new UfoBaseInitialization(3, 3, 7, 0  , 5, actorManager.Stage.stageHeight - 250, actorManager);
			let scrollUfoBaseParams = new UfoBaseInitialization(6, 4, 5,  150, 5, actorManager.Stage.stageHeight - 100, actorManager);
			let lazorUfoBaseParams = new UfoBaseInitialization(6, 6, 1,  0  , 5, actorManager.Stage.stageHeight - 200, actorManager);
			
			initParamsGetter.register("Ufo"		   , "Ufo_Actor"		    , [null, this._meteorLauncherTargets, slowUfoBaseParams], [3, 5, 0x00ff00], null, [32, 20]);
			initParamsGetter.register("UfoTeleport", "UfoTeleport_Actor"    , [null, this._meteorLauncherTargets, teleportUfoBaseParams], [3, 5, 0xffff00], null, [32, 20]);
			initParamsGetter.register("UfoScroll"  , "UfoScroll_Actor"      , [null, scrollUfoBaseParams], [3, 5, 0x00ffff], null, [32, 20]);
			initParamsGetter.register("UfoLazor"   , "UfoLazor_Actor"       , [null, this._meteorLauncherTargets, lazorUfoBaseParams], [3, 5, 0xff0000], null, [32, 20]);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("Bomb_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
			this._destroyableActors.push("UfoScroll_Actor");
			this._destroyableActors.push("UfoLazor_Actor");
			this._destroyableActors.push("Ufo_Actor");
			this._destroyableActors.push("UfoTeleport_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			// Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
			// Addign UFO Coordinator
			actorManager.setActor("UfoCoordinator", 0, 0, 0, 1, true);
		}
	}

	window.Level6 = Level6;
}