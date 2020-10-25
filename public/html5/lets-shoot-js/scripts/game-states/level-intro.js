"use strict";

{
	class LevelIntro extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._stopLight = null;
		}
		
		Init()
		{
			this._stopLight = new StopLigth(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 400, 200, 10, this._stage);
			this._stopLight.Init(10, 0xFFAEAEAE, 0xFFD3D3D3);
			
			SoundManager.Stop(Sounds.INTRO_BGM);
			
			if (LevelSelect._difficulty === 3)
			{
				SoundManager.Play(Sounds.BOSS_BGM);
			}
			else
			{
				SoundManager.Play(Sounds.MAIN_BGM);
			}
		}
		
		Run()
		{
			if (!this._stopLight._done)
			{
				this._stopLight.Update();
			}
			else
			{
				this._isCompleted = true;
				
				// This means it's a Boss Stage!
				if (LevelSelect._difficulty === 3)
				{
					this._nextState = LetsShoot.BOSS;
				}
				else
				{
					this._nextState = LetsShoot.MAIN_GAME;
				}
			}
		}
		
		Completed()
		{
			this._stopLight.Clean();
			this._stopLight = null;
		}
		
		CleanSpecific()
		{
		}
	}

	window.LevelIntro = LevelIntro;
}