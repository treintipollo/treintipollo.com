"use strict";

{
	class PyramidBossLevel1 extends PyramidBossLevel
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			modulePackageFactory.registerPackage("Meteor_Actor"	   , 10 , MeteorLogic	 , MeteorRenderer	  , null , CircleCollider     );
			modulePackageFactory.registerPackage("MeteorHP_Actor"   , 10 , MeteorHPLogic , MeteorHPRenderer , null , MeteorHPCollider   );
			
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"   );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor" );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"   );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" );
			
			this._pyramidBossLogicInitialization = new PyramidBossLogicInitialization(5, 3, 2, 150, 5, TopLevel.stage.stageHeight - 350, actorManager);
			this._pyramidBossLogicInitialization.ownParameters(6, 0.7);
			this._pyramidBossLogicInitialization.attackParameters(10, ["Meteor", "MeteorHP"], [0.7, 0.3], 1, [1, 2], [0.9, 0.1], 5);
			
			this._pyramidBossLogicInitialization.attackParticlesParameters1(60, 45, new Point(-100, -130));
			this._pyramidBossLogicInitialization.attackParticlesParameters2(80, 20, new Point(-70, -100));
			
			initParametersGetter.register("Meteor"	   , "Meteor_Actor"	    , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParametersGetter.register("MeteorHP"   , "MeteorHP_Actor"   , [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			
			this.baseChildSetUp(actorManager, modulePackageFactory, initParametersGetter, collisionManager);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
		}
	}

	window.PyramidBossLevel1 = PyramidBossLevel1;
}