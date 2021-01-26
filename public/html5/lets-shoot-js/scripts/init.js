"use strict"

{
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
	let OPTIONS = NaN;
	let HIGHSCORES_TABLE = NaN;
	let HIGHSCORE_NAME_ENTRY = NaN;

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
			OPTIONS = this._stateMachine.Add(new Options(stage));
			HIGHSCORES_TABLE = this._stateMachine.Add(new Highscores(stage));
			HIGHSCORE_NAME_ENTRY = this._stateMachine.Add(new NameEntry(stage));

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
		Object.defineProperty(window.LetsShoot, "OPTIONS", { get: () => OPTIONS });
		Object.defineProperty(window.LetsShoot, "HIGHSCORES_TABLE", { get: () => HIGHSCORES_TABLE });
		Object.defineProperty(window.LetsShoot, "HIGHSCORE_NAME_ENTRY", { get: () => HIGHSCORE_NAME_ENTRY });
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
				}, 200);
			}
		}
		else
		{
			SoundManager.UnBlock();
			Sound.Context.resume();
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
	}

	window.addEventListener("contextmenu", (e) =>
	{
		e.preventDefault();
  		e.stopPropagation();
	});
}








