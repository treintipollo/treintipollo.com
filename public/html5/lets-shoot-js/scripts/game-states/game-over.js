"use strict";

{
	class GameOver extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._levelEndSign = null;
			this._gameOverPhrases = null;
			this._signCounter = 0;
			this._currentPhrase = 0;
			this._createSign = false;
		}
		
		Init()
		{
			this._gameOverPhrases = [];
			this._gameOverPhrases.push(["YOUR ASS", "IS GRASS"]);
			this._gameOverPhrases.push(["NICE TRY","BUT NO BANANAS"]);
			
			this._signCounter = 0;
			this._currentPhrase = NumberUtils.randRange(0, this._gameOverPhrases.length - 1, true);
			this._createSign = true;
			
			SoundManager.Play(Sounds.LAUGH);
		}
		
		Run()
		{
			if (this._createSign)
			{
				this._levelEndSign = new LevelEndSign(this._gameOverPhrases[this._currentPhrase][this._signCounter], "Digital-7", 100, 0xffff0000, this._stage);
				this._levelEndSign.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0x77ff0000, 0x77ff7700, 10, 8, 20, 1);
				this._createSign = false;
			}
			
			if (this._levelEndSign.Update())
			{
				if (this._signCounter < this._gameOverPhrases[this._currentPhrase].length - 1)
				{
					this._signCounter++;
					this._levelEndSign.Clean();
					this._levelEndSign = null;
					this._createSign = true;
				}
				else
				{
					this._isCompleted = true;
					this._nextState = LetsShoot.SPLASH_SCREEN;
				}
			}
		}
		
		Completed()
		{
			for(let i = 0; i < this._gameOverPhrases.length; i++)
			{
				this._gameOverPhrases[i] = null;
			}

			this._gameOverPhrases = null;
		}
		
		CleanSpecific()
		{
			
		}
	}

	window.GameOver = GameOver;
}