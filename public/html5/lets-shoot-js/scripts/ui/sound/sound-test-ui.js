"use strict";

{
	class SoundTestGui
	{
		constructor(sound, stage, bgmSoundTransform, sfxSoundTransform)
		{
			this._index = [];
			this._link = [];
			this._title = [];
			this._control = [];
			this._controlText = [];
			
			this._controlText.push("<<");
			this._controlText.push("PLAY");
			this._controlText.push("STOP");
			this._controlText.push(">>");
			   
			this._title.push("Kalim Clunk");
			this._link.push("http://www.newgrounds.com/audio/listen/152892");

			this._title.push("Main 1");
			this._link.push("https://nicolemakesmusic.wixsite.com/nicolemariet");

			this._title.push("Main 2");
			this._link.push("https://nicolemakesmusic.wixsite.com/nicolemariet");

			this._title.push("Main 3");
			this._link.push("https://nicolemakesmusic.wixsite.com/nicolemariet");
			
			this._title.push("Robots will be there. (Lite)");
			this._link.push("http://www.newgrounds.com/audio/listen/126548");
			
			this._title.push("Dryll (Lite)");
			this._link.push("http://www.newgrounds.com/audio/listen/103721");
			
			this._title.push("Drums");
			this._link.push("null");
			
			this._title.push("QQ PARTY");
			this._link.push("http://www.newgrounds.com/audio/listen/158488");
			
			this._stage = stage;
			this._bgmSoundTransform = bgmSoundTransform;
			this._sfxSoundTransform = sfxSoundTransform;
			this._currentIndex = 0;
			this._alpha = 0;
			
			let maxBGMIndex = 0;

			for (let i = 0; i < sound.length; i++)
			{
				if (sound[i].IsBGM())
					maxBGMIndex = i;
			}

			for (let i = 0; i < sound.length; i++)
			{
				if (sound[i].IsSFX())
				{
					this._title.push(`SFX ${i - maxBGMIndex}`);
					this._link.push("null");
				}

				this._index.push(i);
			}
			
			this._initPos = null;
			this._currentTheme = null;
			this._currentLink = null;
			this._bgmVolumeControl = null;
			this._sfxVolumeControl = null;
			
			this._font = null;
			this._controlColor = 0;
			this._linkColor = 0;
			this._themeColor = 0;
			this._controlFontSize = 0;
			this._linkFontSize = 0;
			this._themeFontSize = 0;
		}
		
		SetFont(font, controlColor, linkColor, themeColor)
		{
			this._font = font;
			this._controlColor = controlColor;
			this._linkColor = linkColor;
			this._themeColor = themeColor;
		}
		
		SetFontSizes(controlSize, linkSize, themeSize)
		{
			this._controlFontSize = controlSize;
			this._linkFontSize = linkSize;
			this._themeFontSize = themeSize;
		}
		
		SetPosition(pos)
		{
			this._initPos = pos.clone();
			
			this._currentTheme = new Text(pos, this._font, this._themeFontSize, this._themeColor, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._currentTheme.Update(this._title[this._currentIndex], this._themeColor, true, false, true, 0);
		}
		
		SetBGMVolumeSlider(title, width, height, knobRadius, thickness, lineColor, fillColor)
		{
			this._bgmVolumeControl = new VolumeControl(new Point(this._initPos.x, this._initPos.y + this._currentTheme._dimentions.y), this._bgmSoundTransform, this._stage, false);
			this._bgmVolumeControl.SetTitle(title, this._font, this._controlFontSize, this._themeColor);
			this._bgmVolumeControl.SetTrack(width, height, thickness, lineColor, fillColor);
			this._bgmVolumeControl.SetSlider(knobRadius, thickness, lineColor, fillColor);
		}
		
		InitBGMVolumeSlider(axis, minValue, maxValue, startValue, precision = 0)
		{
			this._bgmVolumeControl.Init(axis, minValue, maxValue, startValue, precision);
			this._bgmVolumeControl.ReSetPosition(-this._bgmVolumeControl.GetFullLenght() / 2, 0);
			this._bgmVolumeControl.Update(0);
		}

		SetSFXVolumeSlider(title, width, height, knobRadius, thickness, lineColor, fillColor)
		{
			this._sfxVolumeControl = new VolumeControl(new Point(this._initPos.x, this._initPos.y + this._currentTheme._dimentions.y * 2), this._sfxSoundTransform, this._stage, false);
			this._sfxVolumeControl.SetTitle(title, this._font, this._controlFontSize, this._themeColor);
			this._sfxVolumeControl.SetTrack(width, height, thickness, lineColor, fillColor);
			this._sfxVolumeControl.SetSlider(knobRadius, thickness, lineColor, fillColor);
		}
		
		InitSFXVolumeSlider(axis, minValue, maxValue, startValue, precision = 0)
		{
			this._sfxVolumeControl.Init(axis, minValue, maxValue, startValue, precision);
			this._sfxVolumeControl.ReSetPosition(-this._sfxVolumeControl.GetFullLenght() / 2, 0);
			this._sfxVolumeControl.Update(0);
		}
		
		SetControls(offSet)
		{
			let pos;
			let totalLenght = 0;
			
			for (let i = 0; i < this._controlText.length; i++)
			{
				if (i === 0)
				{
					pos = new Point(this._initPos.x, this._sfxVolumeControl.GetPosition().y + this._sfxVolumeControl.GetDimentions().y + offSet);
				}
				else
				{
					pos = new Point(
						this._control[this._control.length - 1].GetText().GetTextField().x+this._control[this._control.length - 1].GetText()._dimentions.x + offSet,
						this._sfxVolumeControl.GetPosition().y + this._sfxVolumeControl.GetDimentions().y + offSet
					);
				}

				this._control.push(new Button(pos, this._controlText[i], this._font, this._controlFontSize, this._controlColor, this._stage));
				
				totalLenght += this._control[this._control.length - 1].GetText()._dimentions.x + offSet;
				this._control[this._control.length - 1].Update(0, false, false, false);
				
				pos = null;
			}
			
			totalLenght -= offSet;
			
			for (let i = 0; i < this._controlText.length; i++)
			{
				this._control[i].UpdatePos(-totalLenght / 2, 0);
				this._control[i].Update(0, false, false, false);
			}
		}
		
		SetLink()
		{
			let pos = new Point(this._initPos.x, this._control[0].GetText().GetTextField().y + this._control[0].GetText()._dimentions.y * 2);
			this._currentLink = new Button(pos, "Click here for the original track", this._font, this._linkFontSize, this._linkColor, this._stage);
			this._currentLink.Update(0, true, false, true);
		}
		
		Update(fadeOut)
		{
			if (fadeOut)
			{
				if (this._alpha > 0)
				{
					this._alpha -= 0.1;
				}
				else
				{
					this._alpha = 0;
					
					return - 1;
				}
			}
			else
			{
				if (this._alpha < 1)
				{
					this._alpha += 0.1;
				}
				else
				{
					this._alpha = 1;
				}
			}
			
			for (let i = 0; i < this._controlText.length; i++)
			{
				if (this._control[i].CheckCollision(LetsShoot._click))
				{
					if (i === 0)
					{
						this._currentIndex--;
					}

					if (i === 1)
					{
						SoundManager.StopAll();
						SoundManager.Play(this._index[this._currentIndex]);
					}

					if (i === 2)
					{
						SoundManager.StopAll();
					}

					if (i === this._control.length - 1)
					{
						this._currentIndex++;
					}
					
					if (this._currentIndex < 0)
					{
						this._currentIndex = this._index.length - 1;
					}
					if (this._currentIndex > this._index.length - 1)
					{
						this._currentIndex = 0;
					}
				}
				
				this._control[i].Update(this._alpha, false, false, true);
			}
			
			let linkVisible;
			this._link[this._currentIndex] === "null" ? linkVisible = false : linkVisible = true;
			
			if (linkVisible)
			{
				if (this._currentLink.CheckCollision(LetsShoot._click))
				{
					SoundManager.StopAll();
					
					const win = window.open(this._link[this._currentIndex], "_blank");
					win.focus();
				}
			}
			
			this._currentTheme.Update(this._title[this._currentIndex], this._themeColor, true, false, true, this._alpha);
			this._currentLink.Update(this._alpha, true, false, linkVisible);
			this._bgmVolumeControl.Update(this._alpha);
			this._sfxVolumeControl.Update(this._alpha);
			
			return 0;
		}
		
		Clean()
		{
			SoundManager.Stop(this._index[this._currentIndex]);
			
			this._index = null;
			this._link = null;
			this._title = null;
			this._controlText = null;
			this._control = null;
			
			this._currentTheme.Clean();
			this._currentLink.Clean();
			this._bgmVolumeControl.Clean();
			this._sfxVolumeControl.Clean();
			
			this._bgmVolumeControl = null;
			this._sfxVolumeControl = null;
			this._initPos = null;
			this._stage = null;
		}
	}

	window.SoundTestGui = SoundTestGui;
}