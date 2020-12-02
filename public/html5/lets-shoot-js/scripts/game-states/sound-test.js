"use strict";

{
	class SoundTest extends State
	{
		constructor(stage)
		{
			super(stage);
			
			this._soundTestGui = null;
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
			this._screen.AddText(this._stage.stageWidth / 2, 60, "SOUND TEST", true, true);
			
			this._buttonManager.SetText("Digital-7", 80, 0xff00ff00, 0xff880000);
			this._buttonManager.SetAnim(1, 5, 0.05, 10, 20);
			this._buttonManager.Add(this._stage.stageWidth / 2, 520, "BACK", true);
			
			this._soundTestGui = new SoundTestGui(
				SoundManager.GetSoundArray(),
				this._stage,
				SoundManager.GetSoundTransform(true),
				SoundManager.GetSoundTransform(false)
			);
			
			this._soundTestGui.SetFont("Digital-7", 0xff0000ff, 0xffff0000, 0xff00ff00);
			this._soundTestGui.SetFontSizes(40, 30, 50);
			this._soundTestGui.SetPosition(new Point(this._stage.stageWidth / 2, 180));
			this._soundTestGui.SetBGMVolumeSlider("BGM VOLUME", 200, 10, 15, 2, 0xff777777, 0xff000000);
			this._soundTestGui.InitBGMVolumeSlider("x", 0, 200, 100);
			this._soundTestGui.SetSFXVolumeSlider("SFX VOLUME", 200, 10, 15, 2, 0xff777777, 0xff000000);
			this._soundTestGui.InitSFXVolumeSlider("x", 0, 200, 100);

			this._soundTestGui.SetControls(30);
			this._soundTestGui.SetLink();
			
			this._pointer = new CustomPointer(this._stage);
		}
		
		Run()
		{
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
							this._nextState = LetsShoot.SPLASH_SCREEN;
							break;
					}
				}
			}
			
			if (!this._buttonManager.WasButtonPressed())
			{
				this._pointer.Update();
				this._soundTestGui.Update(false);
			}
			else
			{
				if (this._pointer !== null)
				{
					this._pointer.Clean();
					this._pointer = null;
				}

				this._soundTestGui.Update(true);
			}
		}
		
		Completed()
		{
			if (this._soundTestGui !== null)
			{
				this._soundTestGui.Clean();
				this._soundTestGui = null;
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

	window.SoundTest = SoundTest;
}