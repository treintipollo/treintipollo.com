"use strict";

{
	let LEVEL_1 = NaN;
	let LEVEL_2 = NaN;
	let LEVEL_3 = NaN;
	let LEVEL_4 = NaN;
	let LEVEL_5 = NaN;
	let LEVEL_6 = NaN;
	let LEVEL_7 = NaN;
	let LEVEL_8 = NaN;
	
	let PYRAMID_BOSS_LEVEL_1 = NaN;
	let PYRAMID_BOSS_LEVEL_2 = NaN;
	let PYRAMID_BOSS_LEVEL_3 = NaN;
	let PYRAMID_BOSS_LEVEL_4 = NaN;
	
	let REQUIREMENT_DESTROY_COUNT = NaN;
	let REQUIREMENT_CITIES_DESTROYED = NaN;
	let REQUIREMENT_DESTROY_BOSS = NaN;
	
	class LevelInitializar
	{
		constructor()
		{
			
		}

		static initAllLevels(levelManager)
		{
			// Regular Levels
			LEVEL_1 = levelManager.addLevel( new Level1() );
			LEVEL_2 = levelManager.addLevel( new Level2() );
			LEVEL_3 = levelManager.addLevel( new Level3() );
			LEVEL_4 = levelManager.addLevel( new Level4() );
			LEVEL_5 = levelManager.addLevel( new Level5() );
			LEVEL_6 = levelManager.addLevel( new Level6() );
			LEVEL_7 = levelManager.addLevel( new Level7() );
			LEVEL_8 = levelManager.addLevel( new Level8() );
			
			// Boss Levels
			PYRAMID_BOSS_LEVEL_1 = levelManager.addLevel( new PyramidBossLevel1() );
			PYRAMID_BOSS_LEVEL_2 = levelManager.addLevel( new PyramidBossLevel2() );
			PYRAMID_BOSS_LEVEL_3 = levelManager.addLevel( new PyramidBossLevel3() );
			PYRAMID_BOSS_LEVEL_4 = levelManager.addLevel( new PyramidBossLevel4() );
			
			// Level requirements
			REQUIREMENT_DESTROY_COUNT    = levelManager.addRequirement(new DestroyCount());
			REQUIREMENT_CITIES_DESTROYED = levelManager.addRequirement(new CitiesDestroyed());
			REQUIREMENT_DESTROY_BOSS 	 = levelManager.addRequirement(new DestroyBoss());
			
			// Single Levels Fist Batch
			levelManager.addRequirementGroup("SingleLevel", LEVEL_1, "< ST.1 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [25 , "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_2, "< ST.2 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [75, "MissileLauncher_Actor"] ],  [ [ 1 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_3, "< ST.3 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [100, "MissileLauncher_Actor"] ], [ [ 2 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_4, "< ST.4 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [125, "MissileLauncher_Actor"] ], [ [ 2 ] ]);
			
			// Single Levels Second Batch
			levelManager.addRequirementGroup("SingleLevel", LEVEL_5, "< ST.5 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [150 , "MissileLauncher_Actor"] ], [ [ 2 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_6, "< ST.6 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [120, "MissileLauncher_Actor"] ], [ [ 3 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_7, "< ST.7 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [120, "MissileLauncher_Actor"] ], [ [ 3 ] ]);
			levelManager.addRequirementGroup("SingleLevel", LEVEL_8, "< ST.8 >", [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [200, "MissileLauncher_Actor"] ], [ [ 4 ] ]);
			
			// Single Boss Levels
			levelManager.addRequirementGroup("SingleLevel", PYRAMID_BOSS_LEVEL_1, "< VS.1 >", [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "ROUND 1"] ], [ [ 1 ] ]);
			levelManager.addRequirementGroup("SingleLevel", PYRAMID_BOSS_LEVEL_2, "< VS.2 >", [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "ROUND 2"] ], [ [ 2 ] ]);
			levelManager.addRequirementGroup("SingleLevel", PYRAMID_BOSS_LEVEL_3, "< VS.3 >", [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "ROUND 3"] ], [ [ 2 ] ]);
			levelManager.addRequirementGroup("SingleLevel", PYRAMID_BOSS_LEVEL_4, "< VS.4 >", [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "ROUND 4"] ], [ [ 3 ] ]);
			
			// Endurance Levels Regular and Boss
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [50, "MissileLauncher_Actor"] ] , [ [ 1 ] ]);
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_2, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [75, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			// Mini break before Boss fight
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_5, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [30, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			// Mid Boss
			levelManager.addRequirementGroup("EnduranceLevel", PYRAMID_BOSS_LEVEL_2, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "WARNING!"] ]  , [ [ 1 ] ]);
			
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_3, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [150, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			// Mini break in between long stages
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_6, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [50, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_4, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [200, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			// Mini break before Boss fight
			levelManager.addRequirementGroup("EnduranceLevel", LEVEL_7, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [50, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			
			// End Boss
			levelManager.addRequirementGroup("EnduranceLevel", PYRAMID_BOSS_LEVEL_4, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "WARNING!"] ]  , [ [ 1 ] ]);
			
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ] , [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_2, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_5, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", PYRAMID_BOSS_LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "WARNING!"] ]  , [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_3, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_6, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_4, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_7, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", PYRAMID_BOSS_LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_BOSS ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor", "WARNING!"] ]  , [ [ 1 ] ]);

			// Endurance Levels Test
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ] , [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_2, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_3, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_4, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [1, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_1, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [2, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_2, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [2, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_3, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [2, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
			// levelManager.addRequirementGroup("EnduranceLevel", LEVEL_4, levelManager.CLOSED_LEVEL_NAME, [ REQUIREMENT_DESTROY_COUNT ], [ REQUIREMENT_CITIES_DESTROYED ], [ [2, "MissileLauncher_Actor"] ], [ [ 1 ] ]);
		}
	}

	window.LevelInitializar = LevelInitializar;
}