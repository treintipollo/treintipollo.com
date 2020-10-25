"use strict";
{
	class StageComplete extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._levelEndSign = null;
			this._congratulations = null;
			this._currentCongrats = 0;
		}
		
		Init()
		{
			this._congratulations = new Array();
			this._congratulations.push("COMPLETE !!!");
			this._congratulations.push("AWESOME !!!");
			this._congratulations.push("AMAZING !!!");
			this._congratulations.push("GREAT !!!");
			this._currentCongrats = NumberUtils.randRange(0, this._congratulations.length - 1, true);
			
			this._levelEndSign = new LevelEndSign(this._congratulations[this._currentCongrats], "Digital-7", 100, 0xff00ff00, this._stage);
			this._levelEndSign.Init(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0x770000ff, 0x77007700, 10, 7, 20, 1);
			
			SoundManager.Play(Sounds.COMPLETE);
		}
		
		Run()
		{
			if (this._levelEndSign.Update())
			{
				this._isCompleted = true;
				
				if (LevelSelect._difficulty < 3)
				{
					this._nextState = LetsShoot.LEVEL_SELECT;
				}
				else
				{
					if (LevelSelect._branch != 4)
					{
						this._nextState = LetsShoot.FREE_UPGRADE;
					}
					else
					{
						this._nextState = LetsShoot.ALL_CLEAR;
					}
				}
				
				LevelSelect.Cleared(LevelSelect._difficulty, LevelSelect._branch);
			}
		}
		
		Completed()
		{
			this._levelEndSign.Clean();
			this._levelEndSign = null;
			this._congratulations = null;
		}
		
		CleanSpecific()
		{

		}
	}

	window.StageComplete = StageComplete;
}