"use strict";

{
	class Level8 extends Level
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
			modulePackageGetter.registerPackage("UfoLazor_Actor" 	   , 5  , UfoLaserLogic	 	  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("Lazor_Actor" 		   , 5  , LaserLogic 		  , LaserRenderer  		   , null				  , null				  );
			modulePackageGetter.registerPackage("UfoCoordinator_Actor" , 1  , UfoCoordinatorLogic , null  				   , null				  , null				  );
			modulePackageGetter.registerPackage("MeteorSplit_Actor"	   , 10 , MeteorSplitLogic	  , MeteorRenderer		   , null				  , CircleCollider  	  );
			
			// Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "UfoLazor_Actor"        );
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"          );
			collisionManager.addPair("Missile_Actor" , "MeteorSplit_Actor"     );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"          );
			collisionManager.addPair("City_Actor"    , "MeteorSplit_Actor" 	   );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Meteor"		   		, "Meteor_Actor"	     , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorChunck"   		, "Meteor_Actor"	     , [new Point(), 70, null], [10, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "MeteorTrail"], null, [10]);
			initParamsGetter.register("MeteorLauncher" 		, "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1.5, ["Meteor", "MeteorSplitStraight"], [0.8, 0.2]], null, null, null);
			initParamsGetter.register("MeteorSplitStraight" , "MeteorSplit_Actor"	 , [new Point(), 40, actorManager, 8, 200, 30, "MeteorChunck", null], [20, 7, [new Point(), new Point(), new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xE64C77, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("Lazor"		   		, "Lazor_Actor"		     , [null, null, 5, 2], [0], null, null);
			initParamsGetter.register("UfoCoordinator" 		, "UfoCoordinator_Actor" , [actorManager, actorManager.Stage.stageWidth, ["UfoLazor"], [1], 7], null, null, null);
			
			let lazorUfoBaseParams = new UfoBaseInitialization(6, 6, 1, 0, 5, actorManager.Stage.stageHeight - 200, actorManager);
			
			initParamsGetter.register("UfoLazor", "UfoLazor_Actor", [null, this._meteorLauncherTargets, lazorUfoBaseParams], [3, 5, 0xff0000], null, [32, 20]);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("UfoLazor_Actor");
			this._destroyableActors.push("MeteorSplit_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			// Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
			// Addign UFO Coordinator
			actorManager.setActor("UfoCoordinator", 0, 0, 0, 1, true);
		}
	}

	window.Level8 = Level8;
}