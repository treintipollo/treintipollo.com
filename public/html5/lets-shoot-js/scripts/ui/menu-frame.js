"use strict";

{
	const BLINK_SPEED = 0.017 * 3;

	let _isMenuOn = false;

	class MenuFrame
	{
		constructor(x, y, bgColor, fgColor, borderThickness, stage)
		{
			this._pos = new Point(x, y);
			this._stage = stage;
			
			this._bgColor = bgColor;
			this._fgColor = fgColor;
			this._borderThickness = borderThickness;
			
			this._button = [];
			this._buttonPos = [];
			
			this._longestWidth = 0;
			this._totalHeight = 0;
			this._option = -1;
			this._borderColor = 0;
			
			this._pointer = new CustomPointer(this._stage);

			this._frame = null;
			this._frameBorder = null;
			this._title = null;
			
			this._titlePos = null;
			this._titleText = "";
			this._titleColor = 0;
			
			this._buttonPressed = false;
			this._fadeOut = false;
			this._playFadeOutFeedback = false;
			this._useSound = false;
			this._stopSound = false;
			
			this._soundGui = null;
		}
		
		SetTitle(text, font, size, color)
		{
			this._titlePos = this._pos.clone();
			
			this._titleText = text;
			this._titleColor = color;
			
			this._title = new Text(this._titlePos, font, size, color, this._stage, true);
			this._title.Update(text, color, true, false, true, 0);
			
			const texField = this._title.GetTextField();

			if (texField.width > this._longestWidth)
				this._longestWidth = texField.width + this._borderThickness *  4;
			
			this._totalHeight += texField.height + this._borderThickness;
		}
		
		AddButton(text, font, size, color, toolTipText = null, toolTipOffSet = 0)
		{
			this._buttonPos.push(new Point(-300, -300));
			this._button.push(new Button(this._buttonPos[this._buttonPos.length - 1], text, font, size, color, this._stage));
			
			if (toolTipText !== null)
				this._button[this._buttonPos.length - 1].SetToolTip(toolTipText, toolTipOffSet);
			
			this._button[this._buttonPos.length - 1].Update(0);
			
			const texField = this._button[this._buttonPos.length - 1].GetText().GetTextField();
			
			if (texField.width + this._borderThickness * 4 > this._longestWidth)
				this._longestWidth = texField.width + this._borderThickness * 4;
			
			this._totalHeight += texField.height + this._borderThickness;
		}
		
		Init(useSound = true, pauseParticles = true, useSoundSettings = true, stopSound = false)
		{
			this._frame = new Shape();

			this._frame.snapToPixel = true;
			this._frame.x = Math.floor(this._pos.x - (this._longestWidth) / 2);
			this._frame.y = Math.floor(this._pos.y - (this._totalHeight + this._borderThickness * 4) / 2);
			this._frame.alpha = 0;
			
			this._frameBorder = new Shape();
			this._frameBorder.snapToPixel = true;
			this._frameBorder.x = Math.floor(this._pos.x - (this._longestWidth) / 2);
			this._frameBorder.y = Math.floor(this._pos.y - (this._totalHeight + this._borderThickness * 4) / 2);
			this._frameBorder.alpha = 0;
			
			this._stage.addChildAt(this._frame, this._stage.numChildren - this._button.length - 1);
			this._stage.addChildAt(this._frameBorder, this._stage.numChildren - this._button.length - 1);

			this._fadeOut = false;
			this._playFadeOutFeedback = true;
			
			this._useSound = useSound;
			this._stopSound = stopSound;
			
			if (useSound)
				SoundManager.Play(Sounds.MENU_ON);

			_isMenuOn = pauseParticles;
			
			if (useSoundSettings)
			{
				this._soundGui = new SoundManagerGui(
					this._stage.stageWidth / 2 - (175 - 14),
					Grid_Revenge.GetNodeSize().y / 2,
					0xffff0000,
					0xff000000,
					7,
					this._stage
				);

				this._soundGui.SetGuiTitle("SOUND SETTINGS", "Digital-7", 30, 0xffffff00);
				
				this._soundGui.AddSliderTitle("BGM VOLUME", "Digital-7", 25, 0xff00ff00);
				this._soundGui.SetSliderTrack(100, 7, 2, 0xff777777, 0xff000000);
				this._soundGui.SetSliderKnob(10, 2, 0xff777777, 0xff000000);
				this._soundGui.SetSliderSound(Sounds.TEST_BGM, SoundManager.GetSoundTransform(true));
				this._soundGui.SetSliderProperties("x", 0, 100, 100, 2);
				
				this._soundGui.AddSliderTitle("SFX VOLUME", "Digital-7", 25, 0xff00ff00);
				this._soundGui.SetSliderTrack(100, 7, 2, 0xff777777, 0xff000000);
				this._soundGui.SetSliderKnob(10, 2, 0xff777777, 0xff000000);
				this._soundGui.SetSliderSound(Sounds.LAUGH, SoundManager.GetSoundTransform(false));
				this._soundGui.SetSliderProperties("x", 0, 100, 100, 2);
				
				this._soundGui.Init();
			}
			
			if (this._stopSound)
				SoundManager.BGMSwitch(true);

			const bgColor = createjs.Graphics.getRGB(this._bgColor);
			const fgColor = createjs.Graphics.getRGB(this._fgColor);

			const width = Math.floor(this._longestWidth);
			const height = Math.floor(this._totalHeight + this._borderThickness * 4);
			const border = Math.floor(this._borderThickness);

			this._frame.graphics.clear();
			this._frame.graphics.beginFill(fgColor);
			this._frame.graphics.rect(0, 0, width, height);
			this._frame.cache(0, 0, width, height);
			
			this._frameBorder.graphics.clear();
			this._frameBorder.graphics.beginFill(bgColor);
			this._frameBorder.graphics.rect(0, 0, width, border);
			this._frameBorder.graphics.rect(0, 0, border, height);
			this._frameBorder.graphics.rect(width - border, 0, border, height);
			this._frameBorder.graphics.rect(0, height - border, width, border);
			this._frameBorder.cache(0, 0, width, height);
		}
		
		Update(click)
		{
			if (this._fadeOut)
			{
				if (this._frame.alpha > 0)
				{
					this._frame.alpha -= 0.1;
					this._frameBorder.alpha -= 0.1;
				}
				else
				{
					this._frame.alpha = 0;
					this._frameBorder.alpha = 0;
					
					return -2;
				}
			}
			else
			{
				if (this._frame.alpha < 1)
				{
					this._frame.alpha += 0.1;
					this._frameBorder.alpha += 0.1;
				}
				else
				{
					this._frame.alpha = 1;
					this._frameBorder.alpha = 1;
				}
			}
			
			this._buttonPressed = false;
			
			this._borderColor += BLINK_SPEED;
			this._frameBorder.alpha = (Math.sin(this._borderColor) + 1) / 2;

			this._titlePos.y = this._frame.y + this._borderThickness * 4;
			this._title.Update(this._titleText, this._titleColor, true, true, true, this._frame.alpha);
			
			for (let i = 0; i < this._button.length; i++)
			{
				const buttonTextfield = this._button[0].GetText().GetTextField();
				const titleTextField = this._title.GetTextField();

				this._buttonPos[i].x = this._frame.x + this._frame.width / 2;
				this._buttonPos[i].y = (this._frame.y + (buttonTextfield.height + this._borderThickness) * (i + 1)) + titleTextField.height;
				
				if (this._frame.alpha >= 1)
				{
					if (this._button[i].CheckCollision(click))
					{
						this._option = i;
						this._buttonPressed = true;
					}
				}
				
				this._button[i].Update(this._frame.alpha);
			}
			
			if (!this._buttonPressed)
				this._option = -1;
			
			this._pointer.Update();
			
			if (this._soundGui !== null)
				this._soundGui.Update(this._frame.alpha);
			
			return this._option;
		}
		
		GetButtonAmount()
		{
			return this._button.length - 1;
		}
		
		UpdateButtonTooltip(buttonIndex, text)
		{
			this._button[buttonIndex].UpdateTooltipText(text);
		}
		
		StartFadeOut()
		{
			this._fadeOut = true;
			
			if (this._useSound)
			{
				if (this._playFadeOutFeedback)
				{
					SoundManager.Play(Sounds.MENU_OFF);
					this._playFadeOutFeedback = false;
				}
			}
		}
		
		Clean()
		{
			this._stage.removeChild(this._frame);
			this._stage.removeChild(this._frameBorder);
			
			this._title.Clean();
			this._pointer.Clean();
			
			if (this._soundGui !== null)
			{
				this._soundGui.Clean();
				this._soundGui = null;
			}
			
			if (this._stopSound)
				SoundManager.BGMSwitch(true);
			
			for (let i = 0; i < this._button.length; i++)
			{
				this._button[i].Clean();
				this._buttonPos[i] = null;
			}

			this._button = null;
			this._buttonPos = null;
			
			this._pointer = null;
			this._stage = null;
			this._frame = null;
			this._frameBorder = null;
			this._titlePos = null;
			this._title = null;
			this._pos = null;
			
			_isMenuOn = false;
		}
	}

	window.MenuFrame = MenuFrame;

	Object.defineProperty(window.MenuFrame, "_isMenuOn", { set: (x) => _isMenuOn = x, get: () => _isMenuOn });
}