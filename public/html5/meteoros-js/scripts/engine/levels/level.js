"use strict";

{
	const STANDARD_LEVEL = 0;
	const BOSS_LEVEL     = 1;
	
	class Level
	{
		constructor()
		{
			this._meteorLauncherTargets = [];
			this._destroyableActors     = [];
			
			this._onFailure = null;
			this._onVictory = null;
			this._scoreCounter = null;
			this._name = "";
			this._victoryRequirement = null;
			this._defeatRequirement = null;
			this._levelResults = null;

			this._on_missile_launcher_recycled = (missileLauncher) => this.onMissileLauncherRecycled(missileLauncher);
			this._on_city_recycled = (city) => this.onCityRecycled(city);
			this._on_victory = () => this._onVictory();
			this._on_failure = () => this._onFailure();
		}

		static get STANDARD_LEVEL()
		{
			return STANDARD_LEVEL;
		}

		static get BOSS_LEVEL()
		{
			return BOSS_LEVEL;
		}
		
		set OnLevelFailure(value)
		{
			this._onFailure = value;
		}
		
		set OnLevelVictory(value)
		{
			this._onVictory = value;
		}
		
		set ScoreCounter(value)
		{
			this._scoreCounter = value;
		}
		
		set VictoryRequirements(value)
		{
			this._victoryRequirement = value;
		}
		
		set DefeatRequirements(value)
		{
			this._defeatRequirement = value;
		}
		
		set Name(value)
		{
			this._name = value;
		}
		
		get VictoryRequirements()
		{
			return this._victoryRequirement;
		}

		get DefeatRequirements()
		{
			return this._defeatRequirement;
		}

		get LevelResult()
		{
			return this._levelResults;
		}

		get DestroyableActors()
		{
			return this._destroyableActors;
		}

		get Name()
		{
			return this._name;
		}

		get Type()
		{
			return STANDARD_LEVEL;
		}
		
		setUp(actorManager, modulePackageGetter, initParamsGetter, collisionManager, requirementsManager)
		{
			this._levelResults = {};
			
			this._levelResults["TotalPopulationSaved"] = [];
			this._levelResults["MissilesLaunched"] 	   = 0;
			this._levelResults["MissileHits"]      	   = 0;
			
			const stage = actorManager.Stage;

			this._meteorLauncherTargets.push(new Point(stage.stageWidth / 4 * 0 + 100 ,  stage.stageHeight - 30));
			this._meteorLauncherTargets.push(new Point(stage.stageWidth / 4 * 1 + 100 ,  stage.stageHeight - 30));
			this._meteorLauncherTargets.push(new Point(stage.stageWidth / 4 * 2 + 140,  stage.stageHeight - 30));
			this._meteorLauncherTargets.push(new Point(stage.stageWidth / 4 * 3 + 140,  stage.stageHeight - 30));

			// Setting up victory and defeat conditions.
			requirementsManager.add(this._victoryRequirement.concat(), this._on_victory);
			requirementsManager.add(this._defeatRequirement.concat(), this._on_failure);
			// Setup requirements Visuals
			requirementsManager.setupVisuals(modulePackageGetter, initParamsGetter);
			// Setup Score Counter Visuals
			this._scoreCounter.setUpVisual(modulePackageGetter, initParamsGetter);
			
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			modulePackageGetter.registerPackage("City_Actor"			   , 4  , CityLogic 		  , CityRenderer 		   , null 				  , CityCollider 		  );
			modulePackageGetter.registerPackage("CityPopulation_Actor"     , 4  , CityPopulationLogic , CityPopulationRenderer , null 				  , null		 		  );
			modulePackageGetter.registerPackage("CityRepairFeedback_Actor" , 4  , GuiTextFloatLogic   , GuiTextRenderer 	   , null 				  , null		 		  );
			modulePackageGetter.registerPackage("MissileLauncher_Actor"    , 1  , MissileLauncherLogic, MissileLauncherRenderer, MissileLauncherInput , null				  );
			modulePackageGetter.registerPackage("Missile_Actor"		       , 20 , MissileLogic		  , MissileRenderer		   , null				  , MissileColliderCircle );
			modulePackageGetter.registerPackage("InvalidTarget_Actor"	   , 1  , GuiTextFloatLogic	  , GuiTextRenderer		   , null				  , null 				  );
			modulePackageGetter.registerPackage("HitFeedback_Actor"	   	   , 20 , GuiTextFloatLogic   , GuiTextRenderer		   , null				  , null 				  );
			modulePackageGetter.registerPackage("NoCityBonus_Actor"	   	   , 4  , GuiTextFloatLogic	  , GuiTextRenderer		   , null				  , null 				  );
			modulePackageGetter.registerPackage("CityBonus_Actor"	   	   , 4  , GuiTextFloatLogic	  , GuiTextRenderer		   , null				  , null 				  );

			// Setting up Initialization Parameters for each actor.
			initParamsGetter.register("City"		   , "City_Actor"		        , [actorManager, 3, false], [150, 10], null, [[75],[75, 5]]);
			initParamsGetter.register("Missile"		   , "Missile_Actor"		    , [0,0, 150, 200], [10, 25], null, [7, 18]);
			initParamsGetter.register("CityPopulation" , "CityPopulation_Actor"     , [4], [5], null, null);
			initParamsGetter.register("MissileLauncher", "MissileLauncher_Actor"    , [actorManager, 5, 10], [5, 10, 30, -140], [-140], null);
			initParamsGetter.register("CityRepair"     , "CityRepairFeedback_Actor" , [" ", 0x4E90ED], ["Absender", 13, true, false, 0, false, 0, false], null, null);
			initParamsGetter.register("InvalidTarget"  , "InvalidTarget_Actor"      , ["INVALID TARGET", 0xff0000, 0], ["Absender", 13, true, false, 0, false, 0, false], null, null);
			initParamsGetter.register("HitFeedback"    , "HitFeedback_Actor"      	, [" ", 0x00ff00, 0, 35, 0.25], ["Absender", 13, true, false, 0, false, 0, false], null, null);
			initParamsGetter.register("NoCityBonus"    , "NoCityBonus_Actor"        , ["NO BONUS", 0xff0000, 0], ["Absender", 13, true, false, 0, false, 0, false], null, null);
			initParamsGetter.register("CityBonus"      , "CityBonus_Actor"          , [" ", 0x00ff00, 0], ["Absender", 13, true, false, 0, false, 0, false], null, null);

			// Child Class setup
			this.childSetup(actorManager, modulePackageGetter, initParamsGetter, collisionManager);
		}
		
		creation(actorManager, modulePackageGetter, initParamsGetter, collisionManager, requirementsManager)
		{
			const stage = actorManager.Stage;

			// Initializing Actor manager.
			actorManager.init();

			// Adding Missile Launcher
			actorManager.setActor("MissileLauncher", stage.stageWidth / 2, stage.stageHeight - 40, 0, 1, true, this._on_missile_launcher_recycled);
			
			// Adding Cities
			actorManager.setActor("City", this._meteorLauncherTargets[0].x,  this._meteorLauncherTargets[0].y, 0, 1, true, this._on_city_recycled);
			actorManager.setActor("City", this._meteorLauncherTargets[1].x,  this._meteorLauncherTargets[1].y, 0, 1, true, this._on_city_recycled);
			actorManager.setActor("City", this._meteorLauncherTargets[2].x,  this._meteorLauncherTargets[2].y, 0, 1, true, this._on_city_recycled);
			actorManager.setActor("City", this._meteorLauncherTargets[3].x,  this._meteorLauncherTargets[3].y, 0, 1, true, this._on_city_recycled);
			
			// Child Class actor adding
			this.childCreation(actorManager, modulePackageGetter, initParamsGetter, collisionManager);
			
			// Adding visual representation of victory and defeat conditions if they have any.
			// Logic initialization also goes here.
			requirementsManager.addVisuals(actorManager);
			// Add Score Counter Visuals
			this._scoreCounter.addVisual(actorManager);
		}
		
		release()
		{
			CollectionUtils.nullVector(this._meteorLauncherTargets, false, true);
			CollectionUtils.nullVector(this._destroyableActors, false, true);
			
			this._scoreCounter = null;
			
			this.concreteRelease();
		}
		
		destroy()
		{
			this.release();
			
			this._onFailure 		 = null;
			this._onVictory 		 = null;
			this._victoryRequirement = null;
			this._defeatRequirement  = null;
			this._levelResults 		 = null;
			
			this._on_missile_launcher_recycled = null;
			this._on_city_recycled = null;
			this._on_victory = null;
			this._on_failure = null;

			this._meteorLauncherTargets = null;
			this._destroyableActors = null;

			this.concreteDestroy();
		}
		
		childSetup(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{

		}

		childCreation(actorManager, modulePackageFactory, initParametersGetter, collisionManager)
		{

		}
		
		concreteRelease()
		{

		}

		concreteDestroy()
		{

		}

		onMissileLauncherRecycled(missileLauncher)
		{
			this._levelResults["MissilesLaunched"] = missileLauncher.Logic.ExternalParameters["LaunchedMissiles"];
			this._levelResults["MissileHits"]      = missileLauncher.Logic.ExternalParameters["MissileHits"];
		}
		
		onCityRecycled(city)
		{
			this._levelResults["TotalPopulationSaved"] = this._levelResults["TotalPopulationSaved"].concat(city.Logic.ExternalParameters["population"]);
		}
	}

	window.Level = Level;
}