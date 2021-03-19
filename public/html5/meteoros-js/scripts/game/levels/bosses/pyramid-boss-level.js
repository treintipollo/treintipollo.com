"use strict";

{
	class PyramidBossLevel extends Level
	{
		constructor()
		{
			super();

			this._pyramidBossLogicInitialization = null;
			this._pyramidBossRendererInitialization = null;
		}
		
		get Type()
		{
			return Level.BOSS_LEVEL;
		}
		
		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{
			actorManager.setActor("BossCreator", 0, 0);
		}
		
		baseChildSetUp(actorManager, modulePackageGetter, initParamsGetter, collisionManager)
		{
			modulePackageGetter.registerPackage("BossCreator_Actor", 1  , BossCreatorLogic , null      		  , null , null  			  );
			modulePackageGetter.registerPackage("PyramidBoss_Actor", 1  , PyramidBossLogic , PyramidBossRenderer, null , PyramidBossCollider  );
			modulePackageGetter.registerPackage("Bomb_Actor" 	   , 40 , BombLogic		   , BombRenderer     , null , BombColliderCircle );

			collisionManager.addPair("Missile_Actor" , "PyramidBoss_Actor" 	);
			collisionManager.addPair("Missile_Actor" , "Bomb_Actor" 	);
			collisionManager.addPair("City_Actor"    , "Bomb_Actor" 	);
			
			this._pyramidBossRendererInitialization = new PyramidBossRendererInitialization([5, 6, 0xE8E523], 60, 15, 45, 0xE8E523, 0xff0000);

			initParamsGetter.register("Bomb"	   , "Bomb_Actor"		, [40, 0, 1, 18, 5, 0.5, 5], [10, 3, 2], null, [10]);
			initParamsGetter.register("PyramidBoss", "PyramidBoss_Actor", [this._pyramidBossLogicInitialization], [this._pyramidBossRendererInitialization], null, [[60], [0, -55, 60, 5, -55, 5] , 20]);
			initParamsGetter.register("BossCreator", "BossCreator_Actor", [actorManager, "PyramidBoss"], null, null, null);
			
			this._destroyableActors.push("Bomb_Actor");
		}
	}

	window.PyramidBossLevel = PyramidBossLevel;
}