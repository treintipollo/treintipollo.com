"use strict";

{
	class DifficultySelect extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._screen = null;
			this._buttonManager = null;
			this._pointer = null;
			
			this._difficuties = null;
		}
		
		Init()
		{
			this._difficuties = [];
			this._difficuties.push("EASY");
			this._difficuties.push("NORMAL");
			this._difficuties.push("HARD");
			
			this._buttonManager = new SplashButtonManager(this._stage);
			this._screen = new SplashManager(this._stage);
			
			this._screen.SetTextProps("Digital-7", 85, 0xff00ff00, 0x00000000, 10);
			this._screen.SetUnderlineProps(0x440000ff, 0xbb0000ff, 10, 10);
			this._screen.SetTextMovement(0.05 ,true, 5, 0.1);
			this._screen.AddText(this._stage.stageWidth / 2, 60, "DIFFICULTY SELECT", true, true);
			
			for (let i = 0; i < this._difficuties.length; i++)
			{
				this._buttonManager.SetText("Digital-7", 100, 0xff00ff00, 0xff880000);
				this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
				this._buttonManager.Add(this._stage.stageWidth / 2, (120 * (i + 1)) + 100, this._difficuties[i], true);
			}
			
			this._pointer = new CustomPointer(this._stage);
			
			DifficultySelect._difficulty = null;
			
			MainBody.SetInitParams(3, 10, 1, 2, 1, 4);
			MainBody.SetInitParams2(0, 1, 5);
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
							DifficultySelect._difficulty = DifficultySelect.EASY;
							this._nextState = LetsShoot.LEVEL_SELECT;
							break;
						case 1:
							DifficultySelect._difficulty = DifficultySelect.NORMAL;
							this._nextState = LetsShoot.LEVEL_SELECT;
							break;
						case 2:
							DifficultySelect._difficulty = DifficultySelect.HARD;
							this._nextState = LetsShoot.LEVEL_SELECT;
							break;
					}
				}
				
				if (DifficultySelect._difficulty !== null)
				{
					this._isCompleted = true;
				}
			}
			
			if (!this._buttonManager.WasButtonPressed())
			{
				this._pointer.Update();
			}
			else
			{
				if (this._pointer !== null)
				{
					this._pointer.Clean();
					this._pointer = null;
				}
			}
		}
		
		Completed()
		{
			if (this._screen !== null)
			{
				this._screen.Clean();
				this._screen = null;
			}
			
			if (this._buttonManager !== null)
			{
				this._buttonManager.Clean();
				this._buttonManager = null;
			}
			
			if (this._pointer !== null)
			{
				this._pointer.Clean();
				this._pointer = null;
			}
			
			this._difficuties = null;
		}
		
		CleanSpecific()
		{

		}
	}

	DifficultySelect._difficulty;

	DifficultySelect.EASY = "Easy";
	DifficultySelect.NORMAL = "Normal";
	DifficultySelect.HARD = "Hard";

	window.DifficultySelect = DifficultySelect;
}