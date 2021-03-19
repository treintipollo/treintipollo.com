"use strict";

{
	class PyramidBossLevel4 extends PyramidBossLevel
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			modulePackageFactory.registerPackage("Meteor_Actor"	   , 12 , MeteorLogic	, MeteorRenderer   , null , CircleCollider   );
			modulePackageFactory.registerPackage("MeteorHP_Actor"  , 12 , MeteorHPLogic , MeteorHPRenderer , null , MeteorHPCollider );
			modulePackageFactory.registerPackage("MeteorParabolic_Actor", 20 , MeteorParabolicLogic, MeteorRenderer		   , null				  , CircleCollider  	  );
			modulePackageFactory.registerPackage("MeteorSplit_Actor"	   , 10 , MeteorSplitLogic	  , MeteorRenderer		   , null				  , CircleCollider  	  );
			
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"   );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor" );
			collisionManager.addPair("Missile_Actor" , "MeteorParabolic_Actor" );
			collisionManager.addPair("Missile_Actor" , "MeteorSplit_Actor"     );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"   );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" );
			collisionManager.addPair("City_Actor"    , "MeteorSplit_Actor"     );
			collisionManager.addPair("City_Actor"    , "MeteorParabolic_Actor" );
			
			this._pyramidBossLogicInitialization = new PyramidBossLogicInitialization(10, 3, 1.2, 175, 3, TopLevel.stage.stageHeight - 350, actorManager);
			
			this._pyramidBossLogicInitialization.ownParameters(10, 0.4);
			this._pyramidBossLogicInitialization.attackParameters(13, ["Meteor", "MeteorHP", "MeteorSplit"], [0.50, 0.30, 0.2], 1, [1, 3], [0.7, 0.3], 8);
			this._pyramidBossLogicInitialization.attackParticlesParameters1(60, 50, new Point(-140, -160));
			this._pyramidBossLogicInitialization.attackParticlesParameters2(80, 50, new Point(-100, -120));
			
			initParametersGetter.register("Meteor"	   , "Meteor_Actor"	    , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParametersGetter.register("MeteorHP"   , "MeteorHP_Actor"   , [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			initParametersGetter.register("MeteorParabolic", "MeteorParabolic_Actor", [new Point(), 50, 9.8, TopLevel.stage.stageWidth-50, null], [10, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "MeteorTrail"], null, [10]);
			initParametersGetter.register("MeteorSplit"    , "MeteorSplit_Actor"	, [new Point(), 50, actorManager, 7, 200, 20, "MeteorParabolic", null], [20, 7, [new Point(), new Point(), new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0x5891ED, "NO_TRAIL"], null, [20]);
			
			this.baseChildSetUp(actorManager, modulePackageFactory, initParametersGetter, collisionManager);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
			this._destroyableActors.push("MeteorParabolic_Actor");
			this._destroyableActors.push("MeteorSplit_Actor");
		}
	}

	window.PyramidBossLevel4 = PyramidBossLevel4;
}