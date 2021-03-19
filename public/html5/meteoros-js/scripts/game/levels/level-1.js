"use strict";

{
	class Level1 extends Level
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			modulePackageGetter.registerPackage("Meteor_Actor"		   , 10 , MeteorLogic		  , MeteorRenderer		   , null				  , CircleCollider        );
			modulePackageGetter.registerPackage("MeteorHP_Actor"	   , 10 , MeteorHPLogic	 	  , MeteorHPRenderer	   , null				  , MeteorHPCollider  	  );
			modulePackageGetter.registerPackage("MeteorLauncher_Actor" , 1  , MeteorLauncherLogic , null				   , null				  , null				  );
			
			// // Setting up actor collision pairs.
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"   );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor" );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor");
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" );
			
			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("Meteor"		   , "Meteor_Actor"	        , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParamsGetter.register("MeteorHP"  	   , "MeteorHP_Actor"		, [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			initParamsGetter.register("MeteorLauncher" , "MeteorLauncher_Actor" , [actorManager, actorManager.Stage.stageWidth, this._meteorLauncherTargets, 1.5, ["Meteor", "MeteorHP"], [0.7, 0.3]], null, null, null);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			// Adding Meteor Launcher
			actorManager.setActor("MeteorLauncher", 0, 0, 0, 1, true);
		}
	}

	window.Level1 = Level1;
}