"use strict";

{
	class Level2 extends Level
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			modulePackageGetter.registerPackage("Meteor_Actor"		   , 10 , MeteorLogic		  , MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorParabolic_Actor", 20 , MeteorParabolicLogic, MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorSplit_Actor"	   , 10 , MeteorSplitLogic	  , MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageGetter.registerPackage("MeteorHP_Actor"	   , 10 , MeteorHPLogic	 	  , MeteorHPRenderer	   , null				  , MeteorHPCollider 	  );
			modulePackageGetter.registerPackage("MeteorLauncher_Actor" , 1  , MeteorLauncherLogic , null				   , null				  , null				  );
			
			// Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"          );
			collisionManager.addPair("Missile_Actor" , "MeteorParabolic_Actor" );
			collisionManager.addPair("Missile_Actor" , "MeteorSplit_Actor"     );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor"        );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"          );
			collisionManager.addPair("City_Actor"    , "MeteorSplit_Actor"     );
			collisionManager.addPair("City_Actor"    , "MeteorParabolic_Actor" );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" 	   );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Meteor"		   , "Meteor_Actor"	        , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorHP"  	   , "MeteorHP_Actor"		, [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			initParamsGetter.register("MeteorParabolic", "MeteorParabolic_Actor", [new Point(), 50, 9.8, actorManager.Stage.stageWidth - 50, null], [10, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "MeteorTrail"], null, [10]);
			initParamsGetter.register("MeteorSplit"    , "MeteorSplit_Actor"	, [new Point(), 50, actorManager, 7, 200, 20, "MeteorParabolic", null], [20, 7, [new Point(), new Point(), new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0x5891ED, "NO_TRAIL"], null, [20]);

			initParamsGetter.register("MeteorLauncher" , "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1, ["Meteor", "MeteorHP", "MeteorSplit"], [0.7, 0.2, 0.1]], null, null, null);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
			this._destroyableActors.push("MeteorParabolic_Actor");
			this._destroyableActors.push("MeteorSplit_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			// Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
		}
	}

	window.Level2 = Level2;
}