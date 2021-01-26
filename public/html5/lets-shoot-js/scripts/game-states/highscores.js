"use strict";

{
	const sortHighscores = (arr) =>
	{
		arr.sort((f, s) => Number(s["score"]) - Number(f["score"]));

		for (let i = 0; i < arr.length; i++)
		{
			const entry = arr[i];

			entry["rank"] = `${i + 1}`.padStart(3, "0");
		}
	}

	const timeToString = (time) =>
	{
		if (isNaN(time))
			return "--:--:--";

		 // 1- Convert to seconds:
	    let seconds = time / 1000;
	    // 2- Extract hours:
	    let hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
	    
	    seconds = seconds % 3600; // seconds remaining after extracting hours
	    // 3- Extract minutes:
	    let minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
	    // 4- Keep only seconds not extracted to minutes:
	    seconds = Math.floor(seconds % 60);

	    const stringH = String(hours).toString().padStart(2, "0");
	    const stringM = String(minutes).toString().padStart(2, "0");
	    const stringS = String(seconds).toString().padStart(2, "0");

	    return `${stringH}:${stringM}:${stringS}`;
	}

	let highscores = localStorage.getItem("highscores");

	if (!highscores)
	{
		highscores = [];

		const easy = [];

		for (let i = 0; i < 100; i++)
		{
			easy.push({
				"rank": `${i + 1}`.padStart(3, "0"),
				"score": String((i + 1) * 5000).toString().padStart(15, "0"),
				"name": "---",
				"time": "--:--:--"
			});
		}

		const normal = [];

		for (let i = 0; i < 100; i++)
		{
			normal.push({
				"rank": `${i + 1}`.padStart(3, "0"),
				"score": String((i + 1) * 10000).toString().padStart(15, "0"),
				"name": "---",
				"time": "--:--:--"
			});
		}

		const hard = [];

		for (let i = 0; i < 100; i++)
		{
			hard.push({
				"rank": `${i + 1}`.padStart(3, "0"),
				"score": String((i + 1) * 20000).toString().padStart(15, "0"),
				"name": "---",
				"time": "--:--:--"
			});
		}

		sortHighscores(easy);
		sortHighscores(normal);
		sortHighscores(hard);

		highscores.push(easy);
		highscores.push(normal);
		highscores.push(hard);

		localStorage.setItem("highscores", JSON.stringify(highscores));

		window.HighscoresStorage = highscores;
	}
	else
	{
		window.HighscoresStorage = JSON.parse(highscores);
	}

	window.AddHighscoreEntry = (score, name, time, difficultyIndex) =>
	{
		const entry = {
			"rank": `001`,
			"score": String(score).toString().padStart(15, "0"),
			"name": name,
			"time": timeToString(time)
		};

		let highScores = window.HighscoresStorage[difficultyIndex];

		highScores.push(entry);

		sortHighscores(highScores);

		highScores = highScores.slice(0, 100);

		localStorage.setItem("highscores", JSON.stringify(window.HighscoresStorage));
	};

	window.HighscoreQualify = (score, difficultyIndex) =>
	{
		const highscores = window.HighscoresStorage[difficultyIndex];

		for (const highscoreEntry of highscores)
		{
			const entryScore = Number(highscoreEntry["score"]);

			if (score > entryScore)
				return true;
		}

		return false;
	}

	window.GetRank = (score, difficultyIndex) =>
	{
		const highscores = window.HighscoresStorage[difficultyIndex];

		for (const highscoreEntry of highscores)
		{
			const entryScore = Number(highscoreEntry["score"]);

			if (score > entryScore)
				return highscoreEntry["rank"];
		}

		return "100";
	}

	window.GetTime = (time) =>
	{
		return timeToString(time);
	}

	class Highscores extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._highscoresGui = null;
			this._pointer = null;
			this._buttonManager = null;
			this._screen = null;
			
			this._lastState = null;
			this._difficulty = null;
			this._rank = null;
		}
		
		Init(args)
		{
			if (args)
			{
				this._lastState = args.lastState;
				this._difficulty = args.difficulty;
				this._rank = args.rank;
			}
			else
			{
				this._lastState = null;
				this._difficulty = null;
				this._rank = null;
			}

			this._buttonManager = new SplashButtonManager(this._stage);
			this._screen = new SplashManager(this._stage);
			
			this._screen.SetTextProps("Digital-7", 85, 0xff00ff00, 0x00000000, 10);
			this._screen.SetUnderlineProps(0x440000ff, 0xbb0000ff, 10, 10);
			this._screen.SetTextMovement(0.05 ,true, 5, 0.1);
			this._screen.AddText(this._stage.stageWidth / 2, 60, "HIGHSCORES", true, true);

			this._buttonManager.SetText("Digital-7", 70, 0xff00ff00, 0xff880000);
			this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
			this._buttonManager.Add(this._stage.stageWidth / 2, 550, "BACK", true);
			
			this._highscoresGui = new HighscoresGui(this._stage);
			
			this._highscoresGui.SetFont("Digital-7", 0xff0000ff, 0xff00ff00);
			this._highscoresGui.SetFontSizes(40, 35);
			
			this._highscoresGui.AddDifficultyRow(new Point(this._stage.stageWidth / 2, 140));

			for (let i = 0; i < 10; i++)
				this._highscoresGui.AddRow(new Point(this._stage.stageWidth / 2, 160 + (35 * i)));

			this._highscoresGui.AddControls(new Point(this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 35));

			this._pointer = new CustomPointer(this._stage);

			if (this._difficulty !== null)
				this._highscoresGui.SetDifficultyAndPage(this._difficulty, this._rank);
		}
		
		Run()
		{
			SoundManager.Play(Sounds.INTRO_BGM);

			if (!this._buttonManager.Update(LetsShoot._click))
			{
				this._screen.Update(this._buttonManager.WasButtonPressed());
			}
			else
			{
				if (this._screen.Update(this._buttonManager.WasButtonPressed()))
				{
					switch(this._buttonManager.GetButtonPressedIndex())
					{
						case 0:
						{
							this._isCompleted = true;
							
							if (this._lastState === LetsShoot.HIGHSCORE_NAME_ENTRY)
							{
								this._nextState = LetsShoot.SPLASH_SCREEN;
							}
							else
							{
								this._nextState = LetsShoot.OPTIONS;
							}

							break;
						}
					}
				}
			}
			
			if (!this._buttonManager.WasButtonPressed())
			{
				this._pointer.Update();
				this._highscoresGui.Update(false);
			}
			else
			{
				if (this._pointer !== null)
				{
					this._pointer.Clean();
					this._pointer = null;
				}

				this._highscoresGui.Update(true);
			}
		}
		
		Completed()
		{
			if (this._highscoresGui !== null)
			{
				this._highscoresGui.Clean();
				this._highscoresGui = null;
			}

			if (this._pointer !== null)
			{
				this._pointer.Clean()
				this._pointer = null;
			}

			if (this._buttonManager !== null)
			{
				this._buttonManager.Clean();
				this._buttonManager = null;
			}

			if (this._screen !== null)
			{
				this._screen.Clean();
				this._screen = null;
			}
		}
		
		CleanSpecific()
		{
			
		}
	}

	window.Highscores = Highscores;
}