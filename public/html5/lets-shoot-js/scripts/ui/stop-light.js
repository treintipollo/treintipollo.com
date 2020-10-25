"use strict";

{
	class StopLigth
	{
		constructor(x, y, width, height, borderThickness, stage)
		{
			this._done = false;
		
			this._frame = null;
			this._lights = null;
			this._drawingArea = null;
			this._lightTimer = null;
			this._lightTimerBG = null;
			
			this._currentColor = 0;
			this._bgColor = 0;
			this._fgColor = 0;
			this._colors = null;
			this._lightsOn = 0;
			this._timerLenght = 0;
			this._timerSpeed = 0;
			
			this._frameEndPos = null;
			this._isScrolling = false;
			
			this._stage = null;
			this._sizeDifference = null;
			this._oldSize = null;

			this._frame = new Shape();
			
			this._frame.x = -width;
			this._frame.y = y;
			this._frame.regX = width / 2;
			this._frame.regY = height / 2;
			
			this._frameEndPos = new Point(x, y);
			this._fullRect = new Rectangle(0, 0, width, height);
			this._drawingArea = new Rectangle(borderThickness, borderThickness, width - borderThickness * 2, height - borderThickness * 2);
			
			this._lights = [];
			
			for (let i = 0; i < 3; i++)
			{
				this._lights.push(new Rectangle(((this._drawingArea.width / 3) * i) + this._drawingArea.x + borderThickness / 2, this._drawingArea.y + borderThickness, this._drawingArea.width / 3 - borderThickness, this._drawingArea.height * (2 / 3)));
			}
			
			this._lightTimer = new Rectangle(this._drawingArea.x + borderThickness / 2, this._drawingArea.y + this._drawingArea.height-(borderThickness*3), width-(borderThickness*3), borderThickness * 2);
			this._lightTimerBG = new Rectangle(this._drawingArea.x + borderThickness / 2, this._drawingArea.y + this._drawingArea.height-(borderThickness*3), width-(borderThickness*3), borderThickness * 2);
			this._timerLenght = width-(borderThickness*3);
		
			this._colors = [];
			this._colors.push(0xffff0000);
			this._colors.push(0xffffff00);
			this._colors.push(0xff00ff00);
			
			this._lightsOn = 0;
			this._sizeDifference = new Point();
			this._oldSize = new Point(width, height);
			
			this._done = false;
			this._isScrolling = true;
			
			this._stage = stage;
			this._stage.addChild(this._frame);
			
			stage = null;
		}
		
		Init(timerSpeed, bgColor, fgColor)
		{
			this._timerSpeed = timerSpeed;
			this._bgColor = bgColor;
			this._fgColor = fgColor;
		}
		
		Update()
		{
			if (!this._isScrolling)
			{
				if (this._lightTimer.width > 0)
				{
					this.CountDown();
				}
				else
				{
					this.FadeOut();
				}
			}
			else
			{
				this.ScrollIn();
			}
			
			this.Draw();
		}
		
		Clean()
		{
			this._stage.removeChild(this._frame);
			
			this._lights = null;
			this._drawingArea = null;
			this._lightTimer = null;
			this._lightTimerBG = null;
			this._colors = null;
			this._sizeDifference = null;
			this._oldSize = null;
			
			this._stage = null;
		}
		
		Draw()
		{
			this._frame.uncache();

			this._frame.graphics.clear();
			this._frame.graphics.beginFill(this._bgColor);
			this._frame.graphics.rect(0, 0, this._fullRect.width, this._fullRect.height);
			this._frame.graphics.endFill();
			this._frame.graphics.beginFill(this._fgColor);
			this._frame.graphics.rect(this._drawingArea.x, this._drawingArea.y, this._drawingArea.width, this._drawingArea.height);
			this._frame.graphics.endFill();

			this._frame.graphics.beginFill(this._bgColor);

			for (let i = 0; i < this._lights.length; i++)
			{
				this._frame.graphics.rect(this._lights[i].x, this._lights[i].y, this._lights[i].width, this._lights[i].height);
			}
			
			for (let i = 0; i < this._lightsOn; i++)
			{
				this._frame.graphics.beginFill(this._colors[i]);
				this._frame.graphics.rect(this._lights[i].x, this._lights[i].y, this._lights[i].width, this._lights[i].height);
			}
			
			this._frame.graphics.beginFill(0xff45D7DD);
			this._frame.graphics.rect(this._lightTimerBG.x, this._lightTimerBG.y, this._lightTimerBG.width, this._lightTimerBG.height);
			this._frame.graphics.endFill();

			this._frame.graphics.beginFill(0xff0000ff);
			this._frame.graphics.rect(this._lightTimer.x, this._lightTimer.y, this._lightTimer.width, this._lightTimer.height);
			this._frame.graphics.endFill();

			this._frame.cache(0, 0, this._fullRect.width, this._fullRect.height);
		}
		
		FadeOut()
		{
			if (this._lightsOn < this._lights.length)
			{
				this._lightsOn++;
				this._lightTimer.width = this._timerLenght;
				
				if (this._lightsOn < 3)
				{
					SoundManager.Play(Sounds.STOP_LIGHT);
				}
				else
				{
					SoundManager.Play(Sounds.LEVEL_SELECTED);
				}
			}
			else
			{
				if (this._frame.alpha >= 0)
				{
					this._frame.scaleX += 0.1;
					this._frame.scaleY += 0.1;
					
					this._sizeDifference.x = this._frame.width - this._oldSize.x;
					this._sizeDifference.y = this._frame.height - this._oldSize.y;
					this._oldSize.x = this._frame.width;
					this._oldSize.y = this._frame.height;
					
					this._frame.alpha -= 0.1;
					
					this._frame.x -= this._sizeDifference.x / 2;
					this._frame.y -= this._sizeDifference.y / 2;
				}
				else
				{
					this._done = true;
				}
			}
		}
		
		CountDown()
		{
			if (this._lightsOn === this._lights.length)
			{
				this._lightTimer.width = 0;
			}
			else
			{
				this._lightTimer.width -= this._timerSpeed;
			}
		}
		
		ScrollIn()
		{
			if (this._frame.x < this._frameEndPos.x)
			{
				this._frame.x += this._timerSpeed;
			}
			else
			{
				this._frame.x = this._frameEndPos.x;
				this._isScrolling = false;
			}
		}
	}

	window.StopLigth = StopLigth;
}