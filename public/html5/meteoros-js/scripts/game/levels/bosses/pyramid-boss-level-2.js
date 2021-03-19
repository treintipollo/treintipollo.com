"use strict";

{
	class PyramidBossLevel2 extends PyramidBossLevel
	{
		constructor()
		{
			super();
		}
		
		childSetup(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			modulePackageFactory.registerPackage("Meteor_Actor"	   , 12 , MeteorLogic	, MeteorRenderer   , null , CircleCollider   );
			modulePackageFactory.registerPackage("MeteorHP_Actor"  , 12 , MeteorHPLogic , MeteorHPRenderer , null , MeteorHPCollider );
			
			collisionManager.addPair("Missile_Actor" , "Meteor_Actor"   );
			collisionManager.addPair("Missile_Actor" , "MeteorHP_Actor" );
			collisionManager.addPair("City_Actor"    , "Meteor_Actor"   );
			collisionManager.addPair("City_Actor"    , "MeteorHP_Actor" );
			
			this._pyramidBossLogicInitialization = new PyramidBossLogicInitialization(7, 4, 1.5, 160, 4, TopLevel.stage.stageHeight - 350, actorManager);
			
			this._pyramidBossLogicInitialization.ownParameters(6, 0.7);
			this._pyramidBossLogicInitialization.attackParameters(12, ["Meteor", "MeteorHP"], [0.55, 0.45], 1, [1, 2], [0.8, 0.2], 6);
			this._pyramidBossLogicInitialization.attackParticlesParameters1(60, 45, new Point(-120, -140));
			this._pyramidBossLogicInitialization.attackParticlesParameters2(80, 40, new Point(-70, -100));
			
			initParametersGetter.register("Meteor"	   , "Meteor_Actor"	    , [new Point(), 50, null], [20, 3, [new Point(),new Point(),new Point(),new Point(),new Point(),new Point()], 0xffffff, "NO_TRAIL"], null, [20]);
			initParametersGetter.register("MeteorHP"   , "MeteorHP_Actor"   , [new Point(), 50, 3, null], [20, 2, [new Point(),new Point(),new Point(),new Point(),new Point()], 0xffff00, "MeteorTrail"], null, [20, 15, 10]);
			
			this.baseChildSetUp(actorManager, modulePackageFactory, initParametersGetter, collisionManager);
			
			this._destroyableActors.push("Meteor_Actor");
			this._destroyableActors.push("MeteorHP_Actor");
		}
	}

	window.PyramidBossLevel2 = PyramidBossLevel2;
}