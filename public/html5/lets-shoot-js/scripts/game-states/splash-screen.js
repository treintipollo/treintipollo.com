"use strict";

{
	class SplashScreen extends State
	{
		constructor(stage)
		{
			super(stage);

			this._screen = null;
			this._buttonManager = null;
			this._pointer = null;
			this._shootingStar = null;
			this._buttonsText = null;
		}

		Init()
		{
			MainBody.SetInitParams(3, 10, 1, 2, 1, 4);
			MainBody.SetInitParams2(0, 1, 5);
			
			LevelSelect.SetInitParams(3, 4);
			ChainCounter.ResetGlobalScore();

			// ChainCounter._globalScore = 10000000;

			// LevelSelect.Cleared(0, 0);
			// LevelSelect.Cleared(0, 1);
			// LevelSelect.Cleared(0, 2);
			// LevelSelect.Cleared(0, 3);

			// LevelSelect.Cleared(1, 0);
			// LevelSelect.Cleared(1, 1);
			// LevelSelect.Cleared(1, 2);
			// LevelSelect.Cleared(1, 3);

			// LevelSelect.Cleared(2, 0);
			// LevelSelect.Cleared(2, 1);
			// LevelSelect.Cleared(2, 2);
			// LevelSelect.Cleared(2, 3);

			// LevelSelect.Cleared(3, 0);
			// LevelSelect.Cleared(3, 1);
			// LevelSelect.Cleared(3, 2);
			// LevelSelect.Cleared(3, 3);
			
			this._pointer = new CustomPointer(this._stage);
			this._screen = new SplashManager(this._stage);
			
			this._screen.SetTextProps("Digital-7", 150, 0xff00ff00, 0x00000000, 10);
			this._screen.SetUnderlineProps(0x440000ff, 0xbb0000ff, 5, 10);
			this._screen.SetTextMovement(0.05 ,true, 5, 0.1);
			this._screen.AddText(this._stage.stageWidth / 2 + 30, 20, "LET'S", true);
			this._screen.AddText(this._stage.stageWidth / 2 + 30, 160, "SHOOT", true);
			this._screen.SetImage(Images._exclamation);
			this._screen.SetImageProps(1, 10, 0.05, 10, 20);
			this._screen.AddImage(this._stage.stageWidth - 100, 50);
			
			this._buttonManager = new SplashButtonManager(this._stage);
			
			this._buttonsText = [];
			this._buttonsText.push("START");
			this._buttonsText.push("CONTROLS");
			this._buttonsText.push("SOUND TEST");
			this._buttonsText.push("QUIT");
			
			for (let i = 0; i < this._buttonsText.length; i++)
			{
				this._buttonManager.SetText("Digital-7", 55, 0xff00ff00, 0xff880000);
				this._buttonManager.SetAnim(1, 10, 0.05, 10, 20);
				this._buttonManager.Add(
					10,
					((70 * (i + 1)) + this._stage.stageHeight / 2 - 40) - 10,
					this._buttonsText[i]
				);
			}
			
			this._shootingStar = new ShootingStar(this._stage.stageWidth / 2, this._stage.stageHeight / 2, 8, this._stage);
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
					switch (this._buttonManager.GetButtonPressedIndex())
					{
						case 0:
							this._isCompleted = true;
							this._nextState = LetsShoot.DIFFICULTY_SELECT;
							break;
						case 1:
							this._isCompleted = true;
							this._nextState = LetsShoot.PRACTICE;
							break;
						case 2:
							this._isCompleted = true;
							this._nextState = LetsShoot.SOUND_TEST;
							break;
						case 3:
							this._isCompleted = true;
							this._nextState = LetsShoot.QUIT;
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
				if (this._pointer)
				{
					this._pointer.Clean();
					this._pointer = null;
				}
			}
			
			this._shootingStar.Update(LetsShoot._click);
		}
		
		Completed()
		{
			if (this._screen)
			{
				this._screen.Clean();
				this._screen = null;
			}
			
			if (this._buttonManager)
			{
				this._buttonManager.Clean();
				this._buttonManager = null;
			}
			
			if (this._pointer)
			{
				this._pointer.Clean();
				this._pointer = null;
			}
			
			if (this._shootingStar)
			{
				this._shootingStar.Clean();
				this._shootingStar = null;
			}
		}
		
		CleanSpecific()
		{
		
		}
	}

	window.SplashScreen = SplashScreen;
}