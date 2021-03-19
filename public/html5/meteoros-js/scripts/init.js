"use strict"

{
	// Sequel material
		// A few different enemies?
		// A new boss?
		// Add more regular levels
			// new win conditions
				// ufo kill count
		// Add more boss fights
			// no new boss, just different difficulties
		// Unlockable endurance level
		// Unlockable challenges levels
			// Mini endurance?
		// Real graphics
			// Dandy (?)


	// State Indexes and transition events
	let SPLASH_STATE = NaN;
	let SINGLE_LEVEL_GAME_STATE = NaN;
	let ENDURANCE_GAME_STATE = NaN;
	let GAME_OVER_STATE = NaN;
	let VICTORY_SCREEN_STATE = NaN;
	let LEVEL_SELECT_STATE = NaN;
	let EPILOGUE_STATE = NaN;
	let OPTIONS_STATE = NaN;
	
	const SPLASH_LEVEL_SELECT 			 = "SPLASH_LEVEL_SELECT";
	const SPLASH_OPTIONS 				 = "SPLASH_OPTIONS";
	const OPTIONS_SPLASH 				 = "OPTIONS_SPLASH";
	const SPLASH_ENDURANCE_GAME 		 = "SPLASH_ENDURANCE_GAME";
	const LEVEL_SELECT_SPLASH 			 = "LEVEL_SELECT_SPLASH";
	const LEVEL_SELECT_SINGLE_LEVEL_GAME = "LEVEL_SELECT_MAIN_GAME";
	const SINGLE_LEVEL_GAME_GAME_OVER 	 = "SINGLE_LEVEL_GAME_GAME_OVER";
	const SINGLE_LEVEL_GAME_VICTORY 	 = "SINGLE_LEVEL_GAME_VICTORY";
	const ENDURANCE_GAME_GAME_OVER 		 = "ENDURANCE_GAME_GAME_OVER";
	const ENDURANCE_GAME_VICTORY 	 	 = "ENDURANCE_GAME_VICTORY";
	const GAME_OVER_SPLASH 	 			 = "GAME_OVER_SPLASH";
	const GAME_OVER_RETRY 	 			 = "GAME_OVER_RETRY";
	const VICTORY_SPLASH 	 			 = "VICTORY_SPLASH";
	const VICTORY_EPILOGUE 	 			 = "VICTORY_EPILOGUE";
	const EPILOGUE_SPLASH 	 			 = "EPILOGUE_SPLASH";

	class Nukes
	{
		constructor(stage)
		{
			// Delta Time
			this._deltaTime = NaN;
			this._lastTime = Date.now();

			// Input handlers
			this._keyBoardHandler = new KeyObject(stage);
			this._mouseHandler = new MouseObject(stage);

			// Sound
			this._soundManager = window.SoundManager;
			// Actors
			this._modulePackageGetter = new ModulePackageFactory();
			this._collisionManager = new ActorCollisionManager(this._modulePackageGetter);
			this._initParamsGetter = new ActorInitArgumentsGetter();
			this._actorManager = new ActorManager(
				Actor,
				stage,
				this._modulePackageGetter,
				this._collisionManager,
				this._initParamsGetter,
				this._soundManager
			);
			this._guiActorManager = new GuiActorManager(this._actorManager);
			
			// Levels
			this._levelManager = new LevelManager();
			this._requirementsManager = new RequirementsManager();
			// Pause
			this._pauseHandler = new PauseUtils(this, this._mouseHandler, this._soundManager, stage);
			this._pauseHandler.initFocusHandler(stage);
			// Messages
			this._messageGetter = new MessageGetter(Files._messages);
			// Score
			this._scoreCounter = new ScoreCounter();
			// Custom Pointers
			this._inputVisualsManager = new InputVisualsManager();
			// Main State Machine
			this._stateMachine = new StateManager(this);

			// Initializing Levels
			LevelInitializar.initAllLevels(this._levelManager);
			// Initializing Mouse Pointers
			MousePointerInitializaer.initAllPointers(this._inputVisualsManager);

			// Save Data
			this._saveData = new NukesSaveData(this._levelManager);

			const splash 		 	= new Splash(stage, this);
			const levelSelect 	 	= new LevelSelect(stage, this);
			const gameOver		 	= new GameOver(stage, this);
			const victory		 	= new VictoryScreen(stage, this);
			const epilogue		 	= new EnduranceEpilogue(stage, this);
			const singleLevelGame  	= new SingleLevelGame(stage, this);
			const enduranceGame    	= new EnduranceGame(stage, this);
			const options			= new Options(stage, this);

			// Setting Up Mouse pointer type for each state
			splash.MousePointer 		 = MousePointerInitializaer.ARROW_POINTER;
			levelSelect.MousePointer	 = MousePointerInitializaer.ARROW_POINTER;
			gameOver.MousePointer		 = MousePointerInitializaer.ARROW_POINTER;
			victory.MousePointer 		 = MousePointerInitializaer.ARROW_POINTER;
			epilogue.MousePointer 		 = MousePointerInitializaer.ARROW_POINTER;
			singleLevelGame.MousePointer = MousePointerInitializaer.CROSSHAIR_POINTER;
			enduranceGame.MousePointer 	 = MousePointerInitializaer.CROSSHAIR_POINTER;
			options.MousePointer		 = MousePointerInitializaer.ARROW_POINTER;
			
			// Setting Up BGM for each state
			splash.BGM 			= Sounds.SPLASH_BGM;
			levelSelect.BGM 	= Sounds.SPLASH_BGM;
			gameOver.BGM 		= Sounds.SPLASH_BGM;
			victory.BGM 		= Sounds.VICTORY_BGM;
			epilogue.BGM 		= Sounds.VICTORY_BGM;
			singleLevelGame.BGM = Sounds.MAINGAME_1_BGM;
			enduranceGame.BGM 	= Sounds.MAINGAME_1_BGM;
			options.BGM			= Sounds.NO_SOUND;
			
			singleLevelGame.StandardBGMs = [ Sounds.MAINGAME_1_BGM, Sounds.MAINGAME_2_BGM, Sounds.MAINGAME_3_BGM, Sounds.MAINGAME_4_BGM ];
			singleLevelGame.BossBGMs     = [ Sounds.BOSS_BGM ];
			
			enduranceGame.StandardBGMs = [ Sounds.MAINGAME_1_BGM, Sounds.MAINGAME_2_BGM, Sounds.MAINGAME_3_BGM, Sounds.MAINGAME_4_BGM ];
			enduranceGame.BossBGMs     = [ Sounds.BOSS_BGM ];
			
			// Setting Sub states
			singleLevelGame.setSubState(SubMainGame);
			enduranceGame.setSubState(SubMainGame);

			SPLASH_STATE 		 	= this._stateMachine.add(splash);
			LEVEL_SELECT_STATE   	= this._stateMachine.add(levelSelect);
			GAME_OVER_STATE 	 	= this._stateMachine.add(gameOver);
			VICTORY_SCREEN_STATE 	= this._stateMachine.add(victory);
			EPILOGUE_STATE			= this._stateMachine.add(epilogue);
			SINGLE_LEVEL_GAME_STATE = this._stateMachine.add(singleLevelGame);
			ENDURANCE_GAME_STATE    = this._stateMachine.add(enduranceGame);
			OPTIONS_STATE			= this._stateMachine.add(options);

			// State Wiring
			this._stateMachine.wireStates(SPLASH_STATE, SPLASH_LEVEL_SELECT, LEVEL_SELECT_STATE);
			this._stateMachine.wireStates(SPLASH_STATE, SPLASH_ENDURANCE_GAME, ENDURANCE_GAME_STATE);
			this._stateMachine.wireStates(SPLASH_STATE, SPLASH_OPTIONS, OPTIONS_STATE);
			this._stateMachine.wireStates(OPTIONS_STATE, OPTIONS_SPLASH, SPLASH_STATE);
			this._stateMachine.wireStates(LEVEL_SELECT_STATE, LEVEL_SELECT_SINGLE_LEVEL_GAME, SINGLE_LEVEL_GAME_STATE);
			this._stateMachine.wireStates(LEVEL_SELECT_STATE, LEVEL_SELECT_SPLASH, SPLASH_STATE);
			this._stateMachine.wireStates(SINGLE_LEVEL_GAME_STATE, SINGLE_LEVEL_GAME_GAME_OVER, GAME_OVER_STATE);
			this._stateMachine.wireStates(SINGLE_LEVEL_GAME_STATE, SINGLE_LEVEL_GAME_VICTORY, VICTORY_SCREEN_STATE);
			this._stateMachine.wireStates(ENDURANCE_GAME_STATE, ENDURANCE_GAME_GAME_OVER, GAME_OVER_STATE);
			this._stateMachine.wireStates(ENDURANCE_GAME_STATE, ENDURANCE_GAME_VICTORY, VICTORY_SCREEN_STATE);
			this._stateMachine.wireStates(GAME_OVER_STATE, GAME_OVER_RETRY, SINGLE_LEVEL_GAME_STATE);
			this._stateMachine.wireStates(GAME_OVER_STATE, GAME_OVER_SPLASH, SPLASH_STATE);
			this._stateMachine.wireStates(VICTORY_SCREEN_STATE, VICTORY_SPLASH, SPLASH_STATE);
			this._stateMachine.wireStates(VICTORY_SCREEN_STATE, VICTORY_EPILOGUE, EPILOGUE_STATE);
			this._stateMachine.wireStates(EPILOGUE_STATE, EPILOGUE_SPLASH, SPLASH_STATE);

			this._stage = stage;
			this._stage.setClearColor("#000000ff");
			this._stage.enableMouseOver(50);
		}

		init()
		{
			this._stateMachine.setCurrent();
			
			createjs.Ticker.framerate = 60;
			createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
			createjs.Ticker.addEventListener("tick", (e) => this._Update(e));
		}

		_Update(event)
		{
			this._deltaTime = Date.now();
			this._deltaTime -= this._lastTime;

			Sounds.Update();

			if (this._deltaTime < 300)
			{
				const delta = this._deltaTime / 1000;

				this._stateMachine.update(delta);
				
				if (this._pauseHandler.isPaused() === PauseUtils.NO_PAUSE)
				{
				 	if (ParticleSystemManager.SystemsActive())
				 	{
						ParticleSystemManager.Update(delta, false);
					}

					this._actorManager.update(delta);
				}
				
				this._guiActorManager.update(this._pauseHandler.isPaused(), delta);
			}

			this._mouseHandler.update();

			this._stage.update();

			this._lastTime = Date.now();
		}

		get SPLASH_STATE()
		{
			return SPLASH_STATE;
		}

		get SINGLE_LEVEL_GAME_STATE()
		{
			return SINGLE_LEVEL_GAME_STATE;
		}

		get ENDURANCE_GAME_STATE()
		{
			return ENDURANCE_GAME_STATE;
		}

		get GAME_OVER_STATE()
		{
			return GAME_OVER_STATE;
		}

		get VICTORY_SCREEN_STATE()
		{
			return VICTORY_SCREEN_STATE;
		}

		get LEVEL_SELECT_STATE()
		{
			return LEVEL_SELECT_STATE;
		}

		get EPILOGUE_STATE()
		{
			return EPILOGUE_STATE;
		}

		get OPTIONS_STATE()
		{
			return OPTIONS_STATE;
		}

		get SPLASH_LEVEL_SELECT()
		{
			return SPLASH_LEVEL_SELECT;
		}

		get SPLASH_OPTIONS()
		{
			return SPLASH_OPTIONS;
		}

		get OPTIONS_SPLASH()
		{
			return OPTIONS_SPLASH;
		}

		get SPLASH_ENDURANCE_GAME()
		{
			return SPLASH_ENDURANCE_GAME;
		}

		get LEVEL_SELECT_SPLASH()
		{
			return LEVEL_SELECT_SPLASH;
		}
		
		get LEVEL_SELECT_SINGLE_LEVEL_GAME()
		{
			return LEVEL_SELECT_SINGLE_LEVEL_GAME;
		}

		get SINGLE_LEVEL_GAME_GAME_OVER()
		{
			return SINGLE_LEVEL_GAME_GAME_OVER;
		}

		get SINGLE_LEVEL_GAME_VICTORY()
		{
			return SINGLE_LEVEL_GAME_VICTORY;
		}

		get ENDURANCE_GAME_GAME_OVER()
		{
			return ENDURANCE_GAME_GAME_OVER;
		}

		get ENDURANCE_GAME_VICTORY()
		{
			return ENDURANCE_GAME_VICTORY;
		}

		get GAME_OVER_SPLASH()
		{
			return GAME_OVER_SPLASH;
		}

		get GAME_OVER_RETRY()
		{
			return GAME_OVER_RETRY;
		}

		get VICTORY_SPLASH()
		{
			return VICTORY_SPLASH;
		}

		get VICTORY_EPILOGUE()
		{
			return VICTORY_EPILOGUE;
		}

		get EPILOGUE_SPLASH()
		{
			return EPILOGUE_SPLASH;
		}

		get keyBoardHandler()
		{
			return this._keyBoardHandler;
		}

		get mouseHandler()
		{
			return this._mouseHandler;
		}

		get soundManager()
		{
			return this._soundManager;
		}
		
		get actorManager()
		{
			return this._actorManager;
		}

		get collisionManager()
		{
			return this._collisionManager;
		}

		get modulePackageGetter()
		{
			return this._modulePackageGetter;
		}

		get initParamsGetter()
		{
			return this._initParamsGetter;
		}

		get guiActorManager()
		{
			return this._guiActorManager;
		}
		
		get levelManager()
		{
			return this._levelManager;
		}

		get requirementsManager()
		{
			return this._requirementsManager;
		}
		
		get pauseHandler()
		{
			return this._pauseHandler;
		}
		
		get saveData()
		{
			return this._saveData;
		}
		
		get messageGetter()
		{
			return this._messageGetter;
		}
		
		get scoreCounter()
		{
			return this._scoreCounter;
		}
		
		get inputVisualsManager()
		{
			return this._inputVisualsManager;
		}
	}

	const stage = new createjs.StageGL("canvas");

	window.TopLevel = { stage: stage };

	Images.Init();
	Sounds.Init();
	Files.Init();
	DynamicGraphics.Init(stage);

	Promise.all([
		SoundManager.IsReady(),
		DynamicGraphics.IsReady(),
		Files.IsReady(),
		Images.IsReady()
	])
	.then(() =>
	{
		ParticleInitializer.initAllParticles(
			stage,
			"particle-canvas",
			Files._particleSizes,
			Images._shards,
			Images._people
		);

		window.Nukes = new Nukes(stage);
		window.Nukes.init();
	});
	
	window.addEventListener("contextmenu", (e) =>
	{
		e.preventDefault();
		e.stopPropagation();
	});
}








