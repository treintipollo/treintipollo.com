"use strict";

{
	class Level5 extends Level
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			modulePackageGetter.registerPackage("Meteor_Actor"		   , 10 , MeteorLogic		  , MeteorRenderer		   , null				  , CircleCollider        );
			modulePackageGetter.registerPackage("MeteorLauncher_Actor" , 1  , MeteorLauncherLogic , null				   , null				  , null				  );
			modulePackageGetter.registerPackage("Ufo_Actor" 		   , 5  , UfoSlowLogic 		  , UfoRenderer			   , null				  , UfoColliderCircle	  );
			modulePackageGetter.registerPackage("Bomb_Actor" 		   , 5  , BombLogic		      , BombRenderer  		   , null				  , BombColliderCircle	  );
			modulePackageGetter.registerPackage("UfoCoordinator_Actor" , 1  , UfoCoordinatorLogic , null  				   , null				  , null				  );
			
			// Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor" );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor" );
			collisionManager.addPair("Missile_Actor" , "Ufo_Actor"	  );
			collisionManager.addPair("City_Actor"    , "Bomb_Actor"   );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Meteor"		   , "Meteor_Actor"	        , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorLauncher" , "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1.4, ["Meteor"], [1]], null, null, null);
			initParamsGetter.register("Bomb"		   , "Bomb_Actor"		    , [40, 0, 1, 18, 5, 0.3], [10, 3, 2], null, [10]);
			initParamsGetter.register("UfoCoordinator" , "UfoCoordinator_Actor" , [actorManager, actorManager.Stage.stageWidth, ["Ufo"], [1], 7], null, null, null);
			
			let slowUfoBaseParams = new UfoBaseInitialization(3, 3, 5, 120, 5, actorManager.Stage.stageHeight - 250, actorManager);
			
			initParamsGetter.register("Ufo", "Ufo_Actor", [null, this._meteorLauncherTargets, slowUfoBaseParams]	  , [3, 5, 0x00ff00], null, [32, 20]);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("Ufo_Actor");
			this._destroyableActors.push("Bomb_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			// Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
			// Addign UFO Coordinator
			actorManager.setActor("UfoCoordinator", 0, 0, 0, 1, true);
		}
	}

	window.Level5 = Level5;
}