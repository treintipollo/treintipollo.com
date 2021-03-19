"use strict";

{
	class Level4 extends Level
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			modulePackageGetter.registerPackage("UfoScroll_Actor" 	   , 5  , UfoScrollLogic	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("UfoLazor_Actor" 	   , 5  , UfoLaserLogic	 	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("Lazor_Actor" 		   , 5  , LaserLogic 		  , LaserRenderer  		   , null				  , null				  );
			modulePackageGetter.registerPackage("Bomb_Actor" 		   , 5  , BombLogic		      , BombRenderer  		   , null				  , BombColliderCircle	  );
			modulePackageGetter.registerPackage("Meteor_Actor"		   , 10 , MeteorLogic		  , MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorParabolic_Actor", 20 , MeteorParabolicLogic, MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorSplit_Actor"	   , 10 , MeteorSplitLogic	  , MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorHP_Actor"	   , 10 , MeteorHPLogic	 	  , MeteorHPRenderer	   , null				  , MeteorHPCollider  	  );
			modulePackageGetter.registerPackage("MeteorLauncher_Actor" , 1  , MeteorLauncherLogic , null				   , null				  , null				  );
			modulePackageGetter.registerPackage("UfoCoordinator_Actor" , 1  , UfoCoordinatorLogic , null  				   , null				  , null				  );
			
			// Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "UfoScroll_Actor"       );
			collisionManager.addPair("Missile_Actor" , "UfoLazor_Actor"        );
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"          );
			collisionManager.addPair("Missile_Actor" , "MeteorParabolic_Actor" );
			collisionManager.addPair("Missile_Actor" , "MeteorSplit_Actor"     );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor"        );
			collisionManager.addPair("City_Actor"    , "Bomb_Actor"   	       );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"          );
			collisionManager.addPair("City_Actor"    , "MeteorSplit_Actor"     );
			collisionManager.addPair("City_Actor"    , "MeteorParabolic_Actor" );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" 	   );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Lazor"		   , "Lazor_Actor"		    , [null, null, 5, 2], [0], null, null);
			initParamsGetter.register("Bomb"		   , "Bomb_Actor"		    , [40, 0, 1, 18, 5, 0.3], [10, 3, 2], null, [10]);
			initParamsGetter.register("Meteor"		   , "Meteor_Actor"	        , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorHP"  	   , "MeteorHP_Actor"		, [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			initParamsGetter.register("MeteorParabolic", "MeteorParabolic_Actor", [new Point(), 50, 9.8, actorManager.Stage.stageWidth - 50, null], [10, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "MeteorTrail"], null, [10]);
			initParamsGetter.register("MeteorSplit"    , "MeteorSplit_Actor"	, [new Point(), 50, actorManager, 7, 200, 20, "MeteorParabolic", null], [20, 7, [new Point(), new Point(), new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0x5891ED, "NO_TRAIL"], null, [20]);
			
			initParamsGetter.register("MeteorLauncher" , "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1.5, ["Meteor", "MeteorHP", "MeteorSplit"], [0.7, 0.2, 0.1]], null, null, null);
			initParamsGetter.register("UfoCoordinator" , "UfoCoordinator_Actor" , [actorManager, actorManager.Stage.stageWidth, ["UfoScroll", "UfoLazor"], [0.5, 0.5], 7], null, null, null);
			
			let scrollUfoBaseParams = new UfoBaseInitialization(6, 4, 5,  150, 5, actorManager.Stage.stageHeight - 100, actorManager);
			let lazorUfoBaseParams 	= new UfoBaseInitialization(6, 6, 1,  0  , 5, actorManager.Stage.stageHeight - 200, actorManager);
			
			initParamsGetter.register("UfoScroll"  , "UfoScroll_Actor"      , [null, scrollUfoBaseParams] 						  , [3, 5, 0x00ffff], null, [32, 20]);
			initParamsGetter.register("UfoLazor"   , "UfoLazor_Actor"       , [null, this._meteorLauncherTargets, lazorUfoBaseParams]	  , [3, 5, 0xff0000], null, [32, 20]);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
			this._destroyableActors.push("MeteorParabolic_Actor");
			this._destroyableActors.push("MeteorSplit_Actor");
			this._destroyableActors.push("UfoScroll_Actor");
			this._destroyableActors.push("UfoLazor_Actor");
			this._destroyableActors.push("Bomb_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			//Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
			//Addign UFO Coordinator
			actorManager.setActor("UfoCoordinator", 0, 0, 0, 1, true);
		}
	}

	window.Level4 = Level4;
}