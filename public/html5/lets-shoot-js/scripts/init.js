"use strict"

{
 	// Game Improvements
 		// Do not give points for baddies spawned by a boss

 		// Something to save the volume settings

 		// Remove some strings I don't like anymore
 		
 		// Enter highscore name after the game is over
 			// All Clear
	 			// At the end go to the highscore state if the final score qualifies
				// Otherwise go to the Splash Screen
			// Main Game
				// When loosing go to the high score table if the final score qualifies
					// Otherwise go to the Splash Screen
 		
 		// Options state
 			// highscore table
 			// sound test
 		
 		// Hide big boss in easy Mode
 		
 		// Only use invincible bullets in the Big Boss spin attack
 			// hard mode
 		
 		// Only use big boss final attack sequence
 			// hard mode
 		
 		// if the level cuota is complete kill all baddies which are not visible
 			// after the boss is dead, complete if there are no more baddies which are visible
 		
 		// The bomb should go where the crosshair is
 		
 		// Add a small woobling motion for the last phase of the big boss
 			// it looks very stiff now
 		
 		// Make the center of the big boss glow when it can take damage to give a small hint
 			// Increase the amount of damge before backing off to give time to shoot a bomb
 		
 		// Add a gravity effect towards the center when the big boss is summoning baddies
 			// make the effects stronger the more of it's bits are destroyed
 			// make the particles fly faster towards the center as the pull is stronger

 		// more end game bonuses

 		// rebalance difficulties
 			// easy => easier
 			// normal => easy
 			// hard => normal
 			// boss HP only

 			// death attack bullets can't be destroyed
 				// hard only

 			// easy
 				// snake boss bullets have no tail

 			// Make easy mode easier
 				// Cheaper upgrades

	let _click = false;

	let SPLASH_SCREEN = NaN;
	let LEVEL_SELECT = NaN;
	let MAIN_GAME = NaN;
	let BOSS = NaN;
	let LEVEL_INTRO = NaN;
	let FREE_UPGRADE = NaN;
	let PRACTICE = NaN;
	let ALL_CLEAR = NaN;
	let DIFFICULTY_SELECT = NaN;
	let GAME_OVER = NaN;
	let STAGE_COMPLETE = NaN;
	let SOUND_TEST = NaN;
	let QUIT = NaN;

	class LetsShoot
	{
		constructor(stage)
		{
			this._stage = stage;
			this._stage.setClearColor("#000000ff");
			this._stage.enableMouseOver(50);

			this._stateMachine = new StateMachine();

			SPLASH_SCREEN = this._stateMachine.Add(new SplashScreen(stage));
			LEVEL_SELECT = this._stateMachine.Add(new LevelSelection(stage));
			MAIN_GAME = this._stateMachine.Add(new MainGame(stage));
			BOSS = this._stateMachine.Add(new BossLevel(stage));
			LEVEL_INTRO = this._stateMachine.Add(new LevelIntro(stage));
			FREE_UPGRADE = this._stateMachine.Add(new FreeUpgrade(stage));
			PRACTICE = this._stateMachine.Add(new Practice(stage));
			ALL_CLEAR = this._stateMachine.Add(new AllClear(stage));
			DIFFICULTY_SELECT = this._stateMachine.Add(new DifficultySelect(stage));
			GAME_OVER = this._stateMachine.Add(new GameOver(stage));
			STAGE_COMPLETE = this._stateMachine.Add(new StageComplete(stage));
			SOUND_TEST = this._stateMachine.Add(new SoundTest(stage));
			QUIT = this._stateMachine.Add(new Quit(stage));

			this._stateMachine.SetFirst();

			document.addEventListener("mousedown", (e) => this._OnMouseDown(e));
			document.addEventListener("mouseup", (e) => this._OnMouseUp(e));
			
			createjs.Ticker.framerate = 60;
			createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
			createjs.Ticker.addEventListener("tick", (e) => this._Update(e));
		}

		_Update(event)
		{
			Gamepad.Update();
			ParticleSystemMessages.Update(MenuFrame._isMenuOn);
			Sounds.Update();

			this._stateMachine.Update();
			this._stage.update();
		}

		_OnMouseDown(event)
		{
			// Simulate space bar when pressing an alternate mouse button
			if (event.button !== 0)
				return document.dispatchEvent(new KeyboardEvent("keydown", { key : " " }));

			_click = true;
		}

		_OnMouseUp(event)
		{
			// Simulate space bar when pressing an alternate mouse button
			if (event.button !== 0)
				return document.dispatchEvent(new KeyboardEvent("keyup", { key : " " }));

			_click = false;
		}
	}

	const stage = new createjs.StageGL("canvas");

	Key.Initialize();
	Images.Init();
	Sounds.Init();
	DynamicGraphics.Init(stage);
	Gamepad.Initialize();

	ParticleSystemMessages.Init("particle-canvas");

	Promise.all([
		SoundManager.IsReady(),
		DynamicGraphics.IsReady()
	])
	.then(() =>
	{
		MainBody.SetInitParams(3, 10, 1, 2, 1, 4);
		MainBody.SetInitParams2(0, 1, 5);
		BulletManager.Init(stage, 3000, 4);
		Grid_Revenge.Init(new Point(10,10), 0x151EC4, 0.4, 2, stage);
		ParticleSystemMessages.Start();

		window.LetsShoot = new LetsShoot(stage);

		Object.defineProperty(window.LetsShoot, "_click", { set: (x) => _click = x, get: () => _click });
		Object.defineProperty(window.LetsShoot, "SPLASH_SCREEN", { get: () => SPLASH_SCREEN });
		Object.defineProperty(window.LetsShoot, "LEVEL_SELECT", { get: () => LEVEL_SELECT });
		Object.defineProperty(window.LetsShoot, "MAIN_GAME", { get: () => MAIN_GAME });
		Object.defineProperty(window.LetsShoot, "BOSS", { get: () => BOSS });
		Object.defineProperty(window.LetsShoot, "LEVEL_INTRO", { get: () => LEVEL_INTRO });
		Object.defineProperty(window.LetsShoot, "FREE_UPGRADE", { get: () => FREE_UPGRADE });
		Object.defineProperty(window.LetsShoot, "PRACTICE", { get: () => PRACTICE });
		Object.defineProperty(window.LetsShoot, "ALL_CLEAR", { get: () => ALL_CLEAR });
		Object.defineProperty(window.LetsShoot, "DIFFICULTY_SELECT", { get: () => DIFFICULTY_SELECT });
		Object.defineProperty(window.LetsShoot, "GAME_OVER", { get: () => GAME_OVER });
		Object.defineProperty(window.LetsShoot, "STAGE_COMPLETE", { get: () => STAGE_COMPLETE });
		Object.defineProperty(window.LetsShoot, "SOUND_TEST", { get: () => SOUND_TEST });
		Object.defineProperty(window.LetsShoot, "QUIT", { get: () => QUIT });
	});

	// Listen for input to be able to activate the audio context as soon as possible
	window.addEventListener("click", () =>
	{
		SoundManager.UnBlock();
		Sound.Context.resume();
	});

	window.addEventListener("focus", () => show() );

	window.addEventListener("blur", () => hide() );

	document.addEventListener("visibilitychange", () => document.visibilityState === "visible" ? show() : hide());
	
	let hidden = false;

	function show()
	{
		if (hidden)
		{
			SoundManager.Block();

			if (MenuFrame._isMenuOn)
			{
				SoundManager.UnBlock();
				hidden = false;
				
				Sound.Context.resume();

				ParticleSystemMessages.Resume();
			}
			else
			{
				document.dispatchEvent(new KeyboardEvent("keydown", { key : "Escape" }));
				setTimeout(() =>
				{
					document.dispatchEvent(new KeyboardEvent("keyup", { key : "Escape" }));
					
					SoundManager.UnBlock();
					hidden = false;
					
					Sound.Context.resume();

					ParticleSystemMessages.Resume();
				}, 200);
			}
		}
		else
		{
			SoundManager.UnBlock();
			Sound.Context.resume();

			ParticleSystemMessages.Resume();
		}
	}

	function hide()
	{
		hidden = true;

		SoundManager.Block();

		// Will pause the game in a state which can be paused

		if (!MenuFrame._isMenuOn)
		{
			document.dispatchEvent(new KeyboardEvent("keydown", { key : "Escape" }));
			setTimeout(() =>
			{
				document.dispatchEvent(new KeyboardEvent("keyup", { key : "Escape" }))
			}, 200);
		}

		Sound.Context.suspend();

		ParticleSystemMessages.Pause();
	}

	window.addEventListener("contextmenu", (e) =>
	{
		e.preventDefault();
  		e.stopPropagation();
	});
}








