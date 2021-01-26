"use strict";

{
	class Options extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._pointer = null;
			this._buttonManager = null;
			this._screen = null;
		}
		
		Init()
		{
			this._buttonManager = new SplashButtonManager(this._stage);
			this._screen = new SplashManager(this._stage);
			
			this._screen.SetTextProps("Digital-7", 85, 0xff00ff00, 0x00000000, 10);
			this._screen.SetUnderlineProps(0x440000ff, 0xbb0000ff, 10, 10);
			this._screen.SetTextMovement(0.05 ,true, 5, 0.1);
			this._screen.AddText(this._stage.stageWidth / 2, 60, "OPTIONS", true, true);
			
			this._buttonManager.SetText("Digital-7", 80, 0xff00ff00, 0xff880000);
			this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
			this._buttonManager.Add(this._stage.stageWidth / 2, 200, "HIGHSCORES", true);

			this._buttonManager.SetText("Digital-7", 80, 0xff00ff00, 0xff880000);
			this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
			this._buttonManager.Add(this._stage.stageWidth / 2, 300, "SOUND TEST", true);

			this._buttonManager.SetText("Digital-7", 80, 0xff00ff00, 0xff880000);
			this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
			this._buttonManager.Add(this._stage.stageWidth / 2, 520, "BACK", true);
			
			this._pointer = new CustomPointer(this._stage);
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
							this._isCompleted = true;
							this._nextState = LetsShoot.HIGHSCORES_TABLE;
							// this._nextState = LetsShoot.HIGHSCORE_NAME_ENTRY;
							// this._nextState = LetsShoot.ALL_CLEAR;
							break;
						case 1:
							this._isCompleted = true;
							this._nextState = LetsShoot.SOUND_TEST;
							break;
						case 2:
							this._isCompleted = true;
							this._nextState = LetsShoot.SPLASH_SCREEN;
							break;
					}
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

	window.Options = Options;
}